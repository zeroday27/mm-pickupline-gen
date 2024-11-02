const environments = {
    development: {
      apiUrl: 'http://localhost:3000',
    },
    uat: {
      apiUrl: 'https://pickupmmapi.noclouds.space',
    },
    production: {
      apiUrl: 'https://pickupmmapi.noclouds.space', // Update this when production URL is different
    },
  };
  
  export const getApiUrl = () => {
    // Get environment from VITE_ENV or default to 'development'
    const env = import.meta.env.VITE_ENV || 'development';
    return environments[env]?.apiUrl || environments.development.apiUrl;
  };