// src/config/config.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`,
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('App Configuration:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE
  });
}
