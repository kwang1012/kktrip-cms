import { toPosts } from './normalize'
import type { CmsItem, Post } from './post-types'

const CMS_URL = (import.meta.env.PUBLIC_CMS_URL || 'https://cms.kktrip.app').replace(/\/+$/, '')

/** Fetch every published post. Throws on a failed request so pages can show an error state. */
export async function getPosts(): Promise<Post[]> {
  // The CMS defaults to 50 items; ask for the maximum so older posts never drop off.
  const res = await fetch(`${CMS_URL}/api/collections/blog-posts/content?limit=1000`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`CMS responded ${res.status}`)
  const json = (await res.json()) as { data?: CmsItem[] }
  return toPosts(json.data ?? [], CMS_URL)
}

/** Tags sorted by how many posts use them. */
export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count)
}
