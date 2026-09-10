import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_INGEST_URL = 'https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-analytics-ingest'
const INTERNAL_TEST_COOKIE = 'planetx_internal_test'

const VISUAL_X_EVENTS = new Set([
  'visual_x_page_view',
  'visual_x_interest_click',
  'song_upload',
  'song_search',
  'generation_start',
  'generation_complete',
  'fullscreen_enter',
  'remix',
  'record_start',
  'record_complete',
  'export_complete',
  'share',
  'expert_mode_open',
  'song_selected',
  'song_uploaded',
  'generation_started',
  'generation_completed',
  'fullscreen_entered',
  'remix_clicked',
  'simple_to_expert_switched',
  'record_started',
  'record_completed',
  'export_completed',
  'share_invoked',
  'planetx_conversion',
])

const ALLOWED_EVENTS = new Set([
  'page_view',
  'waitlist_submit_attempt',
  'waitlist_submit_success',
  'waitlist_submit_error',
  'beta_application_submit_attempt',
  'beta_application_submit_success',
  'beta_application_submit_error',
  'music_play',
  'music_pause',
  'music_track_complete',
  'music_track_change',
  'music_download',
  'product_view',
  'product_cta_click',
  'beta_cta_click',
  'external_app_launch',
  ...VISUAL_X_EVENTS,
])

type AnalyticsEvent = {
  event: string
  timestamp?: string
  source_product?: string
  source_surface?: string
  session_id?: string
  anonymous_user_id?: string
  path?: string
  platform?: string
  properties?: Record<string, string | number | boolean | null>
}

export async function POST(req: NextRequest) {
  if (req.cookies.get(INTERNAL_TEST_COOKIE)?.value === '1') {
    return NextResponse.json({ ok: true, forwarded: false, internal: true }, { status: 202 })
  }

  const ingestUrl = process.env.PLANETX_ANALYTICS_INGEST_URL || DEFAULT_INGEST_URL
  const key = process.env.PLANETX_ANALYTICS_KEY

  if (!key) {
    return NextResponse.json({ ok: true, forwarded: false }, { status: 202 })
  }

  let body: AnalyticsEvent
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 })
  }

  const isVisualX = body.source_surface === 'visual-x-app' || VISUAL_X_EVENTS.has(body.event)
  const sourceProduct = body.source_product || (isVisualX ? 'visual-x' : 'planet-x.co')

  const payload = {
    ...body,
    timestamp: body.timestamp || new Date().toISOString(),
    source_product: sourceProduct,
    source_surface: body.source_surface || (isVisualX ? 'visual-x-app' : 'website'),
    path: body.path || null,
    properties: body.properties || {},
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

    if (!res.ok) {
      console.error('planet.X analytics ingest failed:', res.status, await res.text())
      return NextResponse.json({ ok: false, forwarded: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true, forwarded: true })
  } catch (error) {
    console.error('planet.X analytics ingest unreachable:', error)
    return NextResponse.json({ ok: false, forwarded: false }, { status: 502 })
  }
}
