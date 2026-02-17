// backend/src/routes/admin.js
import express from 'express';
import { PickupLine } from '../models/pickupLine.js';

const router = express.Router();

// Get all pickup lines with search and filters
router.get('/pickup-lines', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      style,
      review_status
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const query = {};
    
    if (search) {
      query.text = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (style) {
      query.style = style;
    }

    query.length = 'short';

    if (review_status) {
      query.review_status = review_status;
    }

    const [pickupLines, total] = await Promise.all([
      PickupLine.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      PickupLine.countDocuments(query)
    ]);

    res.json({
      pickupLines,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new pickup line
router.post('/pickup-lines', async (req, res) => {
  try {
    const pickupLine = new PickupLine(req.body);
    await pickupLine.save();
    res.status(201).json(pickupLine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update pickup line
router.put('/pickup-lines/:id', async (req, res) => {
  try {
    const pickupLine = await PickupLine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pickupLine) {
      return res.status(404).json({ error: 'Pickup line not found' });
    }
    res.json(pickupLine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete pickup line
router.delete('/pickup-lines/:id', async (req, res) => {
  try {
    const pickupLine = await PickupLine.findByIdAndDelete(req.params.id);
    if (!pickupLine) {
      return res.status(404).json({ error: 'Pickup line not found' });
    }
    res.json({ message: 'Pickup line deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify login
router.get('/login', (req, res) => {
  res.json({ message: 'Authenticated successfully' });
});

export { router as default };
