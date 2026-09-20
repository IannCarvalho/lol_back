import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import v1Router from './index.js';
import db from './lib/database.js';

dotenv.config();

const { PORT, ALLOWED_ORIGINS } = process.env;

// Origens permitidas: por padrão, o frontend em produção (Vercel) e o dev local.
// Pode ser sobrescrito/estendido via env var ALLOWED_ORIGINS (lista separada
// por vírgula), útil para adicionar previews sem mexer no código.
const defaultOrigins = [
    'https://lolfront.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];
const allowedOrigins = ALLOWED_ORIGINS
    ? ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : defaultOrigins;

const app = express();
app.use(cors({
    origin(origin, callback) {
        // Sem header Origin (ex.: curl, health check do Render) -> libera.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use('/', v1Router);

app.get('/status', (req, res) => {
    res.send('Status: Running');
});

app.listen(PORT || 5000);

console.log(`App running on port ${PORT}`);
