// backend/src/index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { PickupLine } from './models/pickupLine.js';
import { authMiddleware } from './middleware/auth.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.get('/api/pickup-lines', async (req, res) => {
  try {
    const { category, style } = req.query;
    const query = {};
    if (category) query.category = category;
    if (style) query.style = style;
    
    const pickupLines = await PickupLine.find(query);
    res.json(pickupLines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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