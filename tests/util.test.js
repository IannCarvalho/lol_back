import { describe, it, expect } from 'vitest';
import {
    getErrorCode,
    checkNotFound,
    mapMongooseError,
    AppError,
    NotFoundError,
    BadRequestError,
} from '../util.js';

describe('getErrorCode', () => {
    it('returns the statusCode of a typed AppError', () => {
        expect(getErrorCode(new AppError('nope', 403))).toBe(403);
        expect(getErrorCode(new NotFoundError('x not found.'))).toBe(404);
        expect(getErrorCode(new BadRequestError('bad'))).toBe(400);
    });

    it('returns 500 for an untyped error', () => {
        expect(getErrorCode(new Error('boom'))).toBe(500);
    });

    it('returns 500 for a null/undefined error', () => {
        expect(getErrorCode(null)).toBe(500);
        expect(getErrorCode(undefined)).toBe(500);
    });
});

describe('checkNotFound', () => {
    it('throws a "<name> not found." error when the object is null', () => {
        expect(() => checkNotFound(null, 'Champion')).toThrow('Champion not found.');
    });

    it('throws a NotFoundError (statusCode 404) for null', () => {
        try {
            checkNotFound(null, 'Nationality');
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.statusCode).toBe(404);
        }
    });

    it('does not throw when an object exists', () => {
        expect(() => checkNotFound({ name: 'Ahri' }, 'Champion')).not.toThrow();
    });

    it('does not throw for empty array or undefined', () => {
        expect(() => checkNotFound([], 'Champion')).not.toThrow();
        expect(() => checkNotFound(undefined, 'Champion')).not.toThrow();
    });
});

describe('mapMongooseError', () => {
    it('maps a Mongoose CastError to BadRequestError (400) naming the field', () => {
        const castError = { name: 'CastError', path: 'slug', message: 'raw cast error' };
        try {
            mapMongooseError(castError);
            throw new Error('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("Invalid value for field 'slug'.");
        }
    });

    it('maps a Mongoose ValidationError to BadRequestError (400)', () => {
        const validationError = { name: 'ValidationError', message: 'raw validation error' };
        try {
            mapMongooseError(validationError);
            throw new Error('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe('Validation failed.');
        }
    });

    it('re-throws an infrastructure error (network/timeout) INTACT', () => {
        const netError = new Error('connection timed out');
        netError.name = 'MongooseServerSelectionError';
        try {
            mapMongooseError(netError);
            throw new Error('should have thrown');
        } catch (error) {
            // Mesma instancia, nao convertida em 400: vira 5xx no handler.
            expect(error).toBe(netError);
            expect(error).not.toBeInstanceOf(BadRequestError);
            expect(error.statusCode).toBeUndefined();
        }
    });

    it('does nothing when the error is null or undefined', () => {
        expect(() => mapMongooseError(null)).not.toThrow();
        expect(() => mapMongooseError(undefined)).not.toThrow();
    });
});
