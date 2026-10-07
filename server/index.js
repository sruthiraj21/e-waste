import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'EcoCycle E-Waste Circularity Platform',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🌱 EcoCycle Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for AI Scans, Collector Logistics & Supabase operations.`);
});
