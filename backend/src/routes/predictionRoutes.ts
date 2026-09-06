import { Router } from 'express';
import path from 'path';
import upload from '../config/multerConfig';
import { protect } from '../middleware/authMiddleware';
import { createPrediction, getPredictions, getPredictionById } from '../controllers/predictionController';

const router = Router();

router.post('/', protect, upload.single('image'), createPrediction);
router.get('/', protect, getPredictions);
router.get('/:id', protect, getPredictionById);

router.get('/:id/image', protect, async (req, res) => {
  const prisma = (await import('../config/prisma')).default;
  const prediction = await prisma.prediction.findFirst({
    where: { id: Number(req.params.id), userId: (req as any).userId }
  });

  if (!prediction) {
    return res.status(404).json({ error: 'not found' });
  }

  res.sendFile(path.resolve(prediction.imagePath));
});

export default router;