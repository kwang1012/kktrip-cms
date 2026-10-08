export interface Post {
  id: string
  locale?: string
  slug: string
  title: string
  excerpt: string
  contentHtml: string
  contentBlocks?: Array<{ _type: string; [key: string]: unknown }>
  credits?: import('./editorial').Credit[]
  tagTerms?: import('./editorial').TermLink[]
  categories?: import('./editorial').TermLink[]
  seo?: import('emdash').SeoMeta
  author: string
  image: string | null
  tags: string[]
  publishedAt: Date
  updatedAt: Date
}
