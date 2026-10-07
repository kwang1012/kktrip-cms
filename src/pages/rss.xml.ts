import type { APIContext } from 'astro'
import { escapeXml } from '../lib/format'
import { CACHE_CONTROL, loadPosts } from '../lib/load'
import { t } from '../lib/strings'

export async function GET({ site }: APIContext) {
  const base = (site ?? new URL('https://news.kktrip.app')).origin
  const { posts, failed } = await loadPosts()
  if (failed) return new Response(t.loadError, { status: 503 })

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}/posts/${encodeURIComponent(p.slug)}</link>
      <guid isPermaLink="true">${base}/posts/${encodeURIComponent(p.slug)}</guid>
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
    <language>zh-TW</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': CACHE_CONTROL },
  })
}
