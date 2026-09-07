import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.PLANETX_ANALYTICS_KEY
  const ingestUrl = 'https://planet-x-command-center-y9yp7m.v2.appdeploy.ai/api/events'

  if (!key) {
    return NextResponse.json({ ok: false, stage: 'env', error: 'PLANETX_ANALYTICS_KEY missing' }, { status: 500 })
  }

  const payload = {
    event: 'page_view',
    timestamp: new Date().toISOString(),
    source_product: 'planet-x.co',
    source_surface: 'verification',
    session_id: 'planetx-preview-verification',
    anonymous_user_id: 'planetx-preview-verification',
    path: '/__analytics_verification__',
    platform: 'server',
    properties: { verification: true },
  }

  try {
    const res = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PlanetX-Analytics-Key': key,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
    const text = await res.text()
    return NextResponse.json({ ok: res.ok, stage: 'ingest', status: res.status, response: text.slice(0, 500) }, { status: res.ok ? 200 : 502 })
  } catch (error) {
    return NextResponse.json({ ok: false, stage: 'network', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 502 })
  }
}
