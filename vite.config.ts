import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],

  
  build: {
    manifest: true, 
    outDir: 'public/build', 
    rollupOptions: {
      input: 'resources/js/main.tsx',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    }
  },
    server: {
    watch: {
      usePolling: true,  
    },
    hmr: true,
  },
})
