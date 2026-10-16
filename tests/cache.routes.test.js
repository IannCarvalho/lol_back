import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

// Mocka os services para o router nunca tocar os models / conexao Mongo.
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
import { createApp } from '../lib/createApp.js';

// Exercita o app REAL (createApp), nao uma replica — assim o teste reflete o
// que o servico serve de verdade.
const buildApp = () => createApp();

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

    it('NAO seta Cache-Control no /status (health check)', async () => {
        const res = await request(buildApp()).get('/status');
        expect(res.status).toBe(200);
        expect(res.headers['cache-control']).toBeUndefined();
    });
});
