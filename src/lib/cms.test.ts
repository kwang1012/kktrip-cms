import { beforeEach, expect, it, vi } from 'vitest'
const api = vi.hoisted(() => ({ getEmDashCollection: vi.fn(), getEmDashEntry: vi.fn(), getSeoMeta: vi.fn() }))
vi.mock('emdash', () => api)
import { getPost, getPosts } from './cms'

beforeEach(() => vi.resetAllMocks())
const entry = (id: string) => ({ id, data: { id, title: id, status: 'published', content: [] } })

it('reads all cursor pages and requests only published revisions', async () => {
  api.getEmDashCollection.mockResolvedValueOnce({ entries: [entry('first')], nextCursor: 'next' })
    .mockResolvedValueOnce({ entries: [entry('second')] })
  expect((await getPosts()).map(post => post.slug)).toEqual(['first', 'second'])
  expect(api.getEmDashCollection).toHaveBeenNthCalledWith(2, 'posts', expect.objectContaining({ status: 'published', cursor: 'next' }))
})
it('propagates CMS failures instead of showing an empty blog', async () => {
  api.getEmDashCollection.mockResolvedValue({ entries: [], error: new Error('Database unavailable') })
  await expect(getPosts()).rejects.toThrow('Database unavailable')
})
it('allows a draft only when EmDash returns it through its authenticated entry query', async () => {
  api.getEmDashEntry.mockResolvedValue({ entry: { id: 'preview', data: { title: 'Preview', status: 'draft', content: [] } } })
  expect((await getPost('preview'))?.title).toBe('Preview')
  expect(api.getEmDashEntry).toHaveBeenCalledWith('posts', 'preview')
})
it('keeps missing or inaccessible entries absent', async () => {
  api.getEmDashEntry.mockResolvedValue({ entry: undefined })
  expect(await getPost('private')).toBeNull()
})
