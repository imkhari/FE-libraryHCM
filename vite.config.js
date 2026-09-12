import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'pdfjs-vendor';
          }
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/axios')
          ) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/react-icons')) {
            return 'ui-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})