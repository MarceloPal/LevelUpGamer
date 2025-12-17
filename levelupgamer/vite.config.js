import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- CONFIGURACIÓN DE VITEST ---
  test: {
    globals: true,           // Permite usar describe, it, expect sin importar
    environment: 'jsdom',    // Simula el navegador (vital para React)
    setupFiles: './src/setupTests.js', // Archivo de configuración inicial
    css: true,               // Procesa archivos CSS modules
  },
})