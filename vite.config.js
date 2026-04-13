import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return Date.now().toString(36)
  }
})()

// Appends ?ver=<git-short-hash> to every local href/src in the built HTML.
// Uses closeBundle (runs after ALL plugins including VitePWA inject their
// scripts) so registerSW.js and manifest.webmanifest are also versioned.
function versionInjectPlugin() {
  return {
    name: 'version-inject',
    apply: 'build',
    closeBundle() {
      const htmlPath = path.resolve('dist/index.html')
      if (!fs.existsSync(htmlPath)) return
      let html = fs.readFileSync(htmlPath, 'utf-8')
      // Match href="./..." and src="./..." — skip anything already versioned
      html = html.replace(/(href|src)="(\.[^"?#]+)"/g, `$1="$2?ver=${gitHash}"`)
      fs.writeFileSync(htmlPath, html)
      console.log(`[version-inject] Applied ?ver=${gitHash} to all local assets`)
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    versionInjectPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AI Slop Royale',
        short_name: 'SlopRoyale',
        description: 'The Ultimate AI Cringe Detector Game',
        theme_color: '#7c3aed',
        background_color: '#0f0f1a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
