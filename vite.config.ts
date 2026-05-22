import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
