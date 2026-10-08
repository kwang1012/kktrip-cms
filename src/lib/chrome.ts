import { getMenu, getSiteSettings } from 'emdash'
import type { MenuItem } from 'emdash'
import { navGroups } from './nav'
import { getStrings } from './strings'
import { localePath } from './locales'

const fallback: MenuItem[] = navGroups.map((group, index) => ({
  id: `group-${index}`, label: group.label, url: group.items[0].href,
  children: group.items.map((item, i) => ({ id: `item-${index}-${i}`, label: item.label, url: item.href, target: '_blank', children: [] })),
}))
export async function navigation(name: 'primary' | 'footer', locale?: string): Promise<MenuItem[]> {
  const t = getStrings(locale)
  const menu = await getMenu(name, { locale })
  if (menu) {
    const localize = (items: MenuItem[]): MenuItem[] => items.map(item => ({
      ...item,
      url: item.url.startsWith('/') && !item.url.startsWith('//') && !/^\/(en|ja|ko)(\/|$)/.test(item.url)
        ? localePath(item.url, locale) : item.url,
      children: localize(item.children),
    }))
    return localize(menu.items)
  }
  return name === 'primary' ? [...fallback, { id: 'search', label: '搜尋', url: '/search', children: [] }] : [
    { id: 'posts', label: t.allPosts, url: '/', children: [] },
    { id: 'rss', label: t.rss, url: '/rss.xml', children: [] },
    { id: 'search', label: '搜尋', url: '/search', children: [] },
  ]
}
export async function siteIdentity(locale?: string) {
  const t = getStrings(locale)
  const settings = await getSiteSettings()
  return { title: locale && locale !== 'zh-TW' ? t.siteName : settings.title || t.siteName, tagline: locale && locale !== 'zh-TW' ? t.siteTagline : settings.tagline || t.siteTagline }
}
