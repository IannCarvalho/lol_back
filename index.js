import express from 'express';
import championRouter from './controllers/champion';
import nationalityRouter from './controllers/nationality';

const router = express.Router();

router.use('/champion', championRouter);
router.use('/nationality', nationalityRouter);

export default router;
