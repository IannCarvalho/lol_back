import express from 'express';
import summonersRouter from './controllers/summoner';

const router = express.Router();

router.use('/summoner', summonersRouter);

export default router;
