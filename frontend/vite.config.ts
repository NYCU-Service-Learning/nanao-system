import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/api/.*' : {
        target: `http://${process.env.BACKEND_URL}:3000`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    port: 5173,
    cors: {
      origin: '*',
      credentials: true
    }
  }
})
