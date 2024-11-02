// src/lib/api.js
import { config } from '../config/config';

export async function fetchPickupLines(category, style) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (style) params.append('style', style);

    const url = `${config.apiUrl}/api/pickup-lines?${params}`;
    
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
