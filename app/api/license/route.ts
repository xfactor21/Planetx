import { NextRequest, NextResponse } from 'next/server'
import { activateLicense, deactivateLicense, verifyLicense } from '@/lib/license-gateway'

type Action = 'verify' | 'activate' | 'deactivate'

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return withCors(NextResponse.json({ ok: false, valid: false, error: 'Invalid JSON body' }, { status: 400 }))
  }

  const action = String(body?.action || 'verify') as Action
  const product = String(body?.product || '').trim().toLowerCase()
  const licenseKey = String(body?.licenseKey || body?.license_key || '').trim()
  const deviceId = body?.deviceId || body?.device_id ? String(body.deviceId || body.device_id).trim() : undefined
  const token = body?.token ? String(body.token) : undefined

  if (!['verify', 'activate', 'deactivate'].includes(action)) {
    return withCors(NextResponse.json({ ok: false, valid: false, error: 'Unsupported action' }, { status: 400 }))
  }
  if (!product || !licenseKey) {
    return withCors(NextResponse.json({ ok: false, valid: false, error: 'Product and license key are required' }, { status: 400 }))
  }

  const input = { product, licenseKey, deviceId, token }
  const result = action === 'activate'
    ? await activateLicense(input)
    : action === 'deactivate'
      ? await deactivateLicense(input)
      : await verifyLicense(input)

  const status = result.ok ? 200 : 503
  return withCors(NextResponse.json(result, { status }))
}
