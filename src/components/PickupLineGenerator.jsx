// src/components/PickupLineGenerator.jsx
import React, { useState } from 'react';
import PickupLineForm from './PickupLineForm';
import PickupLineResults from './PickupLineResults';
import { pickupLinesByCategory } from '../data/pickupLines';

export default function PickupLineGenerator() {
  const [formData, setFormData] = useState({
    identity: '',
    interests: [],
    style: '',
    count: 5
  });

  const [generatedLines, setGeneratedLines] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePickupLines = () => {
    setLoading(true);
    
    const selectedInterests = formData.interests;
    let generatedPickupLines = [];
    
    selectedInterests.forEach(interest => {
      const linesForCategory = pickupLinesByCategory[interest];
      if (linesForCategory) {
        const randomIndex = Math.floor(Math.random() * linesForCategory.length);
        generatedPickupLines.push(linesForCategory[randomIndex]);
      }
    });

    if (generatedPickupLines.length === 0) {
      const allCategories = Object.keys(pickupLinesByCategory);
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      const randomLine = pickupLinesByCategory[randomCategory][Math.floor(Math.random() * pickupLinesByCategory[randomCategory].length)];
      generatedPickupLines.push(randomLine);
    }

    setTimeout(() => {
      setGeneratedLines(generatedPickupLines);
      setLoading(false);
    }, 1000);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <PickupLineForm 
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onGenerate={generatePickupLines}
        />
        <PickupLineResults 
          lines={generatedLines}
          loading={loading}
          onRegenerate={generatePickupLines}
          onCopy={handleCopy}
        />
      </div>
    </div>
  );
}
