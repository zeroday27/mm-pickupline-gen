// src/components/PickupLineGenerator.jsx
import React, { useState } from 'react';
import PickupLineForm from './PickupLineForm';
import PickupLineResults from './PickupLineResults';
import { usePickupLineGenerator } from '../lib/pickupLineUtils';

const PickupLineGenerator = () => {
  const [formData, setFormData] = useState({
    identity: '',
    interests: [],
    style: ''
  });

  const [generatedLines, setGeneratedLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickupLineGenerator = usePickupLineGenerator();

  const generatePickupLines = async () => {
    if (!formData.interests.length || !formData.style || !formData.identity) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the new generateWithAI which passes identity
      const result = await pickupLineGenerator.generateWithAI(
        formData.identity,
        formData.interests[0],
        formData.style
      );

      if (result && result.text) {
        setGeneratedLines([{
          text: result.text,
          isAI: result.isAI,
          source: result.source,
          insight: result.insight
        }]);
      } else {
        throw new Error('Invalid pickup line generated');
      }

    } catch (err) {
      console.error('Error generating pickup lines:', err);
      setError(
        'Pickup lines ထုတ်ယူရာတွင် အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်။ ထပ်မံကြိုးစားကြည့်ပါ။'
      );
      setGeneratedLines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (newFormData) => {
    if (
      newFormData.interests[0] !== formData.interests[0] ||
      newFormData.style !== formData.style ||
      newFormData.identity !== formData.identity
    ) {
      pickupLineGenerator.clearCache();
    }
    setFormData(newFormData);
    setError(null);
  };

  const handleCopy = async (text) => {
    if (!text) return;

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
          setFormData={handleFormDataChange}
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
