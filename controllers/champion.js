import express from 'express';
import { getChampion } from '../services/champion';
import { getErrorCode } from '../util';

const router = express.Router();

router.get('/:name', (req, res) => {
    const { name } = req.params;
    getChampion(name).then((champion) => {
        res.status(200).send(champion);
    }).catch((error) => {
        const { message } = error;
        const code = getErrorCode(message);
        res.status(code).send({ message });
    });
});

export default router;