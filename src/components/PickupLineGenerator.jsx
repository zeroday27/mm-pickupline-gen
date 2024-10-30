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