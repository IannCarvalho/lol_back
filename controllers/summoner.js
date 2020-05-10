import express from 'express';

import createAxios from '../axios';
const axios = createAxios();

const router = express.Router();

router.get('/by_account/:encryptedAccountId', (req, res) => {
    const path = `summoner/v4/summoners/by-account/${req.params.encryptedAccountId}`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/by_name/:summonerName', (req, res) => {
    const path = `summoner/v4/summoners/by-name/${req.params.summonerName}`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/by_puuid/:encryptedPUUID', (req, res) => {
    const path = `summoner/v4/summoners/by-puuid/${req.params.encryptedPUUID}`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/:encryptedSummonerId', (req, res) => {
    const path = `summoner/v4/summoners/${req.params.encryptedSummonerId}`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/champion_masteries/:encryptedSummonerId', (req, res) => {
    const path = `/champion-mastery/v4/champion-mastery/by-summoner/${req.params.encryptedSummonerId}`
    req.query.champion ? path += `/by-champion/${champion}/` : path
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/total_maesteries/:encryptedSummonerId', (req, res) => {
    const path = `/champion-mastery/v4/scores/by-summoner/${encryptedSummonerId}`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

module.exports = router;