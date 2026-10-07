/** Protect first administrator registration during production cutover. */
export function setupAccess(request: Request, key?: string): Response | undefined {
  if (!key) return
  const url = new URL(request.url)
  let pathname: string
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    return denied()
  }
  const cookie = request.headers.get('cookie')?.split(';').some(
    (part) => part.trim() === `kktrip_setup=${key}`,
  )
  const authorized = cookie || request.headers.get('authorization') === `Bearer ${key}`
  if (pathname === '/_emdash/setup-access') {
    if (url.searchParams.get('key') !== key) return denied()
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/_emdash/admin/setup',
        'Set-Cookie': `kktrip_setup=${key}; Path=/_emdash; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
      },
    })
  }
  if ((pathname.startsWith('/_emdash/api/setup') ||
       pathname.startsWith('/_emdash/admin/setup')) && !authorized) return denied()
}

function denied(): Response {
  return new Response('Administrator setup requires the private setup link.', {
    status: 403,
    headers: { 'Cache-Control': 'no-store' },
  })
}
