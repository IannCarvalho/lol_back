import express from 'express';

import createAxios from '../axios';
const axios = createAxios();

const router = express.Router();

router.get('/match_general_details/:matchId', (req, res) => {
    const path = `match/v4/matches/${req.params.matchId}/`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/match_frame_details/:matchId', (req, res) => {
    const path = `match/v4/timelines/by-match/${req.params.matchId}/`
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.get('/match_lists/:encryptedAccountId', (req, res) => {
    const queries = req.query;
    const queryString = Object.keys(queries).map(key => key + '=' + queries[key]).join('&');
    const path = `match/v4/matchlists/by-account/${req.params.encryptedAccountId}?${queryString}`;
    axios.get(path).then(lolResponse => {
        const { data } = lolResponse;
        data.totalPages = Math.ceil(data.totalGames / 5);
        res.status(200).send(data);
    }).catch(error => {
        res.status(400).send(error);
    });
});

export default router;