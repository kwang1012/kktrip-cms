export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Rough reading time in minutes: ~400 CJK chars or ~220 words per minute. */
export function readingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ')
  const cjk = (text.match(/[㐀-鿿぀-ヿ가-힯]/g) ?? []).length
  const words = text.replace(/[㐀-鿿぀-ヿ가-힯]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(cjk / 400 + words / 220))
}

export function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
