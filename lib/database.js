import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URL } = process.env;

const db = mongoose.createConnection(MONGO_URL);

db.on('error', error => {
    if (error.name === 'MongoNetworkError') {
        const fp = 'Not properly connected with MongoDB.';
        const sp = 'Check if your .env file is correctly filled and if you have the necessary permissions in MongoDB.';
        console.log(`${fp}\n${sp}`);
    };
    process.exit(1);
});

db.once('open', () => {
    console.log('Connection opened with Mongo Atlas');
});

export default db;