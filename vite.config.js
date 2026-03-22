import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192x192.png', 'icon-512x512.png'], // Pre-cache icons
      manifest: {
        name: 'RenTech',
        short_name: 'RenTech',
        description: 'Smart Rental Management for Gowns & Suits',
        theme_color: '#991b1b', // Changed to match your primary red
        background_color: '#991b1b', // Native OS splash screen background
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192x192.png', // Use local assets
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png', // Use local assets
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})