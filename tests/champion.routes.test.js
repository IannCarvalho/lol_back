import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the service so the router never touches the models / Mongo connection.
vi.mock('../services/champion.js', () => ({
    getChampion: vi.fn(),
}));

import { getChampion } from '../services/champion.js';
import championRouter from '../controllers/champion.js';

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/champion', championRouter);
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
        getChampion.mockRejectedValue(new Error('Champion not found.'));

        const res = await request(buildApp()).get('/champion/unknown');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Champion not found.' });
    });

    it('returns 400 for a generic service error', async () => {
        getChampion.mockRejectedValue(new Error("Invalid value for field 'slug'."));

        const res = await request(buildApp()).get('/champion/bad');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Invalid value for field 'slug'." });
    });
});
