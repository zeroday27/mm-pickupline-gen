import crypto from 'crypto';
import mongoose from 'mongoose';

const CATEGORIES = [
  'movies',
  'music',
  'books',
  'tech',
  'football',
  'gaming',
  'travel',
  'food',
  'sports',
  'art',
  'fitness',
  'photography',
  'nature',
  'cooking',
  'dancing',
  'business',
  'education',
  'health',
  'beauty',
  'fashion',
  'pets',
  'science',
  'history',
  'other'
];

const STYLES = [
  'funny',
  'romantic',
  'other',
  'flirty',
  'cute',
  'cheesy',
  'poetic',
  'sarcastic',
  'sweet',
  'bold'
];

const LENGTHS = ['short'];
const REVIEW_STATUSES = ['staging', 'reviewed', 'approved', 'rejected'];

const normalizeLine = (text) => text
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

const toHash = (text) => crypto.createHash('sha256').update(text).digest('hex');

const pickupLineSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  burmese_text: {
    type: String,
    trim: true
  },
  english_source_text: {
    type: String,
    trim: true,
    default: ''
  },
  source_url: {
    type: String,
    trim: true,
    default: ''
  },
  license_note: {
    type: String,
    trim: true,
    default: ''
  },
  style: {
    type: String,
    required: true,
    enum: STYLES
  },
  length: {
    type: String,
    enum: LENGTHS,
    default: 'short'
  },
  tags: {
    type: [String],
    default: []
  },
  quality_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  safety_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 95
  },
  review_status: {
    type: String,
    enum: REVIEW_STATUSES,
    default: 'approved'
  },
  text_hash: {
    type: String,
    index: true,
    sparse: true
  },
  emoji: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'my'
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

pickupLineSchema.pre('validate', function onValidate(next) {
  const burmeseText = this.burmese_text || this.text;
  this.burmese_text = burmeseText;
  this.text = burmeseText;

  if (burmeseText && !this.text_hash) {
    this.text_hash = toHash(normalizeLine(burmeseText));
  }

  this.length = 'short';

  next();
});

export const PickupLine = mongoose.model('PickupLine', pickupLineSchema);
