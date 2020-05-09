import express from 'express';
import summonersRouter from './summoners';

const router = express.Router();

router.use('/summoners', summonersRouter);

export default router;
