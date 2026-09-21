import express from 'express';
import { getChampion } from '../services/champion.js';
import { asyncHandler } from '../middleware.js';

const router = express.Router();

router.get('/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const champion = await getChampion(slug);
    res.status(200).send(champion);
}));

export default router;
