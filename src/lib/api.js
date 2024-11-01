const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchPickupLines(category, style) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (style) params.append('style', style);

  const response = await fetch(`${API_URL}/api/pickup-lines?${params}`);
  if (!response.ok) throw new Error('Failed to fetch pickup lines');
  return response.json();
}
