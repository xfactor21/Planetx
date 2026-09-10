import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'planetx_internal_test'
const ONE_YEAR = 60 * 60 * 24 * 365

export function GET(req: NextRequest) {
  const enabled = req.nextUrl.searchParams.get('off') !== '1'
  const url = new URL('/', req.url)
  const res = NextResponse.redirect(url)

  if (enabled) {
    res.cookies.set(COOKIE, '1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_YEAR,
    })
  } else {
    res.cookies.set(COOKIE, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  return res
}
