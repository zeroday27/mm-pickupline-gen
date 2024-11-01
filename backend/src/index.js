import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PickupLine } from './models/pickupLine.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
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

app.post('/api/pickup-lines', async (req, res) => {
  try {
    const pickupLine = new PickupLine(req.body);
    await pickupLine.save();
    res.status(201).json(pickupLine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});