import { toHTML } from '@portabletext/to-html'
import { imageUrl, splitTags, toDate } from './normalize'
import { terms, credits } from './editorial'
import type { Post } from './post-types'

const string = (value: unknown): string => typeof value === 'string' ? value : ''
const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function mediaUrl(value: unknown): string | null {
  if (value && typeof value === 'object') {
    const media = value as Record<string, unknown>
    const direct = imageUrl(media.src) || imageUrl(media.url)
    if (direct) return direct
    const meta = media.meta as Record<string, unknown> | undefined
    const key = string(meta?.storageKey)
    if (key) return '/_emdash/api/media/file/' + key.split('/').map(encodeURIComponent).join('/')
  }
  return imageUrl(value)
}

function safeUrl(value: unknown): string {
  const url = string(value).trim()
  return /^(https?:\/\/|\/(?!\/)|#)/i.test(url) ? url : ''
}

/** Serialize a text summary for reading time and headings; the page uses EmDash's full renderer. */
export function contentHtml(value: unknown): string {
  if (!Array.isArray(value)) return ''
  return toHTML(value as Parameters<typeof toHTML>[0], {
    components: {
      types: {
        image: ({ value: block }) => {
          const src = safeUrl(mediaUrl(block) || block.asset?.url)
          return src ? `<figure><img src="${escape(src)}" alt="${escape(string(block.alt))}" loading="lazy" />${block.caption ? `<figcaption>${escape(string(block.caption))}</figcaption>` : ''}</figure>` : ''
        },
        code: ({ value: block }) => `<pre><code>${escape(string(block.code))}</code></pre>`,
        horizontalRule: () => '<hr />',
      },
      marks: {
        link: ({ value: mark, children }) => {
          const href = safeUrl(mark?.href)
          return href ? `<a href="${escape(href)}">${children}</a>` : children
        },
      },
    },
    onMissingComponent: false,
  })
}

export function normalizeEmDashPost(entry: { id: string; data: object }, allowPreview = false): Post | null {
  const data = entry.data as Record<string, unknown>
  if (!allowPreview && data.status && data.status !== 'published') return null
  const title = string(data.title).trim()
  if (!entry.id || !title) return null
  const taxonomy = data.terms as Record<string, unknown> | undefined
  const tagTerms = terms(taxonomy?.tag)
  const bylines = credits(data.bylines)
  const created = toDate(data.createdAt, new Date(0))
  return {
    id: string(data.id) || entry.id, slug: entry.id, title,
    excerpt: string(data.excerpt), contentHtml: contentHtml(data.content),
    contentBlocks: Array.isArray(data.content) ? data.content.filter((block): block is { _type: string; [key: string]: unknown } => !!block && typeof block === 'object' && typeof block._type === 'string') : [],
    credits: bylines, tagTerms, categories: terms(taxonomy?.category),
    author: bylines.map(credit => credit.name).join('、') || string(data.author_display) || string(data.author),
    image: mediaUrl(data.featured_image), tags: tagTerms.length ? tagTerms.map(term => term.label) : splitTags(data.tags),
    publishedAt: toDate(data.original_published_at || data.publishedAt, created),
    updatedAt: toDate(data.original_updated_at || data.updatedAt, created),
  }
}
