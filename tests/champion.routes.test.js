import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the service so the router never touches the models / Mongo connection.
vi.mock('../services/champion.js', () => ({
    getChampion: vi.fn(),
}));

import { getChampion } from '../services/champion.js';
import championRouter from '../controllers/champion.js';
import { errorHandler } from '../middleware.js';
import { NotFoundError, BadRequestError } from '../util.js';

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/champion', championRouter);
    app.use(errorHandler);
    return app;
};

describe('GET /champion/:name', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 200 with the champion data on success', async () => {
        const champion = { name: 'Ahri', slug: 'ahri', nationality: 'Ionia' };
        getChampion.mockResolvedValue(champion);

        const res = await request(buildApp()).get('/champion/ahri');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(champion);
        expect(getChampion).toHaveBeenCalledWith('ahri');
    });

    it('returns 404 when the service throws a "not found" error', async () => {
        getChampion.mockRejectedValue(new NotFoundError('Champion not found.'));

        const res = await request(buildApp()).get('/champion/unknown');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Champion not found.' });
    });

    it('returns 400 for a bad-request service error', async () => {
        getChampion.mockRejectedValue(new BadRequestError("Invalid value for field 'slug'."));

        const res = await request(buildApp()).get('/champion/bad');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid value for field 'slug'." });
    });

    it('returns 500 with a generic message for an unexpected (untyped) error', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        getChampion.mockRejectedValue(new Error('boom'));

        const res = await request(buildApp()).get('/champion/kaboom');

        expect(res.status).toBe(500);
        // Nao vaza a mensagem interna: responde generico e loga no servidor.
        expect(res.body).toEqual({ message: 'Internal server error.' });
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
