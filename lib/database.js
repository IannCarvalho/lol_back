import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
    console.error('MONGO_URL is not set. Fill your .env (see .env_template).');
    process.exit(1);
}

// Mongoose já reconecta sozinho quando a conexão cai. Em free tiers que
// "dormem" (ex.: Render), a primeira request após o cold start pode pegar o
// banco ainda respondendo devagar — por isso NÃO derrubamos o processo em
// erro de rede: apenas logamos e deixamos o driver tentar reconectar.
const db = mongoose.createConnection(MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
});

db.on('error', error => {
    console.error(`MongoDB connection error: ${error.name} - ${error.message}`);
    if (error.name === 'MongoNetworkError') {
        console.error(
            'Check if your .env is correctly filled and if you have the '
            + 'necessary permissions/IP allowlist in MongoDB Atlas.'
        );
    }
    // Sem process.exit: o Mongoose reabre a conexão automaticamente.
});

db.on('connected', () => {
    console.log('Connection opened with Mongo Atlas');
});

db.on('disconnected', () => {
    console.warn('MongoDB disconnected. Waiting for automatic reconnection...');
});

export default db;
