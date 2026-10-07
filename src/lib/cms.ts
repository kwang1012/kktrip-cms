import { getEmDashCollection, getEmDashEntry, getSeoMeta } from 'emdash'
import { normalizeEmDashPost } from './emdash-post'
import type { Post } from './post-types'

/** Query published revisions from the local CMS, including all cursor pages. */
export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = []
  let cursor: string | undefined
  do {
    const result = await getEmDashCollection('posts', {
      status: 'published', orderBy: { published_at: 'desc' }, limit: 100, cursor,
    })
    if (result.error) throw result.error
    for (const entry of result.entries) {
      const post = normalizeEmDashPost(entry)
      if (post) posts.push(post)
    }
    cursor = result.nextCursor
  } while (cursor)
  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

/** EmDash validates preview access before returning an unpublished entry. */
export async function getPost(slug: string): Promise<Post | null> {
  const result = await getEmDashEntry('posts', slug)
  if (result.error) throw result.error
  const post = result.entry ? normalizeEmDashPost(result.entry, true) : null
  if (post && result.entry) post.seo = getSeoMeta(result.entry, { siteTitle: 'KK Trip 旅誌', siteUrl: 'https://news.kktrip.app', path: `/posts/${encodeURIComponent(slug)}` })
  return post
}

export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count)
}
