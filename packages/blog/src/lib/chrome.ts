import { getMenu, getSiteSettings } from 'emdash'
import type { MenuItem } from 'emdash'
import { navGroups } from './nav'
import { t } from './strings'

const fallback: MenuItem[] = navGroups.map((group, index) => ({
  id: `group-${index}`, label: group.label, url: group.items[0].href,
  children: group.items.map((item, i) => ({ id: `item-${index}-${i}`, label: item.label, url: item.href, target: '_blank', children: [] })),
}))
export async function navigation(name: 'primary' | 'footer'): Promise<MenuItem[]> {
  const menu = await getMenu(name)
  if (menu) return menu.items
  return name === 'primary' ? [...fallback, { id: 'search', label: '搜尋', url: '/search', children: [] }] : [
    { id: 'posts', label: t.allPosts, url: '/', children: [] },
    { id: 'rss', label: t.rss, url: '/rss.xml', children: [] },
    { id: 'search', label: '搜尋', url: '/search', children: [] },
  ]
}
export async function siteIdentity() {
  const settings = await getSiteSettings()
  return { title: settings.title || t.siteName, tagline: settings.tagline || t.siteTagline }
}
