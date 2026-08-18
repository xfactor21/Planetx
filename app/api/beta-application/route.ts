import { NextResponse } from 'next/server'
import { releasedApps } from '@/lib/data'

// Where completed beta applications are sent.
const NOTIFY_EMAIL = 'xfactorxai@gmail.com'

type BetaApplicationPayload = {
  appId: string
  appName: string
  email: string
  answers: { question: string; answer: string }[]
}

export async function POST(req: Request) {
  let body: BetaApplicationPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { appId, appName, email, answers } = body

  if (!appId || !appName || !email || !Array.isArray(answers)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // No email service configured yet — fail loudly in logs so this is easy
    // to spot during setup, but don't error out the user's submission if
    // you'd rather silently no-op during development.
    console.error(
      'RESEND_API_KEY is not set — beta application was not emailed:',
      { appId, appName, email },
    )
    return NextResponse.json(
      { error: 'Beta applications are not yet configured. Please try again later.' },
      { status: 503 },
    )
  }

  const answersHtml = answers
    .map(
      (a, i) =>
        `<p style="margin:0 0 12px;"><strong>${i + 1}. ${escapeHtml(a.question)}</strong><br/>${escapeHtml(a.answer) || '<em>(no answer)</em>'}</p>`,
    )
    .join('')

  const app = releasedApps.find((a) => a.id === appId)
  const appLink = app?.appUrl

  const approveHtml = appLink
    ? `
      <div style="margin:20px 0; padding:16px; background:#f5f5f5; border-radius:8px;">
        <p style="margin:0 0 10px; color:#333;">To approve, reply to this email or send the link directly:</p>
        <a href="${escapeHtml(appLink)}" style="display:inline-block; padding:10px 16px; background:#111; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
          ${escapeHtml(appName)} — ${escapeHtml(appLink)}
        </a>
        <p style="margin:12px 0 0;">
          <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`You're in — ${appName} beta`)}&body=${encodeURIComponent(`Hey,\n\nYou're approved for the ${appName} beta. Here's the link:\n${appLink}\n\nFor the best experience, install it to your home screen:\niPhone: open the link in Safari, tap the Share icon, then "Add to Home Screen"\nAndroid: open the link in Chrome, tap the menu (⋮), then "Install app" or "Add to Home screen"\n\nThanks for signing up!`)}">
            Click here to send the approval email
          </a>
        </p>
      </div>
    `
    : ''

  const html = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="margin:0 0 4px;">New Beta Application — ${escapeHtml(appName)}</h2>
      <p style="margin:0 0 20px; color:#666;">Applicant email: <strong>${escapeHtml(email)}</strong></p>
      ${approveHtml}
      ${answersHtml}
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Beta Applications <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: `New ${appName} beta application — ${email}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Resend API error:', res.status, errText)
      return NextResponse.json({ error: 'Failed to send application' }, { status: 502 })
    }
  } catch (err) {
    console.error('Failed to reach Resend:', err)
    return NextResponse.json({ error: 'Failed to send application' }, { status: 502 })
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
