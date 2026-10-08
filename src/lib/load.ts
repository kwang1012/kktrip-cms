import { getPost, getPosts } from './cms'
import type { Post } from './post-types'

/** Edge-cache pages briefly so a new post shows within a minute without hammering the CMS. */
export const CACHE_CONTROL = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'

export async function loadPosts(locale?: import('./locales').Locale): Promise<{ posts: Post[]; failed: boolean }> {
  try {
    return { posts: await getPosts(locale), failed: false }
  } catch (err) {
    console.error('[blog] failed to load posts:', err)
    return { posts: [], failed: true }
  }
}

export async function loadPost(slug: string, locale?: import('./locales').Locale): Promise<{ post: Post | null; failed: boolean }> {
  try {
    return { post: await getPost(slug, locale), failed: false }
  } catch (err) {
    console.error('[blog] failed to load post:', err)
    return { post: null, failed: true }
  }
}
