import type { CmsItem, Post } from './post-types'

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** CMS timestamps are epoch millis (or seconds / ISO strings); fall back to `fallback`. */
export function toDate(value: unknown, fallback: Date): Date {
  if (value === null || value === undefined || value === '') return fallback
  const n = typeof value === 'number' ? value : Number(value)
  const date = Number.isFinite(n) ? new Date(n < 1e11 ? n * 1000 : n) : new Date(String(value))
  return Number.isNaN(date.getTime()) ? fallback : date
}

/**
 * Media fields arrive as a URL string, or an object carrying one. The CMS media picker can store a
 * site-relative path like `/files/uploads/x.png`; resolve those against `mediaBase` (the CMS origin).
 */
export function imageUrl(value: unknown, mediaBase?: string): string | null {
  let url: string | null = null
  if (typeof value === 'string') url = value.trim() || null
  else if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    url = str(v.url) || str(v.publicUrl) || null
  }
  if (url && mediaBase && url.startsWith('/') && !url.startsWith('//')) {
    return mediaBase.replace(/\/+$/, '') + url
  }
  return url
}

export function splitTags(value: unknown): string[] {
  const raw = Array.isArray(value) ? value.map(String) : str(value).split(/[,，、]/)
  return [...new Set(raw.map((t) => t.trim()).filter(Boolean))]
}

/** Map a CMS item to a Post, or null when it is not a published, routable post. */
export function normalizePost(item: CmsItem, mediaBase?: string): Post | null {
  if (item.status !== 'published') return null
  const data = item.data ?? {}
  const slug = str(item.slug) || str(data.slug)
  const title = str(item.title) || str(data.title)
  if (!slug || !title) return null

  const created = toDate(item.created_at, new Date(0))
  return {
    id: item.id,
    slug,
    title,
    excerpt: str(data.excerpt),
    contentHtml: typeof data.content === 'string' ? data.content : '',
    author: str(data.author),
    image: imageUrl(data.featuredImage, mediaBase),
    tags: splitTags(data.tags),
    publishedAt: toDate(data.publishedAt, created),
    updatedAt: toDate(item.updated_at, created),
  }
}

/** Published posts only, newest first. */
export function toPosts(items: CmsItem[], mediaBase?: string): Post[] {
  return items
    .map((item) => normalizePost(item, mediaBase))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
