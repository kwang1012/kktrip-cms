import { describe, expect, it } from 'vitest'
import { imageUrl, toDate } from './content-values'

describe('content values', () => {
  it('accepts media URLs and static seed assets', () => {
    expect(imageUrl('https://x/y.jpg')).toBe('https://x/y.jpg')
    expect(imageUrl({ url: '/migrated-media/image.png' })).toBe('/migrated-media/image.png')
    expect(imageUrl(undefined)).toBeNull()
  })
  it('normalizes original and native timestamps with a fallback', () => {
    const fallback = new Date(0)
    expect(toDate(1_800_000_000, fallback).getTime()).toBe(1_800_000_000_000)
    expect(toDate(1_800_000_000_000, fallback).getTime()).toBe(1_800_000_000_000)
    expect(toDate('2026-10-05T12:00:00Z', fallback).toISOString()).toBe('2026-10-05T12:00:00.000Z')
    expect(toDate('invalid', fallback)).toBe(fallback)
    expect(toDate(null, fallback)).toBe(fallback)
  })
})
