// backend/src/index.js
import express from 'express';
import cors from 'cors';
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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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

// Public routes
app.get('/api/pickup-lines', async (req, res) => {
  try {
    const { category, style } = req.query;
    const query = {
      $or: [
        { review_status: 'approved' },
        { review_status: { $exists: false } }
      ]
    };
    if (category) query.category = category;
    if (style) query.style = style;
    query.length = 'short';

    const pickupLines = await PickupLine.find(query);
    res.json(pickupLines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database-first recommendation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { interest, style, language = 'my' } = req.body;

    if (!interest || !style) {
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
    res.status(500).json({ error: error.message });
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
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
