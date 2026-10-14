import express from 'express';
import {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
} from '../services/nationality.js';
import { asyncHandler, cacheControl } from '../middleware.js';

const router = express.Router();

// Dados estáticos entre re-seeds: cacheáveis por 10 min no browser/CDN.
router.use(cacheControl(600));

// Campeões de uma nacionalidade. Declarada antes de '/:name' para que o
// segmento 'champions' não seja capturado como um nome.
router.get('/champions/:nationality', asyncHandler(async (req, res) => {
    const { nationality } = req.params;
    const champions = await getAllChampionsByNationality(nationality);
    res.status(200).send(champions);
}));

router.get('/', asyncHandler(async (req, res) => {
    const nationalities = await getAllNationalities();
    res.status(200).send(nationalities);
}));

router.get('/:name', asyncHandler(async (req, res) => {
    const { name } = req.params;
    const nationality = await getNationality(name);
    res.status(200).send(nationality);
}));

export default router;
