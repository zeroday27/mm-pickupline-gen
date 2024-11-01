const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPickupLines(category, style) {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (style) params.append('style', style);

    const response = await fetch(`${API_URL}/api/pickup-lines?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pickup lines');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}