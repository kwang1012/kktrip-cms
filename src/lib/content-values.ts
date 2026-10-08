function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** CMS timestamps are epoch millis (or seconds / ISO strings); fall back to `fallback`. */
export function toDate(value: unknown, fallback: Date): Date {
  if (value === null || value === undefined || value === '') return fallback
  const n = typeof value === 'number' ? value : Number(value)
  const date = Number.isFinite(n) ? new Date(n < 1e11 ? n * 1000 : n) : new Date(String(value))
  return Number.isNaN(date.getTime()) ? fallback : date
}

/**
 * Media fields may contain a direct URL or an object carrying one.
 */
export function imageUrl(value: unknown): string | null {
  let url: string | null = null
  if (typeof value === 'string') url = value.trim() || null
  else if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    url = str(v.url) || str(v.publicUrl) || null
  }
  return url
}
