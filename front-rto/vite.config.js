import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/front-rto/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Consultech - Gestão de Cozinhas',
        lang: 'pt-BR',
        short_name: 'Consultech',
        description: 'Aplicativo de Auditorias RTO',
        theme_color: '#660c39',
        background_color: '#660c39',
        display: 'standalone',
        start_url: '/front-rto/',
        scope: '/front-rto/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: []
      }
    })
  ]
})
