// src/lib/api.js
import { config } from '../config/config';

const resolveApiBase = () => {
  const raw = (config.apiUrl || '').trim();
  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  return withoutTrailingSlash.replace(/\/api$/, '');
};

const buildApiUrl = (path) => `${resolveApiBase()}${path}`;

export async function fetchPickupLines(category, style) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (style) params.append('style', style);

    const url = `${buildApiUrl('/api/pickup-lines')}?${params}`;

    if (import.meta.env.DEV) {
      console.log('Fetching from:', url);
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getCatalogueOptions(signal) {
  const response = await fetch(buildApiUrl('/api/pickup-lines/options'), { signal });
  if (!response.ok) throw new Error('Could not load available vibes');
  return response.json();
}

export async function generatePickupLine(interest, style, seenIds) {
  const response = await fetch(buildApiUrl('/api/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interest, style, language: 'my', seenIds })
  });
  if (!response.ok) throw new Error('Could not get a line');
  return response.json();
}

// Check AI status
export async function checkAIStatus() {
  try {
    const url = buildApiUrl('/api/ai-status');
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('AI Status Error:', error);
    return { aiEnabled: false, message: 'Could not check AI status' };
  }
}
