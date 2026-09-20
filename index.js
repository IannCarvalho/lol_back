import express from 'express';
import championRouter from './controllers/champion.js';
import nationalityRouter from './controllers/nationality.js';

const router = express.Router();

router.use('/champion', championRouter);
router.use('/nationality', nationalityRouter);

export default router;
