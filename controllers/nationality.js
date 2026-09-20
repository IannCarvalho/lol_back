import express from 'express';
import { getNationality, getAllNationalites, getAllChampionsByNationality } from '../services/nationality.js';
import { getErrorCode } from '../util.js';

const router = express.Router();

router.get('/:name', (req, res) => {
    const { name } = req.params;
    getNationality(name).then((champion) => {
        res.status(200).send(champion);
    }).catch((error) => {
        const { message } = error;
        const code = getErrorCode(message);
        res.status(code).send({ message });
    });
});

router.get('/', (req, res) => {
    getAllNationalites().then((nationalities) => {
        res.status(200).send(nationalities);
    }).catch((error) => {
        const { message } = error;
        const code = getErrorCode(message);
        res.status(code).send({ message });
    });
});

router.get('/champions/:nationality', (req, res) => {
    const { nationality } = req.params;
    getAllChampionsByNationality(nationality).then((champions) => {
        res.status(200).send(champions);
    }).catch((error) => {
        const { message } = error;
        const code = getErrorCode(message);
        res.status(code).send({ message });
    });
});

export default router;