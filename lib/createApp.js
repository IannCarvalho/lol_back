// Fabrica do app Express. Pura e testavel: monta CORS, JSON, routers, /status,
// 404 JSON e o error handler central — SEM listen e SEM importar a conexao do
// Mongo. O entrypoint (app.js) injeta as origens permitidas, importa o banco
// e faz o listen; os testes exercitam este mesmo app com os services mockados.

import express from 'express';
import cors from 'cors';
import v1Router from '../index.js';
import { errorHandler } from '../middleware.js';
import { AppError, NotFoundError } from '../util.js';

// Origens permitidas por padrao: o frontend em producao (Vercel) e o dev local.
// Exportado para teste/doc. O entrypoint pode sobrescrever via ALLOWED_ORIGINS.
export const defaultOrigins = [
    'https://lolfront.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];

export const createApp = ({ allowedOrigins = defaultOrigins } = {}) => {
    const app = express();

    app.disable('x-powered-by');

    app.use(cors({
        origin(origin, callback) {
            // Sem header Origin (ex.: curl, health check do Render) -> libera.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Rejeita como 403 tipado (sem ecoar a origem na resposta). Sem o
            // statusCode o cors emitiria um Error generico que viraria 500.
            return callback(new AppError('Origin not allowed by CORS.', 403));
        },
        // A API e so leitura: anuncia apenas os metodos que existem.
        methods: ['GET', 'HEAD'],
    }));

    app.use(express.json());

    app.use('/', v1Router);

    app.get('/status', (req, res) => {
        res.send('Status: Running');
    });

    // 404 JSON para rotas desconhecidas, mantendo o contrato { message } em vez
    // do HTML "Cannot GET /x" que o Express 5 devolveria por padrao.
    app.use((req, res, next) => {
        next(new NotFoundError('Route not found.'));
    });

    // Error handler central: deve ser o ultimo a ser registrado.
    app.use(errorHandler);

    return app;
};
