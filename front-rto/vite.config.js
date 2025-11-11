import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/rto-auditorias/',
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'chart.js',
      'react-chartjs-2',
      'chartjs-plugin-datalabels',
    ],
  },
  server: {
    host: '0.0.0.0', // Escuta em todas as interfaces para acesso externo
    port: 5173,
    allowedHosts: ['renatoft89.ddns.net'],
    origin: 'http://renatoft89.ddns.net:5173',
    hmr: {
      host: 'renatoft89.ddns.net',
      port: 5173,
      protocol: 'ws',
    },
  },
})
