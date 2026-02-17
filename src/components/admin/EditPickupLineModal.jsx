// src/components/admin/EditPickupLineModal.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const CATEGORIES = [
  'movies', 'music', 'books', 'tech', 'football', 'gaming', 'travel', 'food',
  'sports', 'art', 'fitness', 'photography', 'nature', 'cooking', 'dancing',
  'business', 'education', 'health', 'beauty', 'fashion', 'pets', 'science',
  'history', 'other'
];

const STYLES = ['funny', 'romantic', 'flirty', 'cute', 'cheesy', 'poetic', 'sarcastic', 'sweet', 'bold', 'other'];
const REVIEW_STATUSES = ['staging', 'reviewed', 'approved', 'rejected'];

const defaultLine = {
  text: '',
  burmese_text: '',
  english_source_text: '',
  source_url: '',
  license_note: '',
  category: '',
  style: '',
  length: 'short',
  review_status: 'staging',
  quality_score: 70,
  safety_score: 95,
  tags: [],
  language: 'my'
};

const EditPickupLineModal = ({ pickupLine, onClose, onSave }) => {
  const existingTags = Array.isArray(pickupLine?.tags)
    ? pickupLine.tags
    : typeof pickupLine?.tags === 'string'
      ? pickupLine.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const [formData, setFormData] = useState({
    ...defaultLine,
    ...pickupLine,
    tags: existingTags
  });

  const [tagInput, setTagInput] = useState(formData.tags.join(', '));

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedQuality = Number(formData.quality_score);
    const parsedSafety = Number(formData.safety_score);
    const cleanedText = (formData.burmese_text || formData.text || '').trim();

    const payload = {
      ...formData,
      length: 'short',
      text: cleanedText,
      burmese_text: cleanedText,
      quality_score: Number.isFinite(parsedQuality) ? Math.max(0, Math.min(100, parsedQuality)) : 70,
      safety_score: Number.isFinite(parsedSafety) ? Math.max(0, Math.min(100, parsedSafety)) : 95,
      tags: tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-xl">
        <CardHeader className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <CardTitle className="text-gray-900 dark:text-white">
            {pickupLine._id ? 'Edit' : 'Add'} Pickup Line
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-200">Burmese Text</Label>
              <textarea
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 
                          text-gray-900 dark:text-gray-100 border-gray-300 
                          dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={formData.burmese_text || formData.text}
                onChange={(e) => setFormData({
                  ...formData,
                  text: e.target.value,
                  burmese_text: e.target.value
                })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200">English Source Text</Label>
              <textarea
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={formData.english_source_text || ''}
                onChange={(e) => setFormData({ ...formData, english_source_text: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Category</Label>
                <select
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Style</Label>
                <select
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  required
                >
                  <option value="">Select Style</option>
                  {STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Review Status</Label>
                <select
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.review_status || 'staging'}
                  onChange={(e) => setFormData({ ...formData, review_status: e.target.value })}
                >
                  {REVIEW_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Language</Label>
                <input
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.language || 'my'}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Quality Score (0-100)</Label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.quality_score}
                  onChange={(e) => setFormData({ ...formData, quality_score: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Safety Score (0-100)</Label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.safety_score}
                  onChange={(e) => setFormData({ ...formData, safety_score: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Source URL</Label>
                <input
                  type="url"
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.source_url || ''}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-200">License Note</Label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                  value={formData.license_note || ''}
                  onChange={(e) => setFormData({ ...formData, license_note: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 dark:text-gray-200">Tags (comma separated)</Label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="movie-quote, pun, playful"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-white dark:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPickupLineModal;
