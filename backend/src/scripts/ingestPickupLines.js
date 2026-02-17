import crypto from 'crypto';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { PickupLine } from '../models/pickupLine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../../.env') });

const ALLOWED_CATEGORIES = new Set([
  'movies', 'music', 'books', 'tech', 'football', 'gaming', 'travel', 'food',
  'sports', 'art', 'fitness', 'photography', 'nature', 'cooking', 'dancing',
  'business', 'education', 'health', 'beauty', 'fashion', 'pets', 'science',
  'history', 'other'
]);
const ALLOWED_STYLES = new Set([
  'funny', 'romantic', 'other', 'flirty', 'cute', 'cheesy', 'poetic', 'sarcastic', 'sweet', 'bold'
]);
const ALLOWED_LENGTHS = new Set(['short']);
const ALLOWED_REVIEW_STATUS = new Set(['staging', 'reviewed', 'approved', 'rejected']);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    file: '',
    dryRun: false,
    defaultReviewStatus: 'staging',
    defaultLanguage: 'my'
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--file') options.file = args[i + 1] || '';
    if (arg === '--dry-run') options.dryRun = true;
    if (arg === '--default-review-status') options.defaultReviewStatus = args[i + 1] || options.defaultReviewStatus;
    if (arg === '--default-language') options.defaultLanguage = args[i + 1] || options.defaultLanguage;
  }

  return options;
};

const normalizeLine = (text) => text
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

const hashLine = (text) => crypto.createHash('sha256').update(normalizeLine(text)).digest('hex');

const sanitizeList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((x) => x.trim()).filter(Boolean);
  return [];
};

const coerceScore = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, numeric));
};

const toDoc = (item, defaults) => {
  const burmeseText = String(item.burmese_text || item.text || '').trim();
  const category = String(item.category || '').trim().toLowerCase();
  const style = String(item.style || '').trim().toLowerCase();
  const reviewStatus = String(item.review_status || defaults.defaultReviewStatus).trim().toLowerCase();
  const length = 'short';
  const language = String(item.language || defaults.defaultLanguage).trim().toLowerCase();

  if (!burmeseText) return { error: 'missing text' };
  if (!ALLOWED_CATEGORIES.has(category)) return { error: `invalid category: ${category}` };
  if (!ALLOWED_STYLES.has(style)) return { error: `invalid style: ${style}` };
  if (!ALLOWED_REVIEW_STATUS.has(reviewStatus)) return { error: `invalid review_status: ${reviewStatus}` };
  if (!ALLOWED_LENGTHS.has(length)) return { error: `invalid length: ${length}` };

  return {
    doc: {
      text: burmeseText,
      burmese_text: burmeseText,
      english_source_text: String(item.english_source_text || '').trim(),
      source_url: String(item.source_url || '').trim(),
      license_note: String(item.license_note || '').trim(),
      category,
      style,
      length,
      review_status: reviewStatus,
      language,
      quality_score: coerceScore(item.quality_score, 70),
      safety_score: coerceScore(item.safety_score, 95),
      tags: sanitizeList(item.tags),
      isAIGenerated: false,
      text_hash: hashLine(burmeseText)
    }
  };
};

const loadItems = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Input JSON must be an array');
  }
  return parsed;
};

const run = async () => {
  const options = parseArgs();
  if (!options.file) {
    throw new Error('Missing required --file argument');
  }
  if (!ALLOWED_REVIEW_STATUS.has(options.defaultReviewStatus)) {
    throw new Error(`Invalid --default-review-status: ${options.defaultReviewStatus}`);
  }

  const resolvedFile = path.isAbsolute(options.file)
    ? options.file
    : path.resolve(process.cwd(), options.file);

  const items = await loadItems(resolvedFile);
  const records = [];
  const errors = [];
  const seenInBatch = new Set();

  for (let idx = 0; idx < items.length; idx += 1) {
    const row = items[idx];
    const { doc, error } = toDoc(row, options);
    if (error) {
      errors.push(`row ${idx + 1}: ${error}`);
      continue;
    }

    if (seenInBatch.has(doc.text_hash)) {
      errors.push(`row ${idx + 1}: duplicate text in input batch`);
      continue;
    }
    seenInBatch.add(doc.text_hash);
    records.push(doc);
  }

  if (errors.length) {
    console.log('Validation errors:');
    errors.forEach((entry) => console.log(`- ${entry}`));
    throw new Error(`Found ${errors.length} invalid row(s)`);
  }

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/pickuplines');

  const hashes = records.map((row) => row.text_hash);
  const existing = await PickupLine.find({ text_hash: { $in: hashes } }).select('text_hash');
  const existingHashes = new Set(existing.map((row) => row.text_hash));
  const toInsert = records.filter((row) => !existingHashes.has(row.text_hash));

  console.log(`Loaded ${items.length} rows from ${resolvedFile}`);
  console.log(`Validated ${records.length} rows`);
  console.log(`Skipped existing duplicates: ${records.length - toInsert.length}`);

  if (options.dryRun) {
    console.log('Dry run mode enabled; nothing inserted.');
  } else if (toInsert.length) {
    await PickupLine.insertMany(toInsert, { ordered: false });
    console.log(`Inserted ${toInsert.length} staging row(s).`);
  } else {
    console.log('No new rows to insert.');
  }

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(`Ingestion failed: ${error.message}`);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
