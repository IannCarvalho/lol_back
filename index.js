import express from 'express';
import summonerRouter from './controllers/summoner';
import matchRouter from './controllers/match';

const router = express.Router();

router.use('/summoner', summonerRouter);
router.use('/match', matchRouter);

export default router;
