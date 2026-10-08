// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import emdash from 'emdash/astro'
import { d1, r2 } from '@emdash-cms/cloudflare'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  i18n: { defaultLocale: 'zh-TW', locales: ['zh-TW', 'en', 'ja', 'ko'], fallback: { en: 'zh-TW', ja: 'zh-TW', ko: 'zh-TW' } },
  site: 'https://news.kktrip.app',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [{
    name: 'kktrip-localized-routes',
    hooks: { 'astro:config:setup': ({ injectRoute }) => {
      for (const locale of ['en', 'ja', 'ko']) {
        for (const [route, entrypoint] of Object.entries({
          '': './src/pages/index.astro',
          'posts/[slug]': './src/pages/posts/[slug].astro',
          'pages/[slug]': './src/pages/pages/[slug].astro',
          'category/[slug]': './src/pages/category/[slug].astro',
          'tag/[tag]': './src/pages/tag/[tag].astro',
          'search': './src/pages/search.astro',
          'rss.xml': './src/pages/rss.xml.ts',
          '404': './src/pages/404.astro',
        })) injectRoute({ pattern: `/${locale}/${route}`, entrypoint })
      }
    } },
  }, react(), emdash({
    database: d1({ binding: 'DB' }),
    storage: r2({ binding: 'MEDIA' }),
  })],
  vite: { plugins: [tailwindcss()] },
})
