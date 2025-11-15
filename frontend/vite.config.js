import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use safer build options to avoid eval
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps to avoid eval
    rollupOptions: {
      output: {
        // Use safer chunking strategy
        manualChunks: undefined,
      }
    }
  },
  server: {
    // For development, we can configure HMR to be safer
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})
