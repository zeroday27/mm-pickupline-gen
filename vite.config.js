import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      watch: {
        usePolling: true
      }
    },
    define: {
      'import.meta.env.VITE_ENV': JSON.stringify(mode),
    }
  };
});