import { NextRequest, NextResponse } from 'next/server'

const APPDEPLOY_ORIGIN = 'https://visual-x-g9w4nz.v2.appdeploy.ai'

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params
  const incoming = new URL(request.url)
  const target = new URL(`${APPDEPLOY_ORIGIN}/${path.join('/')}`)
  incoming.searchParams.forEach((value, key) => target.searchParams.append(key, value))

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  headers.set('accept', request.headers.get('accept') || 'application/json')

  const init: RequestInit = { method: request.method, headers, cache: 'no-store' }
  if (!['GET', 'HEAD'].includes(request.method)) init.body = await request.text()

  try {
    const upstream = await fetch(target, init)
    const body = await upstream.arrayBuffer()
    const responseHeaders = new Headers()
    const upstreamType = upstream.headers.get('content-type')
    if (upstreamType) responseHeaders.set('content-type', upstreamType)
    responseHeaders.set('cache-control', 'no-store')
    return new NextResponse(body, { status: upstream.status, headers: responseHeaders })
  } catch {
    return NextResponse.json({ error: 'Visual.X compatibility API is temporarily unavailable.' }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
