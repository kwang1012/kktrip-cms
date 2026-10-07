/** Raw item as returned by `GET /api/collections/blog-posts/content`. */
export interface CmsItem {
  id: string
  title?: string
  slug?: string
  status?: string
  created_at?: number | string
  updated_at?: number | string
  data?: Record<string, unknown>
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  contentHtml: string
  author: string
  image: string | null
  tags: string[]
  publishedAt: Date
  updatedAt: Date
}
