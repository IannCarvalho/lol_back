import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';

// Services mockados: o app real monta os routers, mas as queries ao Mongo sao
// substituidas por mocks controlados por teste.
vi.mock('../services/champion.js', () => ({
    getChampion: vi.fn(),
}));
vi.mock('../services/nationality.js', () => ({
    getNationality: vi.fn(),
    getAllNationalities: vi.fn(),
    getAllChampionsByNationality: vi.fn(),
}));

import { getAllNationalities } from '../services/nationality.js';
import { createApp, defaultOrigins } from '../lib/createApp.js';

const ALLOWED = defaultOrigins[0]; // https://lolfront.vercel.app
const DENIED = 'https://evil.example.com';

describe('createApp — app real', () => {
    let app;

    beforeEach(() => {
        vi.clearAllMocks();
        app = createApp();
    });

    it('GET /status -> 200 texto e SEM Cache-Control', async () => {
        const res = await request(app).get('/status');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Status: Running');
        expect(res.headers['cache-control']).toBeUndefined();
    });

    it('rota desconhecida -> 404 JSON { message }', async () => {
        const res = await request(app).get('/nao-existe');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Route not found.' });
    });

    it('nao expoe o header x-powered-by', async () => {
        const res = await request(app).get('/status');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('origem permitida recebe access-control-allow-origin', async () => {
        getAllNationalities.mockResolvedValue([]);
        const res = await request(app).get('/nationality').set('Origin', ALLOWED);
        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe(ALLOWED);
    });

    it('origem NAO permitida -> 403 JSON sem ecoar a origem', async () => {
        const res = await request(app).get('/status').set('Origin', DENIED);
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ message: 'Origin not allowed by CORS.' });
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('sem header Origin -> 200 (curl/health check liberado)', async () => {
        const res = await request(app).get('/status');
        expect(res.status).toBe(200);
    });

    describe('erro inesperado do service', () => {
        let errorSpy;

        beforeEach(() => {
            errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            errorSpy.mockRestore();
        });

        it('-> 500 { message: "Internal server error." } e loga via console.error', async () => {
            getAllNationalities.mockRejectedValue(new Error('db exploded with internal detail'));
            const res = await request(app).get('/nationality');
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Internal server error.' });
            // Nao vaza a mensagem interna na resposta.
            expect(JSON.stringify(res.body)).not.toContain('db exploded');
            // Mas loga o erro completo no servidor.
            expect(errorSpy).toHaveBeenCalled();
        });
    });
});
