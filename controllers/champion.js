import express from 'express';
import { getChampion } from '../services/champion.js';
import { cacheControl } from '../middleware.js';

const router = express.Router();

// Dados estaticos entre re-seeds: cacheaveis por 10 min no browser/CDN.
router.use(cacheControl(600));

// Handler async direto: no Express 5 uma rejeicao e encaminhada ao error
// handler automaticamente (sem precisar de um wrapper asyncHandler).
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    const champion = await getChampion(slug);
    res.status(200).send(champion);
});

export default router;
