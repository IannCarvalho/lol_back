import express from 'express';

import createAxios from '../axios';
const axios = createAxios();

const router = express.Router();

router.get('/by_account/:encryptedAccountId', (req, res) => {
    const { encryptedAccountId } = req.params;
    const path = 'summoner/v4/summoners/by-account/'
    axios.get(path + encryptedAccountId).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/by_name/:summonerName', (req, res) => {
    const { summonerName } = req.params;
    const path = 'summoner/v4/summoners/by-name/'
    axios.get(path + summonerName).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/byname/:encryptedPUUID', (req, res) => {
    const { encryptedPUUID } = req.params;
    const path = 'summoner/v4/summoners/by-puuid/'
    axios.get(path + encryptedPUUID).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/:encryptedSummonerId', (req, res) => {
    const { encryptedSummonerId } = req.params;
    const path = 'summoner/'
    axios.get(path + encryptedSummonerId).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router;