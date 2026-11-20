// src/components/PickupLineGenerator.jsx
import React, { useState } from 'react';
import PickupLineForm from './PickupLineForm';
import PickupLineResults from './PickupLineResults';
import { generatePickupLine } from '../lib/api';

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
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generatePickupLine(
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
    <div className="studio">
      <section className="intro">
        <h1>Burmese<br /><em>pickup lines.</em></h1>
        <p>Choose an interest and a tone to find a Burmese line for your crush.</p>
        <figure className="sample">
          <figcaption>From the collection</figcaption>
          <blockquote lang="my">မင်း WiFi လား? connection တစ်ခုခံစားနေရလို့</blockquote>
        </figure>
      </section>
      <section className="generator">
        {error && (
          <div role="alert" className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md">
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
      </section>
    </div>
  );
};

export default PickupLineGenerator;
