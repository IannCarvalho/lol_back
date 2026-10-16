// Entrypoint do servico (npm start / node app.js). Carrega o ambiente, abre a
// conexao com o Mongo, monta o app via createApp e sobe o listen. A montagem
// do app vive em lib/createApp.js (pura, testavel); aqui ficam os efeitos
// colaterais (env, banco, porta, sinais de desligamento).

import dotenv from 'dotenv';
import db from './lib/database.js';
import { createApp, defaultOrigins } from './lib/createApp.js';

dotenv.config();

const { PORT, ALLOWED_ORIGINS } = process.env;

// ALLOWED_ORIGINS (lista separada por virgula) sobrescreve o default; util
// para adicionar previews sem mexer no codigo.
const allowedOrigins = ALLOWED_ORIGINS
    ? ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : defaultOrigins;

const port = Number(PORT) || 5000;

const app = createApp({ allowedOrigins });

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// Desligamento gracioso: o Render manda SIGTERM em deploy/sleep. Fecha o
// server (para de aceitar novas conexoes) e a conexao do Mongo antes de sair,
// evitando conexoes meio-abertas.
const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        db.close(false).finally(() => process.exit(0));
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
