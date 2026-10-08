export const LOCALES = ['zh-TW', 'en', 'ja', 'ko'] as const
export type Locale = typeof LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'zh-TW'
export const localeNames: Record<Locale, string> = { 'zh-TW': '繁體中文', en: 'English', ja: '日本語', ko: '한국어' }
export function siteLocale(value?: string): Locale {
  return LOCALES.find(locale => locale === value) ?? DEFAULT_LOCALE
}
export function localePath(path: string, locale: string = DEFAULT_LOCALE): string {
  const normalized = siteLocale(locale)
  return normalized === DEFAULT_LOCALE ? path : `/${normalized}${path}`
}
