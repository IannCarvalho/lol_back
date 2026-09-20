import { describe, it, expect } from 'vitest';
import { getErrorCode, checkNotFound, catchFormatValidation } from '../util.js';

describe('getErrorCode', () => {
    it('returns 404 when the message includes "not found"', () => {
        expect(getErrorCode('Champion not found.')).toBe(404);
    });

    it('returns 403 when the message includes "not allowed"', () => {
        expect(getErrorCode('Action not allowed.')).toBe(403);
    });

    it('returns 400 as the default for any other message', () => {
        expect(getErrorCode('Something went wrong.')).toBe(400);
        expect(getErrorCode('')).toBe(400);
    });

    it('prioritizes 404 over 403 when both keywords are present', () => {
        // "not found" is checked first in the util implementation.
        expect(getErrorCode('not found and not allowed')).toBe(404);
    });
});

describe('checkNotFound', () => {
    it('throws with a "<name> not found." message when the object is null', () => {
        expect(() => checkNotFound(null, 'Champion')).toThrow('Champion not found.');
    });

    it('does not throw when an object exists', () => {
        expect(() => checkNotFound({ name: 'Ahri' }, 'Champion')).not.toThrow();
    });

    it('does not throw for empty array or other non-null values', () => {
        expect(() => checkNotFound([], 'Champion')).not.toThrow();
        expect(() => checkNotFound(undefined, 'Champion')).not.toThrow();
    });
});

// formatError is not exported, so it is exercised through catchFormatValidation,
// which throws an Error whose message equals the formatted output.
describe('formatError (via catchFormatValidation)', () => {
    it('formats a Mongoose CastError as an invalid-field message', () => {
        const castError = { name: 'CastError', path: 'slug', message: 'raw cast error' };
        expect(() => catchFormatValidation(castError)).toThrow("Invalid value for field 'slug'.");
    });

    it('formats a ValidationError as "Validation failed."', () => {
        const validationError = { name: 'ValidationError', message: 'raw validation error' };
        expect(() => catchFormatValidation(validationError)).toThrow('Validation failed.');
    });

    it('uses the error message for a generic error', () => {
        const genericError = { name: 'Error', message: 'boom' };
        expect(() => catchFormatValidation(genericError)).toThrow('boom');
    });

    it('falls back to "Unexpected error." when a generic error has no message', () => {
        const noMessage = { name: 'Error' };
        expect(() => catchFormatValidation(noMessage)).toThrow('Unexpected error.');
    });

    it('does not throw when the error is null', () => {
        expect(() => catchFormatValidation(null)).not.toThrow();
    });

    it('does not throw when the error is undefined', () => {
        expect(() => catchFormatValidation(undefined)).not.toThrow();
    });
});
