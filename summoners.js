import express from 'express';

import createAxios from './axios';
const axios = createAxios();

const router = express.Router();

router.get('/:summonerName', (req, res) => {
    const { summonerName } = req.params;
    const path = 'summoner/v4/summoners/by-name/'
    axios.get(path + summonerName).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router;