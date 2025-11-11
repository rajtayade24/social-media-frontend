import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),        // React plugin
    tailwindcss(),  // Tailwind plugin
  ],
  define: {
    global: 'window'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        // ws: true // not needed for SSE
      }
    }
  }
  // base: '/instagram-clone/' // repo name
});