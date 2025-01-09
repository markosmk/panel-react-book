import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) return 'xlsx-vendors';
            if (id.includes('react-router-dom') || id.includes('react-router'))
              return 'router-vendors';
            if (id.includes('@tanstack')) return 'tanstack-vendors';
            if (id.includes('zod') || id.includes('react-hook-form'))
              return 'forms-vendors';
            if (id.includes('@radix-ui')) return 'ui-vendors';
            if (id.includes('date-fns') || id.includes('date-fns-tz'))
              return 'date-vendors';
            if (id.includes('react') || id.includes('react-dom'))
              return 'vendor';
          }
        }
      }
    }
  }
});
