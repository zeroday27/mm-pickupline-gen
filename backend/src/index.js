// backend/src/index.js
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env') });

import { PickupLine } from './models/pickupLine.js';
import { authMiddleware } from './middleware/auth.js';
import adminRoutes from './routes/admin.js';
import { recommendPickupLine } from './services/recommendationService.js';

const app = express();
if (process.env.WORKER_PROXY === '1') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('query parser', 'simple');
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://frontend:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100kb' }));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false }));
app.use('/api/generate', rateLimit({ windowMs: 60_000, max: 10, message: { error: 'Too many requests, try again later' } }));

if (process.env.SITE_DIR) {
  app.use(express.static(process.env.SITE_DIR));
  app.get('/admin', (_req, res) => res.sendFile(path.join(process.env.SITE_DIR, 'index.html')));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Pickup Line Generator API',
    version: '1.0.0',
    endpoints: {
      pickupLines: '/api/pickup-lines',
      admin: '/api/admin'
    }
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

// Public routes
app.get('/api/pickup-lines', async (req, res) => {
  try {
    const { category, style } = req.query;
    if ([category, style].some(value => value !== undefined && typeof value !== 'string')) {
      return res.status(400).json({ error: 'Invalid filter' });
    }
    const query = {
      $or: [
        { review_status: 'approved' },
        { review_status: { $exists: false } }
      ]
    };
    if (category) query.category = { $eq: category };
    if (style) query.style = { $eq: style };
    query.length = 'short';

    const pickupLines = await PickupLine.find(query);
    res.json(pickupLines);
  } catch (error) {
    console.error('Error fetching pickup lines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Database-first recommendation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { interest, style, language = 'my' } = req.body;

    if (![interest, style, language].every(value => typeof value === 'string' && value.trim() && value.length <= 80)) {
      return res.status(400).json({
        error: 'Missing required fields: interest, style'
      });
    }

    const recommendation = await recommendPickupLine(PickupLine, {
      interest,
      style,
      length: 'short',
      language
    });

    if (!recommendation) {
      return res.status(404).json({
        error: 'No curated pickup lines found for the selected criteria'
      });
    }

    res.json(recommendation);
  } catch (error) {
    console.error('Error generating pickup line:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy compatibility endpoint for frontend
app.get('/api/ai-status', (req, res) => {
  res.json({
    aiEnabled: false,
    message: 'Curated database mode is active'
  });
});

// Protected admin routes
app.use('/api/admin', authMiddleware, adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/pickuplines')
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.error('MongoDB connection failed'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
