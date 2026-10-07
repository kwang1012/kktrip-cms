import { describe, expect, it } from 'vitest'
import { formatDate, readingMinutes } from './format'
import { imageUrl, normalizePost, splitTags, toPosts } from './normalize'

const base = { id: '1', title: 'Hello', slug: 'hello', status: 'published', created_at: 1_700_000_000_000 }

describe('normalizePost', () => {
  it('drops drafts and archived posts', () => {
    expect(normalizePost({ ...base, status: 'draft' })).toBeNull()
    expect(normalizePost({ ...base, status: 'archived' })).toBeNull()
  })

  it('drops items without a slug or title', () => {
    expect(normalizePost({ ...base, slug: '' })).toBeNull()
    expect(normalizePost({ ...base, title: '' })).toBeNull()
  })

  it('maps fields and falls back to created_at for the date', () => {
    const post = normalizePost({ ...base, data: { excerpt: ' hi ', content: '<p>x</p>', author: 'KK', tags: 'a, b,,a' } })
    expect(post).toMatchObject({ excerpt: 'hi', contentHtml: '<p>x</p>', author: 'KK', tags: ['a', 'b'] })
    expect(post?.publishedAt.getTime()).toBe(1_700_000_000_000)
  })

  it('prefers publishedAt and accepts epoch seconds', () => {
    const post = normalizePost({ ...base, data: { publishedAt: 1_800_000_000 } })
    expect(post?.publishedAt.getTime()).toBe(1_800_000_000_000)
  })
})

describe('toPosts', () => {
  it('sorts newest first', () => {
    const posts = toPosts([
      { ...base, id: 'old', slug: 'old', data: { publishedAt: 1_000_000_000_000 } },
      { ...base, id: 'new', slug: 'new', data: { publishedAt: 1_900_000_000_000 } },
    ])
    expect(posts.map((p) => p.id)).toEqual(['new', 'old'])
  })
})

describe('helpers', () => {
  it('splitTags handles CJK separators', () => {
    expect(splitTags('東京，美食、京都')).toEqual(['東京', '美食', '京都'])
  })
  it('imageUrl accepts strings and objects', () => {
    expect(imageUrl('https://x/y.jpg')).toBe('https://x/y.jpg')
    expect(imageUrl({ url: 'https://x/z.jpg' })).toBe('https://x/z.jpg')
    expect(imageUrl(undefined)).toBeNull()
  })
  it('imageUrl resolves site-relative paths against the media base', () => {
    expect(imageUrl('/files/uploads/a.png', 'https://cms.example/')).toBe('https://cms.example/files/uploads/a.png')
    expect(imageUrl('https://x/y.jpg', 'https://cms.example')).toBe('https://x/y.jpg')
    expect(imageUrl('//cdn.x/y.jpg', 'https://cms.example')).toBe('//cdn.x/y.jpg')
    expect(imageUrl('/files/a.png')).toBe('/files/a.png')
  })
  it('readingMinutes is at least 1', () => {
    expect(readingMinutes('<p>short</p>')).toBe(1)
    expect(readingMinutes(`<p>${'旅'.repeat(800)}</p>`)).toBe(2)
  })
  it('formatDate renders a zh-TW date', () => {
    expect(formatDate(new Date(Date.UTC(2026, 9, 5, 12)))).toContain('2026')
  })
})
