'use client'

import { useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { track } from '@vercel/analytics'
import { XMark } from '@/components/x-mark'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const startedAt = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || status === 'submitting') return

    setStatus('submitting')
    setErrorMessage('')
    track('waitlist_submit_attempt', { source: 'homepage' })

    try {
      const res = await fetch('/api/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          interestedIn: 'planet.X Beta',
          website,
          startedAt: startedAt.current,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        track('waitlist_submit_error', { source: 'homepage', status: res.status })
        return
      }

      setStatus('done')
      track('waitlist_submit_success', { source: 'homepage' })
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
      track('waitlist_submit_error', { source: 'homepage', status: 0 })
    }
  }

  return (
    <div className="mt-12 border border-primary bg-background p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold tracking-tight uppercase md:text-3xl">
            <XMark className="size-5 text-primary" />
            Get the beta first
          </h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            One email per drop. Nothing else, ever.
          </p>
        </div>

        {status === 'done' ? (
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-accent uppercase" role="status">
            <Check className="size-4" aria-hidden="true" />
            You&apos;re on the list
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                autoComplete="email"
                className="w-full border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="waitlist-website">Website</label>
                <input
                  id="waitlist-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center justify-center gap-2 bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Joining
                  </>
                ) : (
                  'Join'
                )}
              </button>
            </div>
            {errorMessage ? (
              <p className="mt-2 text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  )
}
