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
      manifest: {
        name: 'RentBook',
        short_name: 'RentBook',
        description: 'Smart Rental Management for Gowns & Suits',
        theme_color: '#bf4a53',
        background_color: '#faf6f6',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png', // You can replace this URL with your actual app icon later
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png', // You can replace this URL with your actual app icon later
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})