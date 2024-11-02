import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PickupLine } from './models/pickupLine.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration aligned with your environments
const allowedOrigins = [
  'https://pickupmm.noclouds.space',    // UAT/Production
  'http://localhost:5173',              // Local Vite development
  'http://localhost:3000'               // Local API testing
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// MongoDB connection using Docker Compose configuration
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Don't exit process in development to allow for MongoDB container startup
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// Routes
app.get('/api/pickup-lines', async (req, res) => {
  const { category, style } = req.query;
  try {
    const query = {};
    if (category) query.category = category;
    if (style) query.style = style;
    
    const pickupLines = await PickupLine.find(query);
    
    if (!pickupLines || pickupLines.length === 0) {
      return res.status(404).json({ 
        message: 'No pickup lines found for the given criteria' 
      });
    }
    
    res.json(pickupLines);
  } catch (error) {
    console.error('Error fetching pickup lines:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pickup-lines', async (req, res) => {
  try {
    const pickupLine = new PickupLine(req.body);
    await pickupLine.save();
    res.status(201).json(pickupLine);
  } catch (error) {
    console.error('Error creating pickup line:', error);
    res.status(400).json({ error: error.message });
  }
});

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});