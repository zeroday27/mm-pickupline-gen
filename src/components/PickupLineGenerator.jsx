// src/components/PickupLineGenerator.jsx
import React, { useState } from 'react';
import PickupLineForm from './PickupLineForm';
import PickupLineResults from './PickupLineResults';
import { fetchPickupLines } from '../lib/api';  // Updated import path

const PickupLineGenerator = () => {
  const [formData, setFormData] = useState({
    identity: '',
    interests: [],
    style: ''
  });

  const [generatedLines, setGeneratedLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePickupLines = async () => {
    if (!formData.interests.length || !formData.style || !formData.identity) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const lines = await fetchPickupLines(formData.interests[0], formData.style);
      
      if (!lines || lines.length === 0) {
        setError('ရွေးချယ်ထားသော category အတွက် pickup lines များ မရှိသေးပါ။');
        setGeneratedLines([]);
        return;
      }

      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      setGeneratedLines(randomLine ? [randomLine.text] : []);

    } catch (err) {
      console.error('Error generating pickup lines:', err);
      setError('Pickup lines ထုတ်ယူရာတွင် အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်။ ထပ်မံကြိုးစားကြည့်ပါ။');
      setGeneratedLines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied successfully');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900 transition-colors duration-200 p-4">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <PickupLineForm 
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onGenerate={generatePickupLines}
        />

        {(loading || generatedLines.length > 0) && (
          <PickupLineResults 
            lines={generatedLines}
            loading={loading}
            onRegenerate={generatePickupLines}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

export default PickupLineGenerator;
