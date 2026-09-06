import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const totalScans = await prisma.prediction.count({
      where: { userId }
    });

    const tumorDetected = await prisma.prediction.count({
      where: { userId, prediction: 'Tumor Detected' }
    });

    const noTumor = await prisma.prediction.count({
      where: { userId, prediction: 'No Tumor' }
    });

    const recentPredictions = await prisma.prediction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      totalScans,
      tumorDetected,
      noTumor,
      recentPredictions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not load dashboard stats' });
  }
};