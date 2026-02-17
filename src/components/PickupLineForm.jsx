// src/components/PickupLineForm.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Heart, RefreshCw, Search } from 'lucide-react';

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

const PickupLineForm = ({ formData, setFormData, loading, onGenerate }) => {
  const [interestSearch, setInterestSearch] = useState('');

  const filteredInterests = interests.filter(interest =>
    interest.label.toLowerCase().includes(interestSearch.toLowerCase()) ||
    interest.value.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const handleInterestClick = (value) => {
    setFormData({...formData, interests: [value]});
  };

  return (
    <Card className="mb-8 dark:bg-gray-900 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Pick-up Line Generator
        </CardTitle>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
          Generate creative pickup lines for your crush in Burmese
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Identity Selection */}
          <div>
            <Label className="text-gray-700 dark:text-gray-200">I am a...</Label>
            <select
              className="w-full p-3 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 text-gray-900 dark:text-gray-100"
              value={formData.identity}
              onChange={(e) => setFormData({...formData, identity: e.target.value})}
            >
              <option value="">Select...</option>
              <option value="girl">Girl</option>
              <option value="boy">Boy</option>
              <option value="lgbtq">LGBTQ+</option>
              <option value="other">Rather not say</option>
            </select>
          </div>

          {/* Interest Selection with Search */}
          <div>
            <Label className="text-gray-700 dark:text-gray-200">My crush is interested in...</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search interests..."
                value={interestSearch}
                onChange={(e) => setInterestSearch(e.target.value)}
                className="w-full pl-10 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 max-h-64 overflow-y-auto p-1">
              {filteredInterests.map((interest) => {
                const isSelected = formData.interests[0] === interest.value;
                return (
                  <Button
                    key={interest.value}
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    className={`
                      w-full p-2 justify-start text-left text-sm
                      ${isSelected
                        ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900 dark:border-purple-400 dark:text-purple-100"
                        : "bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900 text-gray-900 dark:text-gray-100"}
                      transition-all duration-200
                      border rounded-lg
                    `}
                    onClick={() => handleInterestClick(interest.value)}
                  >
                    <span className="mr-2">{interest.emoji}</span>
                    <span className="truncate">{interest.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <Label className="text-gray-700 dark:text-gray-200">Pick-up line style</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {styles.map((styleOption) => {
                const isSelected = formData.style === styleOption.value;
                return (
                  <Button
                    key={styleOption.value}
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    className={`
                      w-full p-2 justify-start text-left text-sm
                      ${isSelected
                        ? "bg-pink-100 border-pink-500 text-pink-700 dark:bg-pink-900 dark:border-pink-400 dark:text-pink-100"
                        : "bg-white dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900 text-gray-900 dark:text-gray-100"}
                      transition-all duration-200
                      border rounded-lg
                    `}
                    onClick={() => setFormData({...formData, style: styleOption.value})}
                  >
                    <span className="mr-2">{styleOption.emoji}</span>
                    <span className="truncate">{styleOption.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="button"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            onClick={onGenerate}
            disabled={loading || !formData.identity || !formData.interests.length || !formData.style}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Heart className="mr-2 h-5 w-5" />
            )}
            Generate Pick-up Lines
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default PickupLineForm;
