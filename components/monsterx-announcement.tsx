'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, X } from 'lucide-react'
import { useLockBodyScroll } from '@/lib/use-lock-body-scroll'
import { XLetter } from '@/components/x-glyph'

type Step = 'announce' | 'email' | 'thanks'

export function MonsterXAnnouncement() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('announce')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Keep policy and application pages free of unrelated promotional UI.
    if (['/context/privacy', '/beta'].includes(window.location.pathname)) return

    // Show once per browser session, not on every page navigation.
    const alreadyShown = sessionStorage.getItem('monsterx-announcement-shown')
    if (alreadyShown) return
    sessionStorage.setItem('monsterx-announcement-shown', '1')
    const timeout = window.setTimeout(() => setOpen(true), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  useLockBodyScroll(open)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interestedIn: 'MonsterX Release' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || 'Something went wrong. Try again in a bit.')
        setSubmitting(false)
        return
      }

      setStep('thanks')
    } catch {
      setError('Something went wrong. Try again in a bit.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="MonsterX announcement"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div className="relative w-full max-w-[22rem] overflow-hidden border border-primary/40 bg-black sm:max-w-sm md:max-w-md">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {step !== 'thanks' ? (
          <div className="relative aspect-square w-full">
            <Image
              src="/announcements/monsterx-cover.png"
              alt="MonsterX cover art"
              fill
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        {step === 'announce' ? (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <p className="font-mono text-[0.7rem] tracking-[0.24em] text-accent uppercase">
              New single incoming
            </p>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full py-4 text-center font-mono text-base font-bold tracking-[0.14em] text-white uppercase"
              style={{ background: 'linear-gradient(90deg, #ff2e9f, #00f5ff)' }}
            >
              Get notified when it releases
            </button>
          </div>
        ) : null}

        {step === 'email' ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 p-6 text-center"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Drop your email and you&apos;ll be the first to know the second
              MonsterX drops.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-border bg-background px-4 py-3 text-center text-sm text-foreground outline-none focus:border-accent"
            />
            {error ? (
              <p className="text-xs text-red-400">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 py-4 text-center font-mono text-base font-bold tracking-[0.14em] text-white uppercase disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, #ff2e9f, #00f5ff)' }}
            >
              {submitting ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                'Submit'
              )}
            </button>
          </form>
        ) : null}

        {step === 'thanks' ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="font-mono text-[0.7rem] tracking-[0.24em] text-accent uppercase">
              You&apos;re on the list
            </p>
            <h3 className="text-2xl font-bold tracking-tight uppercase">
              You&apos;re in.
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              MonsterX is coming. The second it&apos;s live, you hear it
              first — no algorithm, no delay, straight from <span className="inline-block whitespace-nowrap"><XLetter />Factor</span>.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 font-mono text-xs tracking-[0.16em] text-primary uppercase hover:underline"
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
