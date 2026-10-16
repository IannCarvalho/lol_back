import express from 'express';
import {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
} from '../services/nationality.js';
import { cacheControl } from '../middleware.js';

const router = express.Router();

// Dados estaticos entre re-seeds: cacheaveis por 10 min no browser/CDN.
router.use(cacheControl(600));

// Handlers async diretos: no Express 5 a rejeicao e encaminhada ao error
// handler automaticamente (sem asyncHandler).

// Campeoes de uma nacionalidade. Declarada antes de '/:name' para que o
// segmento 'champions' nao seja capturado como um nome.
router.get('/champions/:nationality', async (req, res) => {
    const { nationality } = req.params;
    const champions = await getAllChampionsByNationality(nationality);
    res.status(200).send(champions);
});

router.get('/', async (req, res) => {
    const nationalities = await getAllNationalities();
    res.status(200).send(nationalities);
});

router.get('/:name', async (req, res) => {
    const { name } = req.params;
    const nationality = await getNationality(name);
    res.status(200).send(nationality);
});

export default router;
