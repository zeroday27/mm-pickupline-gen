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
    
    const selectedInterest = formData.interests[0];
    const linesForCategory = pickupLinesByCategory[selectedInterest];
    let generatedPickupLines = [];
    
    if (linesForCategory) {
      const line = linesForCategory[Math.floor(Math.random() * linesForCategory.length)];
      generatedPickupLines.push(line);
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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 py-8">
          Myanmar Pick-up Line Generator
        </h1>
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
