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

// Generate pickup line using AI (falls back to database if no AI)
export async function generatePickupLine(identity, interest, style, language = 'myanmar') {
  try {
    const url = buildApiUrl('/api/generate');

    if (import.meta.env.DEV) {
      console.log('Generating with:', url, { identity, interest, style, language });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identity, interest, style, language })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Generate API Error:', error);
    throw error;
  }
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
