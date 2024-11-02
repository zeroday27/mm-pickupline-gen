import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PickupLine } from './models/pickupLine.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration that accepts all local network requests
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
}));

// Add headers to all responses
app.use((req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    origin: req.headers.origin,
    referer: req.headers.referer
  });
  next();
});

// Routes
app.get('/api/pickup-lines', async (req, res) => {
  const { category, style } = req.query;
  console.log('Received request for pickup lines:', { category, style }); // Debug log
  
  try {
    const query = {};
    if (category) query.category = category;
    if (style) query.style = style;
    
    const pickupLines = await PickupLine.find(query);
    console.log(`Found ${pickupLines.length} pickup lines`); // Debug log
    
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

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
  console.log(`Also accessible at http://<your-ip>:${PORT}`);
});
