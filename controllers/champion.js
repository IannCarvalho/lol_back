import express from 'express';
import { getChampion } from '../services/champion.js';
import { asyncHandler, cacheControl } from '../middleware.js';

const router = express.Router();

// Dados estáticos entre re-seeds: cacheáveis por 10 min no browser/CDN.
router.use(cacheControl(600));

router.get('/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const champion = await getChampion(slug);
    res.status(200).send(champion);
}));

export default router;
