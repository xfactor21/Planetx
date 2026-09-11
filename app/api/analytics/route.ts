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
  client_id?: string
  path?: string
  platform?: string
  properties?: Record<string, unknown>
  [key: string]: unknown
}

const ENVELOPE_FIELDS = new Set([
  'event',
  'timestamp',
  'source_product',
  'source_surface',
  'session_id',
  'anonymous_user_id',
  'client_id',
  'path',
  'platform',
  'properties',
])

export async function POST(req: NextRequest) {
  if (req.cookies.get(INTERNAL_TEST_COOKIE)?.value === '1') {
    return NextResponse.json({ ok: true, forwarded: false, internal: true }, { status: 202 })
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

  const ingestUrl = process.env.PLANETX_ANALYTICS_INGEST_URL || DEFAULT_INGEST_URL
  const key = process.env.PLANETX_ANALYTICS_KEY

  if (!key) {
    console.error('planet.X analytics is not configured: PLANETX_ANALYTICS_KEY is missing')
    return NextResponse.json(
      { ok: false, forwarded: false, error: 'Analytics service unavailable' },
      { status: 503 },
    )
  }

  const isVisualX = body.source_surface === 'visual-x-app' || VISUAL_X_EVENTS.has(body.event)
  const legacyProperties = Object.fromEntries(
    Object.entries(body).filter(([key, value]) => !ENVELOPE_FIELDS.has(key) && value !== undefined),
  )
  const properties = {
    ...legacyProperties,
    ...(body.properties && typeof body.properties === 'object' ? body.properties : {}),
  }
  const timestamp =
    typeof body.timestamp === 'string' && Number.isFinite(Date.parse(body.timestamp))
      ? new Date(body.timestamp).toISOString()
      : new Date().toISOString()

  const payload = {
    event: body.event,
    timestamp,
    source_product: isVisualX ? 'visual-x' : 'planet-x.co',
    source_surface: body.source_surface || (isVisualX ? 'visual-x-app' : 'website'),
    session_id: body.session_id || null,
    anonymous_user_id: body.anonymous_user_id || body.client_id || null,
    path: typeof body.path === 'string' ? body.path : '/',
    platform: typeof body.platform === 'string' ? body.platform : 'web',
    properties,
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
