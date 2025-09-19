import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules (vendor libraries) into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Optional: split a specific heavy module
          if (id.includes('src/heavyModule.js')) {
            return 'heavyModule';
          }
        }
      }
    }
  }
})
