import mongoose from 'mongoose';

const pickupLineSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['movies', 'music', 'books', 'tech', 'football', 'gaming']
  },
  text: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true,
    enum: ['funny', 'romantic', 'other']
  },
  emoji: String,
  language: {
    type: String,
    default: 'my' // myanmar
  }
}, {
  timestamps: true
});

export const PickupLine = mongoose.model('PickupLine', pickupLineSchema);
