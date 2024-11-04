import express from 'express';
import { PickupLine } from '../models/pickupLine.js';

const router = express.Router();

// Get all pickup lines with pagination
router.get('/pickup-lines', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.style) filter.style = req.query.style;

    const [pickupLines, total] = await Promise.all([
      PickupLine.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      PickupLine.countDocuments(filter)
    ]);

    res.json({
      pickupLines,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
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

export default router;