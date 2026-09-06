import { Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createPrediction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'no image uploaded' });
    }

    const filePath = req.file.path;

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const mlResponse = await axios.post(process.env.ML_API_URL as string, form, {
  headers: form.getHeaders(),
  timeout: 60000
});

    const { prediction, tumorType, confidence, heatmapUrl } = mlResponse.data;

    const saved = await prisma.prediction.create({
      data: {
        userId: req.userId as number,
        imagePath: filePath,
        prediction,
        tumorType,
        confidence,
        heatmapPath: heatmapUrl
      }
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'prediction failed' });
  }
};


export const getPredictions = async (req: AuthRequest, res: Response) => {
  const predictions = await prisma.prediction.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  });

  res.json(predictions);
};

export const getPredictionById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const prediction = await prisma.prediction.findFirst({
    where: { id: Number(id), userId: req.userId }
  });

  if (!prediction) {
    return res.status(404).json({ error: 'prediction not found' });
  }

  res.json(prediction);
};