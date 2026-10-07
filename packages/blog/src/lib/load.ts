import { getPosts } from './cms'
import type { Post } from './post-types'

/** Edge-cache pages briefly so a new post shows within a minute without hammering the CMS. */
export const CACHE_CONTROL = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'

export async function loadPosts(): Promise<{ posts: Post[]; failed: boolean }> {
  try {
    return { posts: await getPosts(), failed: false }
  } catch (err) {
    console.error('[blog] failed to load posts:', err)
    return { posts: [], failed: true }
  }
}
