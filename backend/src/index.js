// backend/src/index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PickupLine } from './models/pickupLine.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Admin routes
app.use('/api/admin', adminRoutes);

// Main pickup lines route
app.get('/api/pickup-lines', async (req, res) => {
  const { category, style } = req.query;
  try {
    const query = {};
    if (category) query.category = category;
    if (style) query.style = style;
    
    const pickupLines = await PickupLine.find(query);
    res.json(pickupLines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/pickuplines')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});