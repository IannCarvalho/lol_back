import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import createAxios from './axios';

const { PORT, LOL_API_KEY } = process.env;

const app = express();
const axios = createAxios(LOL_API_KEY);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/status', (req, res) => {
    res.send('Status: Running');
});

app.post('/lolapi', (req, res) => {
    const { url } = req.body;
    axios.get(url).then(res => {
        console.log(res);
        res.status(200).send(res);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error);
    });
});

app.listen(PORT || 5000);

console.log(`App running on port ${PORT}`);
