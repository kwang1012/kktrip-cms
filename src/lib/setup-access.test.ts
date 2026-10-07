import { describe, expect, it } from 'vitest'
import { setupAccess } from './setup-access'

describe('production setup access', () => {
  it('keeps public content accessible and unclaimed setup private', () => {
    expect(setupAccess(new Request('https://news.kktrip.app/posts/example'), 'secret')).toBeUndefined()
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/api/setup/admin'), 'secret')?.status).toBe(403)
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/admin/setup'), 'secret')?.status).toBe(403)
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/api/%73etup/admin'), 'secret')?.status).toBe(403)
  })
  it('accepts the private link and binds subsequent requests to a secure cookie', () => {
    const response = setupAccess(new Request('https://news.kktrip.app/_emdash/setup-access?key=secret'), 'secret')
    expect(response?.status).toBe(303)
    expect(response?.headers.get('set-cookie')).toContain('HttpOnly; Secure; SameSite=Strict')
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/api/setup', {
      headers: { cookie: 'other=value; kktrip_setup=secret' },
    }), 'secret')).toBeUndefined()
  })
  it('rejects incorrect links and cookies and permits protected import requests', () => {
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/setup-access?key=wrong'), 'secret')?.status).toBe(403)
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/api/setup', {
      headers: { cookie: 'kktrip_setup=wrong' },
    }), 'secret')?.status).toBe(403)
    expect(setupAccess(new Request('https://news.kktrip.app/_emdash/api/setup', {
      headers: { authorization: 'Bearer secret' },
    }), 'secret')).toBeUndefined()
  })
})
