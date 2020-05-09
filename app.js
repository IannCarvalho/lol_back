import express from 'express';
import dotenv from 'dotenv';
import v1Router from '.';
dotenv.config();

const { PORT, LOL_API_KEY } = process.env;

const app = express();
app.use(express.json());
app.use('/', v1Router);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/status', (req, res) => {
    res.send('Status: Running');
});

app.listen(PORT || 5000);

console.log(`App running on port ${PORT}`);
