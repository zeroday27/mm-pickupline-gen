import React from 'react';
import { ArrowRight } from 'lucide-react';

const interests = [
  // Original categories
  { value: 'movies', label: 'Movies', emoji: '🎬' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'books', label: 'Literature', emoji: '📚' },
  { value: 'tech', label: 'Technology', emoji: '💻' },
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  // New categories
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'sports', label: 'Sports', emoji: '🏆' },
  { value: 'art', label: 'Art', emoji: '🎨' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'photography', label: 'Photography', emoji: '📷' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
  { value: 'dancing', label: 'Dancing', emoji: '💃' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'education', label: 'Education', emoji: '🎓' },
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'beauty', label: 'Beauty', emoji: '💄' },
  { value: 'fashion', label: 'Fashion', emoji: '👗' },
  { value: 'pets', label: 'Pets', emoji: '🐾' },
  { value: 'science', label: 'Science', emoji: '🔬' },
  { value: 'history', label: 'History', emoji: '🏛️' },
];

const styles = [
  { value: 'funny', label: 'Funny', emoji: '😂' },
  { value: 'romantic', label: 'Romantic', emoji: '🥰' },
  { value: 'flirty', label: 'Flirty', emoji: '😏' },
  { value: 'cute', label: 'Cute', emoji: '😊' },
  { value: 'cheesy', label: 'Cheesy', emoji: '🧀' },
  { value: 'poetic', label: 'Poetic', emoji: '📝' },
  { value: 'sarcastic', label: 'Sarcastic', emoji: '😎' },
  { value: 'sweet', label: 'Sweet', emoji: '🍯' },
  { value: 'bold', label: 'Bold', emoji: '🔥' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

export default function PickupLineForm({ formData, setFormData, loading, onGenerate }) {
  function update(field, value) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <form className="composer" onSubmit={event => { event.preventDefault(); onGenerate(); }}>
      <h2>Find your line</h2>
      <label>I am a…
        <select required value={formData.identity} onChange={e => update('identity', e.target.value)}>
          <option value="">Select an option</option>
          <option value="girl">Girl</option><option value="boy">Boy</option>
          <option value="lgbtq">LGBTQ+</option><option value="other">Rather not say</option>
        </select>
      </label>
      <label>Their interest
        <select required value={formData.interests[0] || ''} onChange={e => update('interests', [e.target.value])}>
          <option value="">Choose an interest</option>
          {interests.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <fieldset><legend>Tone</legend><div className="tones">
        {styles.map(item => <label key={item.value}>
          <input required type="radio" name="tone" value={item.value} checked={formData.style === item.value}
            onChange={() => update('style', item.value)} /><span>{item.label}</span>
        </label>)}
      </div></fieldset>
      <button className="generate" disabled={loading}>{loading ? 'Finding your line…' : 'Find my line'}<ArrowRight size={18} /></button>
    </form>
  );
}
