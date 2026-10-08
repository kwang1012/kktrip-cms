import { expect, it } from 'vitest'
import { localePath, siteLocale } from './locales'
import { getStrings } from './strings'
it('preserves existing Chinese URLs and prefixes translated routes', () => {
  expect(localePath('/posts/hello', 'zh-TW')).toBe('/posts/hello')
  expect(localePath('/posts/hello', 'en')).toBe('/en/posts/hello')
  expect(localePath('/search', 'ja')).toBe('/ja/search')
  expect(localePath('/rss.xml', 'ko')).toBe('/ko/rss.xml')
  expect(siteLocale('unknown')).toBe('zh-TW')
})
it('localizes listing and reader controls', () => {
  expect(getStrings('en').allPosts).toBe('All articles')
  expect(getStrings('ja').toc).toBe('目次')
  expect(getStrings('ko').readMin(3)).toBe('3분 읽기')
  expect(getStrings('zh-TW').allPosts).toBe('所有文章')
})
