import type { Post } from './post-types'

/** Posts sharing the most tags with `post`, newest first on ties; falls back to recent posts. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.slug !== post.slug)
  const score = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length
  const ranked = [...others].sort(
    (a, b) => score(b) - score(a) || b.publishedAt.getTime() - a.publishedAt.getTime(),
  )
  return ranked.slice(0, limit)
}
