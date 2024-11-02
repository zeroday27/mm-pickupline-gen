// src/components/PickupLineForm.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Heart, RefreshCw } from 'lucide-react';

const interests = [
  { value: 'movies', label: 'ရုပ်ရှင် (Movies)', emoji: '🎬' },
  { value: 'music', label: 'ဂီတ (Music)', emoji: '🎵' },
  { value: 'books', label: 'စာပေ (Literature)', emoji: '📚' },
  { value: 'tech', label: 'နည်းပညာ (Technology)', emoji: '💻' },
  { value: 'football', label: 'ဘောလုံး (Football)', emoji: '⚽' },
  { value: 'gaming', label: 'ဂိမ်း (Gaming)', emoji: '🎮' }
];

const PickupLineForm = ({ formData, setFormData, loading, onGenerate }) => {
  const handleInterestClick = (value) => {
    setFormData({...formData, interests: [value]});
  };

  return (
    <Card className="mb-8 dark:bg-gray-900 border-0">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-purple-600 dark:text-purple-400">
          Pick-up Line Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label className="text-gray-700 dark:text-gray-200">သင့်ရဲ့ Identity ကို ရွေးပါ</Label>
            <select 
              className="w-full p-3 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 text-gray-900 dark:text-gray-100"
              value={formData.identity}
              onChange={(e) => setFormData({...formData, identity: e.target.value})}
            >
              <option value="">ရွေးချယ်ပါ</option>
              <option value="girl">Girl</option>
              <option value="boy">Boy</option>
              <option value="lgbtq">LGBTQ+</option>
              <option value="other">Rather not say</option>
            </select>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-200">သင့် Crush ရဲ့ စိတ်ဝင်စားမှုများ</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {interests.map((interest) => {
                const isSelected = formData.interests[0] === interest.value;
                return (
                  <Button
                    key={interest.value}
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    className={`
                      w-full p-3 justify-start text-left
                      ${isSelected 
                        ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900 dark:border-purple-400 dark:text-purple-100" 
                        : "bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900 text-gray-900 dark:text-gray-100"}
                      transition-colors duration-200
                      border rounded-md
                    `}
                    onClick={() => handleInterestClick(interest.value)}
                  >
                    <span className="mr-3 text-xl">{interest.emoji}</span>
                    <span>{interest.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-gray-700 dark:text-gray-200">Pick-up line style</Label>
            <select 
              className="w-full p-3 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 text-gray-900 dark:text-gray-100"
              value={formData.style}
              onChange={(e) => setFormData({...formData, style: e.target.value})}
            >
              <option value="">ရွေးချယ်ပါ</option>
              <option value="funny">ပျော်ရွှင်ဖွယ်</option>
              <option value="romantic">ရိုမန်တစ်</option>
              <option value="other">အခြား</option>
            </select>
          </div>

          <Button
            type="button"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
            onClick={onGenerate}
            disabled={loading || !formData.identity || !formData.interests.length || !formData.style}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Heart className="mr-2 h-4 w-4" />
            )}
            Pick-up Lines များကို ဖန်တီးမည်
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default PickupLineForm;