import express from 'express';
import summonerRouter from './controllers/summoner';
import matchRouter from './controllers/match';
import championRouter from './controllers/champion';
import nationalityRouter from './controllers/nationality';

const router = express.Router();

router.use('/summoner', summonerRouter);
router.use('/match', matchRouter);
router.use('/champion', championRouter);
router.use('/nationality', nationalityRouter);

export default router;
