import type { APIContext } from 'astro'
import { escapeXml } from '../lib/format'
import { CACHE_CONTROL, loadPosts } from '../lib/load'
import { getStrings } from '../lib/strings'
import { siteLocale, localePath } from '../lib/locales'

export async function GET({ site, currentLocale }: APIContext) {
  const locale = siteLocale(currentLocale)
  const t = getStrings(locale)
  const base = (site ?? new URL('https://news.kktrip.app')).origin
  const { posts, failed } = await loadPosts(locale)
  if (failed) return new Response(t.loadError, { status: 503 })

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}${localePath(`/posts/${encodeURIComponent(p.slug)}`, p.locale || locale)}</link>
      <guid isPermaLink="true">${base}${localePath(`/posts/${encodeURIComponent(p.slug)}`, p.locale || locale)}</guid>
      <pubDate>${p.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(t.siteName)}</title>
    <link>${base}</link>
    <description>${escapeXml(t.siteTagline)}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': CACHE_CONTROL },
  })
}
