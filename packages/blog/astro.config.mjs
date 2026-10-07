// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import emdash from 'emdash/astro'
import { d1, r2 } from '@emdash-cms/cloudflare'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  site: 'https://news.kktrip.app',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [react(), emdash({
    database: d1({ binding: 'DB' }),
    storage: r2({ binding: 'MEDIA' }),
  })],
  vite: { plugins: [tailwindcss()] },
})
