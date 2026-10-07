import type { Post } from './post-types'

export interface TermLink { slug: string; label: string }
export interface Credit { name: string; slug: string; avatar: string | null; role: string }
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}

export function terms(value: unknown): TermLink[] {
  return Array.isArray(value) ? value.flatMap(item => {
    const term = record(item)
    return typeof term.slug === 'string' && typeof term.label === 'string' ? [{ slug: term.slug, label: term.label }] : []
  }) : []
}
export function credits(value: unknown): Credit[] {
  return Array.isArray(value) ? value.flatMap(item => {
    const credit = record(item), byline = record(credit.byline)
    if (typeof byline.displayName !== 'string') return []
    return [{ name: byline.displayName, slug: String(byline.slug || ''),
      avatar: typeof byline.avatarStorageKey === 'string' && byline.avatarStorageKey ? `/_emdash/api/media/file/${byline.avatarStorageKey.split('/').map(encodeURIComponent).join('/')}` : null,
      role: typeof credit.roleLabel === 'string' ? credit.roleLabel : '' }]
  }) : []
}
export function tagHref(label: string, postTerms: TermLink[] = []): string {
  return `/tag/${encodeURIComponent(postTerms.find(term => term.label === label)?.slug || label)}`
}
export function matchesTag(post: Post, slug: string): boolean {
  return post.tagTerms?.some(term => term.slug === slug || term.label === slug) || post.tags.includes(slug)
}
