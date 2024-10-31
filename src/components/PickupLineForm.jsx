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

export default function PickupLineForm({ formData, setFormData, loading, onGenerate }) {
  const handleInterestClick = (value) => {
    setFormData({...formData, interests: [value]});
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Pick-up Line Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label>သင့်ရဲ့ Identity ကို ရွေးပါ</Label>
            <select 
              className="w-full p-2 border rounded-md mt-1"
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
  <Label>သင့် Crush ရဲ့ စိတ်ဝင်စားမှုများ</Label>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
    {interests.map((interest) => (
      <Button
        key={interest.value}
        variant={formData.interests[0] === interest.value ? "secondary" : "outline"}
        className={`justify-start w-full p-3 text-sm sm:text-base transition-all ${
          formData.interests[0] === interest.value 
            ? "bg-purple-100 border-purple-500 text-purple-700 hover:bg-purple-200" 
            : "hover:bg-purple-50"
        }`}
        onClick={() => handleInterestClick(interest.value)}
      >
        <span className="mr-3 text-lg">{interest.emoji}</span>
        <span className="text-left flex-1">{interest.label}</span>
      </Button>
    ))}
  </div>
</div>
          <div>
            <Label>Pick-up line style</Label>
            <select 
              className="w-full p-2 border rounded-md mt-1"
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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