import { describe, expect, it } from 'vitest'
import { contentHtml, mediaUrl, normalizeEmDashPost } from './emdash-post'

const block = (text: string) => ({ _type: 'block', _key: 'p', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's', text, marks: [] }] })

describe('EmDash article mapping', () => {
  it('preserves migrated dates, route slug and metadata', () => {
    const post = normalizeEmDashPost({ id: 'why-kk-trip', data: {
      id: 'new-id', title: 'Why KK Trip', status: 'published', content: [block('Hello')],
      original_published_at: '2026-03-01T00:00:00Z', publishedAt: '2026-10-06T00:00:00Z',
      terms: { tag: [{ slug: 'travel', label: 'travel' }, { slug: 'updates', label: 'updates' }] },
    } })
    expect(post?.slug).toBe('why-kk-trip')
    expect(post?.publishedAt.toISOString()).toBe('2026-03-01T00:00:00.000Z')
    expect(post?.tags).toEqual(['travel', 'updates'])
    expect(post?.contentHtml).toContain('<p>Hello</p>')
  })
  it('does not expose drafts', () => {
    expect(normalizeEmDashPost({ id: 'draft', data: { title: 'Private', status: 'draft' } })).toBeNull()
  })
  it('resolves uploaded media without the old CMS', () => {
    expect(mediaUrl({ meta: { storageKey: 'uploads/a b.png' } })).toBe('/_emdash/api/media/file/uploads/a%20b.png')
  })
  it('uses bundled imported covers without requiring a local R2 copy', () => {
    expect(mediaUrl({ meta: { storageKey: '01M4A59NM98NS683KV67E67JY7.png' } })).toBe('/migrated-media/cab07be1-0722-47cb-9c86-c668b2c47f1e.png')
  })
  it('escapes HTML and unsafe links', () => {
    expect(contentHtml([block('<script>alert(1)</script>')])).toContain('&lt;script&gt;')
    const linked = { ...block('click'), markDefs: [{ _key: 'a', _type: 'link', href: 'javascript:alert(1)' }], children: [{ _type: 'span', text: 'click', marks: ['a'] }] }
    expect(contentHtml([linked])).not.toContain('javascript:')
    expect(contentHtml([{ _type: 'code', code: '<script>' }])).toBe('<pre><code>&lt;script&gt;</code></pre>')
  })
  it('retains rich blocks for the native renderer without breaking list pages', () => {
    const table = { _type: 'table', _key: 'x', rows: [] }
    const post = normalizeEmDashPost({ id: 'table-post', data: { title: 'Table', content: [table] } })
    expect(post?.contentBlocks).toEqual([table])
  })
})
