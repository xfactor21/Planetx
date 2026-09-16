import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

const ANALYTICS_URL = process.env.PLANETX_ANALYTICS_INGEST_URL || 'https://lufvkrnwqbqdaqcgljxt.supabase.co/functions/v1/planetx-analytics-ingest'
const ANALYTICS_KEY = process.env.PLANETX_ANALYTICS_KEY || ''
const PAYHIP_API_KEY = process.env.PAYHIP_API_KEY || ''

const PRODUCT_IDS: Record<string, string> = {
  'CIwxS': 'essential-ui-sounds',
  'ROlqw': 'digital-glitch-fx',
  '7cJjO': 'indie-launch-kit',
  '3K5at': 'creator-asset-forge',
  'tA5To': 'creator-stream-pack',
  'BCK4P': 'interface-hud-kit',
  '49vW6': 'website-atmosphere-pack',
  'NGUKi': 'creator-editing-overlays',
  '6x4EO': 'digital-worlds-wallpapers',
  'PcOWp': 'producer-transitions-impacts',
}

type PayhipItem = {
  product_name?: string
  product_key?: string
  product_permalink?: string
  quantity?: string | number
}

type PayhipPayload = {
  id?: string
  type?: string
  signature?: string
  currency?: string
  price?: number
  amount_refunded?: number
  payment_type?: string
  date?: number
  date_created?: number
  date_refunded?: number
  items?: PayhipItem[]
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function productId(item: PayhipItem) {
  const key = item.product_key || item.product_permalink?.split('/').filter(Boolean).pop() || ''
  return PRODUCT_IDS[key] || key || 'unknown'
}

export async function POST(request: NextRequest) {
  if (!PAYHIP_API_KEY || !ANALYTICS_KEY) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  let payload: PayhipPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const expectedSignature = hash(PAYHIP_API_KEY)
  if (!payload.signature || !safeEqual(payload.signature, expectedSignature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  if (!['paid', 'refunded'].includes(payload.type || '')) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const transactionToken = hash(payload.id || crypto.randomUUID()).slice(0, 32)
  const timestampSeconds = payload.type === 'refunded'
    ? payload.date_refunded || payload.date_created
    : payload.date
  const timestamp = timestampSeconds
    ? new Date(timestampSeconds * 1000).toISOString()
    : new Date().toISOString()

  const items = Array.isArray(payload.items) ? payload.items : []
  const event = payload.type === 'paid' ? 'purchase_completed' : 'purchase_refunded'
  const amountCents = payload.type === 'refunded'
    ? Number(payload.amount_refunded || 0)
    : Number(payload.price || 0)

  const results = await Promise.all(items.map(async (item) => {
    const id = productId(item)
    const properties = {
      provider: 'payhip',
      transaction_token: transactionToken,
      product_id: id,
      product_name: String(item.product_name || id).slice(0, 160),
      quantity: Number(item.quantity || 1),
      amount_cents: amountCents,
      currency: String(payload.currency || 'USD').slice(0, 8),
      payment_type: String(payload.payment_type || '').slice(0, 32),
    }

    return fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PlanetX-Analytics-Key': ANALYTICS_KEY,
      },
      body: JSON.stringify({
        event,
        timestamp,
        source_product: 'planet-x.co',
        source_surface: 'store_purchase',
        session_id: `payhip-${transactionToken}`,
        anonymous_user_id: `purchase-${transactionToken}`,
        path: `/store/purchase/${id}`,
        platform: 'server',
        properties,
      }),
    })
  }))

  if (results.some((response) => !response.ok)) {
    return NextResponse.json({ error: 'Analytics write failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
