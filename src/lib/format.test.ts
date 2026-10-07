import { describe, expect, it } from 'vitest'
import { formatDate, readingMinutes } from './format'

describe('formatting', () => {
  it('readingMinutes is at least 1', () => {
    expect(readingMinutes('<p>short</p>')).toBe(1)
    expect(readingMinutes(`<p>${'旅'.repeat(800)}</p>`)).toBe(2)
  })
  it('formatDate renders a zh-TW date', () => {
    expect(formatDate(new Date(Date.UTC(2026, 9, 5, 12)))).toContain('2026')
  })
})
