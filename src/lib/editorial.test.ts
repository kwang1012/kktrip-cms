import { describe, expect, it } from 'vitest'
import { normalizeEmDashPost } from './emdash-post'
import { matchesTag, tagHref, terms } from './editorial'

describe('native editorial metadata', () => {
  it('uses managed labels, stable slugs, and contributor credits', () => {
    const post = normalizeEmDashPost({ id: 'guide', data: { title: 'Guide', tags: 'old', author_display: 'old',
      terms: { tag: [{ slug: 'japan', label: '日本' }], category: [{ slug: 'guides', label: '目的地指南' }] },
      bylines: [{ roleLabel: '作者', byline: { slug: 'kk', displayName: 'KK Trip', avatarMediaId: 'avatar-id' } }],
    } })!
    expect(post.tags).toEqual(['日本'])
    expect(post.author).toBe('KK Trip')
    expect(post.credits?.[0].avatar).toBe('/_emdash/api/media/file/avatar-id')
    expect(post.categories?.[0].label).toBe('目的地指南')
    expect(matchesTag(post, 'japan')).toBe(true)
    expect(matchesTag(post, '日本')).toBe(true)
    expect(tagHref('日本', post.tagTerms)).toBe('/tag/japan')
  })
  it('retains old tag URLs and handles cleared or malformed metadata', () => {
    expect(tagHref('新聞')).toBe('/tag/%E6%96%B0%E8%81%9E')
    expect(terms([null, { slug: 5 }, { label: 'missing' }])).toEqual([])
    expect(normalizeEmDashPost({ id: 'post', data: { title: 'Post', tags: 'retired import tag', author_display: 'retired author', terms: {}, bylines: [] } })?.tags).toEqual([])
  })
})
