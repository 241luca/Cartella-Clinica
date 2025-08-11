import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    strictPort: true, // IMPORTANTE: forza l'uso della porta 5183
    host: 'localhost',
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
