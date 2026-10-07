export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

function plain(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/** URL-safe id that keeps CJK letters. */
function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

/**
 * Give every h2/h3 an id (unless it has one) and return the outline.
 * Operates on the CMS's trusted HTML with a simple pattern; headings with nested tags still work.
 */
export function addHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, lvl: string, attrs: string, inner: string) => {
    const text = plain(inner)
    if (!text) return _m
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs)
    let id = existing ? existing[1] : slugify(text)
    if (!existing) {
      const base = id
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    }
    used.add(id)
    toc.push({ id, text, level: Number(lvl) as 2 | 3 })
    const cleanAttrs = existing ? attrs : `${attrs} id="${id}"`
    return `<h${lvl}${cleanAttrs}>${inner}</h${lvl}>`
  })

  return { html: out, toc }
}
