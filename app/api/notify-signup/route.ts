import { NextResponse } from 'next/server'

// Where notify-me signups are sent (in addition to going on the Notion list).
const NOTIFY_EMAIL = 'xfactorxai@gmail.com'

// Notion database that stores every "get notified" signup. See:
// Website / Beta / Interested Users
const NOTION_DATABASE_ID = '5a59ea1b-475b-4000-bffb-1aa29be695ab'

type NotifySignupPayload = {
  email: string
  interestedIn?: string
}

export async function POST(req: Request) {
  let body: NotifySignupPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, interestedIn = 'MonsterX Release' } = body

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const notionToken = process.env.NOTION_API_KEY

  if (!resendKey) {
    console.error('RESEND_API_KEY is not set — notify signup was not emailed:', email)
    return NextResponse.json(
      { error: 'Signups are not yet configured. Please try again later.' },
      { status: 503 },
    )
  }

  // Send the notification email — this is the part that actually has to
  // succeed for the person to get a response back.
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

  // Best-effort: also log the signup to Notion so it can be reused for
  // future release notifications. If this fails, the signup still counts —
  // the email above already went out — so we don't fail the request over it.
  if (notionToken) {
    try {
      await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: {
            Email: { title: [{ text: { content: email } }] },
            'Interested In': { select: { name: interestedIn } },
            Submitted: { date: { start: new Date().toISOString() } },
          },
        }),
      })
    } catch (err) {
      console.error('Failed to log signup to Notion (non-fatal):', err)
    }
  } else {
    console.warn(
      'NOTION_API_KEY is not set — signup was emailed but not logged to Notion:',
      email,
    )
  }

  return NextResponse.json({ ok: true })
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
