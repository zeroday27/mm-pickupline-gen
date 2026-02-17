// src/config/config.js
const isLocalBrowser = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const envApiUrl = import.meta.env.VITE_API_URL;
const shouldIgnoreEnvLocalhost = !isLocalBrowser && envApiUrl?.includes('localhost');

export const config = {
  apiUrl: shouldIgnoreEnvLocalhost
    ? window.location.origin
    : (envApiUrl || (isLocalBrowser
      ? `${window.location.protocol}//${window.location.hostname}:3000`
      : window.location.origin)),
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('App Configuration:', {
    apiUrl: config.apiUrl,
    environment: import.meta.env.MODE
  });
}
