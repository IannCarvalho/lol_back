import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mocka os services para o router nunca tocar os models / conexão Mongo.
vi.mock('../services/champion.js', () => ({
    getChampion: vi.fn(),
}));
vi.mock('../services/nationality.js', () => ({
    getNationality: vi.fn(),
    getAllNationalities: vi.fn(),
    getAllChampionsByNationality: vi.fn(),
}));

import { getChampion } from '../services/champion.js';
import {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
} from '../services/nationality.js';
import championRouter from '../controllers/champion.js';
import nationalityRouter from '../controllers/nationality.js';
import { errorHandler } from '../middleware.js';

// App parecido com o app.js real: routers de dados + /status fora deles.
const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/champion', championRouter);
    app.use('/nationality', nationalityRouter);
    app.get('/status', (req, res) => res.send('Status: Running'));
    app.use(errorHandler);
    return app;
};

const EXPECTED = 'public, max-age=600';

describe('Cache-Control nas rotas GET de dados', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('seta Cache-Control em GET /champion/:slug', async () => {
        getChampion.mockResolvedValue({ slug: 'ahri' });
        const res = await request(buildApp()).get('/champion/ahri');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBe(EXPECTED);
    });

    it('seta Cache-Control em GET /nationality', async () => {
        getAllNationalities.mockResolvedValue([{ name: 'Ionia' }]);
        const res = await request(buildApp()).get('/nationality');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBe(EXPECTED);
    });

    it('seta Cache-Control em GET /nationality/:name', async () => {
        getNationality.mockResolvedValue({ name: 'Ionia' });
        const res = await request(buildApp()).get('/nationality/ionia');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBe(EXPECTED);
    });

    it('seta Cache-Control em GET /nationality/champions/:nationality', async () => {
        getAllChampionsByNationality.mockResolvedValue([{ name: 'Ahri' }]);
        const res = await request(buildApp()).get('/nationality/champions/ionia');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBe(EXPECTED);
    });

    it('NÃO seta Cache-Control no /status (health check)', async () => {
        const res = await request(buildApp()).get('/status');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBeUndefined();
    });
});
