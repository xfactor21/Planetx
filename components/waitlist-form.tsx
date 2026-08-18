'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { XMark } from '@/components/x-mark'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

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

        {done ? (
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-accent uppercase">
            <Check className="size-4" aria-hidden="true" />
            You&apos;re on the list
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!email) return
              setDone(true)
            }}
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
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
              className="w-full border border-border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
