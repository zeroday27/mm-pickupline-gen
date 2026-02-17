// backend/src/routes/admin.js
import express from 'express';
import { PickupLine } from '../models/pickupLine.js';

const router = express.Router();

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whitelist of allowed fields for create/update
const ALLOWED_FIELDS = [
  'text', 'burmese_text', 'english_source_text', 'source_url', 'license_note',
  'category', 'style', 'length', 'review_status', 'quality_score',
  'safety_score', 'tags', 'language', 'emoji'
];

const pickFields = (body) => {
  const picked = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
};

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
      query.text = { $regex: escapeRegex(search), $options: 'i' };
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
    console.error('Error fetching admin pickup lines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new pickup line
router.post('/pickup-lines', async (req, res) => {
  try {
    const safeBody = pickFields(req.body);
    const pickupLine = new PickupLine(safeBody);
    await pickupLine.save();
    res.status(201).json(pickupLine);
  } catch (error) {
    console.error('Error creating pickup line:', error);
    res.status(400).json({ error: 'Invalid pickup line data' });
  }
});

// Update pickup line
router.put('/pickup-lines/:id', async (req, res) => {
  try {
    const safeBody = pickFields(req.body);
    const pickupLine = await PickupLine.findByIdAndUpdate(
      req.params.id,
      safeBody,
      { new: true, runValidators: true }
    );
    if (!pickupLine) {
      return res.status(404).json({ error: 'Pickup line not found' });
    }
    res.json(pickupLine);
  } catch (error) {
    console.error('Error updating pickup line:', error);
    res.status(400).json({ error: 'Invalid pickup line data' });
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
    console.error('Error deleting pickup line:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify login
router.get('/login', (req, res) => {
  res.json({ message: 'Authenticated successfully' });
});

export { router as default };
