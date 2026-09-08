import { NextResponse } from 'next/server'
import {
  consumeRateLimit,
  looksAutomated,
  rejectOversizedBody,
} from '@/lib/request-guard'

// Notify-me signups are emailed here. This is the single system of record for now.
const NOTIFY_EMAIL = 'xfactor.planetx@gmail.com'

type NotifySignupPayload = {
  email: string
  interestedIn?: string
  website?: string
  startedAt?: number
}

export async function POST(req: Request) {
  if (rejectOversizedBody(req, 8_192)) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  const rate = consumeRateLimit(req, 'notify-signup', 5, 10 * 60 * 1000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again shortly.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      },
    )
  }

  let body: NotifySignupPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    email,
    interestedIn = 'planet.X Beta',
    website = '',
    startedAt,
  } = body

  if (looksAutomated(startedAt, website)) {
    return NextResponse.json({ ok: true })
  }

  if (!email || email.length > 254) {
    return NextResponse.json({ error: 'Missing or invalid email' }, { status: 400 })
  }

  if (interestedIn.length > 120) {
    return NextResponse.json({ error: 'Invalid signup category' }, { status: 400 })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    console.error('RESEND_API_KEY is not set — notify signup was not emailed:', email)
    return NextResponse.json(
      { error: 'Signups are not yet configured. Please try again later.' },
      { status: 503 },
    )
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'xFactor Notify <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: `New notify-me signup — ${email}`,
        html: `<p><strong>${escapeHtml(email)}</strong> wants to be notified about: ${escapeHtml(interestedIn)}</p>`,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Resend API error:', res.status, errText)
      return NextResponse.json({ error: 'Failed to submit signup' }, { status: 502 })
    }
  } catch (err) {
    console.error('Failed to reach Resend:', err)
    return NextResponse.json({ error: 'Failed to submit signup' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
