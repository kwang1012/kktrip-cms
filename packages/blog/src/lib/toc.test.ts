import { describe, expect, it } from 'vitest'
import { addHeadingIds } from './toc'
import { relatedPosts } from './related'
import type { Post } from './post-types'

describe('addHeadingIds', () => {
  it('adds ids and builds the outline, keeping CJK text', () => {
    const { html, toc } = addHeadingIds('<h2>我們在意的三件事</h2><p>x</p><h3>1. 從中文開始</h3>')
    expect(toc).toEqual([
      { id: '我們在意的三件事', text: '我們在意的三件事', level: 2 },
      { id: '1-從中文開始', text: '1. 從中文開始', level: 3 },
    ])
    expect(html).toContain('<h2 id="我們在意的三件事">')
  })

  it('dedupes repeated headings and keeps existing ids', () => {
    const { toc } = addHeadingIds('<h2>Intro</h2><h2>Intro</h2><h2 id="keep">Other</h2>')
    expect(toc.map((t) => t.id)).toEqual(['intro', 'intro-2', 'keep'])
  })

  it('handles nested tags and ignores empty headings', () => {
    const { toc } = addHeadingIds('<h2><strong>Bold</strong> title</h2><h2> </h2>')
    expect(toc).toHaveLength(1)
    expect(toc[0].text).toBe('Bold title')
  })
})

const mk = (slug: string, tags: string[], day: number): Post => ({
  id: slug, slug, title: slug, excerpt: '', contentHtml: '', author: '', image: null, tags,
  publishedAt: new Date(2026, 0, day), updatedAt: new Date(2026, 0, day),
})

describe('relatedPosts', () => {
  it('ranks by shared tags then recency and excludes the post itself', () => {
    const a = mk('a', ['x', 'y'], 1)
    const all = [a, mk('b', ['z'], 5), mk('c', ['x', 'y'], 2), mk('d', ['x'], 9)]
    expect(relatedPosts(a, all, 3).map((p) => p.slug)).toEqual(['c', 'd', 'b'])
  })
  it('respects the limit', () => {
    const a = mk('a', [], 1)
    expect(relatedPosts(a, [a, mk('b', [], 2), mk('c', [], 3)], 1)).toHaveLength(1)
  })
})
