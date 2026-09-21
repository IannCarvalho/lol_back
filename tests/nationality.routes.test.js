import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the service so the router never touches the models / Mongo connection.
vi.mock('../services/nationality.js', () => ({
    getNationality: vi.fn(),
    getAllNationalities: vi.fn(),
    getAllChampionsByNationality: vi.fn(),
}));

import {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
} from '../services/nationality.js';
import nationalityRouter from '../controllers/nationality.js';
import { errorHandler } from '../middleware.js';
import { NotFoundError } from '../util.js';

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/nationality', nationalityRouter);
    app.use(errorHandler);
    return app;
};

describe('GET /nationality/:name', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 200 with the nationality data on success', async () => {
        const nationality = { name: 'Ionia', description: 'A land of magic.' };
        getNationality.mockResolvedValue(nationality);

        const res = await request(buildApp()).get('/nationality/ionia');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(nationality);
        expect(getNationality).toHaveBeenCalledWith('ionia');
    });

    it('returns 404 when the nationality is not found', async () => {
        getNationality.mockRejectedValue(new NotFoundError('Nationality not found.'));

        const res = await request(buildApp()).get('/nationality/unknown');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Nationality not found.' });
    });
});

describe('GET /nationality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 200 with the list of nationalities', async () => {
        const list = [{ name: 'Ionia' }, { name: 'Noxus' }];
        getAllNationalities.mockResolvedValue(list);

        const res = await request(buildApp()).get('/nationality');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(list);
        expect(getAllNationalities).toHaveBeenCalledOnce();
    });

    it('returns 404 when no nationalities are found', async () => {
        getAllNationalities.mockRejectedValue(new NotFoundError('Nationality not found.'));

        const res = await request(buildApp()).get('/nationality');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Nationality not found.' });
    });
});

describe('GET /nationality/champions/:nationality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 200 with the champions of a nationality', async () => {
        const champions = [{ name: 'Ahri' }, { name: 'Yasuo' }];
        getAllChampionsByNationality.mockResolvedValue(champions);

        const res = await request(buildApp()).get('/nationality/champions/ionia');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(champions);
        expect(getAllChampionsByNationality).toHaveBeenCalledWith('ionia');
    });

    it('returns 404 when no champions are found for the nationality', async () => {
        getAllChampionsByNationality.mockRejectedValue(new NotFoundError('Champion not found.'));

        const res = await request(buildApp()).get('/nationality/champions/unknown');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Champion not found.' });
    });
});
