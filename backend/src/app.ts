import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import predictionRoutes from './routes/predictionRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/dashboard', dashboardRoutes);

export default app;