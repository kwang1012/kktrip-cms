import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { htmlToPortableText } from '@emdash-cms/gutenberg-to-portable-text'
import { toPosts } from '../src/lib/normalize'
import type { CmsItem } from '../src/lib/post-types'
import { contentHtml } from '../src/lib/emdash-post'

const source = process.env.FLARE_CMS_URL || 'https://cms.kktrip.app'
const file = process.argv[2]
const raw = file ? await readFile(file, 'utf8') : await (async () => {
  const response = await fetch(`${source}/api/collections/blog-posts/content?limit=1000`)
  if (!response.ok) throw new Error(`FlareCMS export failed: ${response.status}`)
  return response.text()
})()
const payload = JSON.parse(raw) as { data?: CmsItem[] }
if (!Array.isArray(payload.data)) throw new Error('Expected a FlareCMS export with a data array')
if (payload.data.length >= 1000) throw new Error('Export reached the page limit; paginate before importing')
const posts = toPosts(payload.data, source)
const fields = [
  { slug: 'title', label: 'Title', type: 'string', required: true, searchable: true },
  { slug: 'content', label: 'Content', type: 'portableText', searchable: true },
  { slug: 'excerpt', label: 'Excerpt', type: 'text' },
  { slug: 'featured_image', label: 'Featured image', type: 'image' },
  { slug: 'author_display', label: 'Author', type: 'string' },
  { slug: 'tags', label: 'Tags (comma separated)', type: 'string' },
  { slug: 'original_published_at', label: 'Publication date', type: 'datetime' },
  { slug: 'original_updated_at', label: 'Original update date', type: 'datetime' },
]
async function embeddedMedia(url: string): Promise<string> {
  if (!url.startsWith('data:')) return new URL(url, source).toString()
  const match = /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(url)
  if (!match) throw new Error('Unsupported embedded image format')
  const bytes = Buffer.from(match[1], 'base64')
  const extension = bytes[0] === 0xff && bytes[1] === 0xd8 ? 'jpg' : bytes.subarray(1, 4).toString() === 'PNG' ? 'png' : bytes.subarray(0, 3).toString() === 'GIF' ? 'gif' : 'webp'
  const filename = createHash('sha256').update(bytes).digest('hex').slice(0, 24) + '.' + extension
  await mkdir('public/migrated-media', { recursive: true })
  await writeFile('public/migrated-media/' + filename, bytes)
  return '/migrated-media/' + filename
}

const content = await Promise.all(posts.map(async post => {
  const blocks = htmlToPortableText(post.contentHtml)
  const supported = new Set(['block', 'image', 'code', 'embed', 'gallery', 'table', 'break', 'htmlBlock', 'iframe', 'columns', 'button', 'buttons', 'cover', 'file', 'pullquote'])
  for (const block of blocks) {
    if (!supported.has(block._type)) throw new Error(`Unsupported migration block: ${block._type}`)
  }
  contentHtml(blocks)
  for (const block of blocks) {
    if (block._type === 'image' && block.asset.url) {
      const url = await embeddedMedia(block.asset.url)
      Object.assign(block, { asset: url.startsWith('/migrated-media/') ? { _type: 'reference', _ref: url, url } : { $media: { url, alt: block.alt || '' } } })
    }
  }
  return { id: post.id, slug: post.slug, status: 'published', data: {
    title: post.title, excerpt: post.excerpt, content: blocks,
    featured_image: post.image ? { $media: { url: post.image, alt: post.title } } : null,
    author_display: post.author, tags: post.tags.join(', '),
    original_published_at: post.publishedAt.toISOString(),
    original_updated_at: post.updatedAt.toISOString(),
  } }
}))
const seed = {
  $schema: 'https://emdashcms.com/seed.schema.json', version: '1',
  meta: { name: 'KK Trip', description: 'Published posts migrated from FlareCMS' },
  settings: { title: 'KK Trip', tagline: 'Travel stories and product updates', timezone: 'America/Chicago' },
  collections: [{ slug: 'posts', label: 'Posts', labelSingular: 'Post', urlPattern: '/posts/{slug}', supports: ['drafts', 'revisions', 'preview', 'scheduling', 'search', 'seo'], fields }],
  content: { posts: content },
}
await mkdir('seed', { recursive: true })
await writeFile('seed/seed.json', JSON.stringify(seed, null, 2) + '\n')
console.log(`Exported ${posts.length} published posts to seed/seed.json; drafts excluded.`)
