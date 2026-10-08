import { expect, it, vi } from 'vitest'
vi.mock('emdash', () => ({
  getMenu: vi.fn(async () => ({ items: [
    { id: 'home', label: 'Home', url: '/', children: [] },
    { id: 'search', label: 'Search', url: '/search', children: [] },
    { id: 'app', label: 'App', url: 'https://kktrip.app', children: [] },
    { id: 'localized', label: 'English', url: '/en/', children: [] },
  ] })),
  getSiteSettings: vi.fn(),
}))
import { navigation } from './chrome'
it('keeps internal CMS navigation in the selected language', async () => {
  const items = await navigation('primary', 'ja')
  expect(items.map(item => item.url)).toEqual(['/ja/', '/ja/search', 'https://kktrip.app', '/en/'])
})
