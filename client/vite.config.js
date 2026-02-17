import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/ws': {
        target: 'https://retroboard-0gyt.onrender.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
