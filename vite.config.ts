/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    // Proxy para desarrollo: las peticiones a /api se redirigen al backend
    // real, evitando problemas de CORS desde el navegador.
    proxy: {
      '/api': {
        target: 'https://jtaskboard.onrender.com',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
