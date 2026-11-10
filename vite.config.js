import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The design kit lives in public/assets; Vite's own files go to _app so the two never mix.
  build: { assetsDir: '_app' },
})
