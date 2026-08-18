'use client'

import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import type { BetaAppConfig } from '@/lib/beta-questions'
import { withXGlyph } from '@/components/x-glyph'

export function BetaApplicationModal({
  config,
  onClose,
}: {
  config: BetaAppConfig
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function setValue(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const missingRequired = config.questions.some(
      (q) => q.required && !values[q.id],
    )
    if (missingRequired || !email) {
      setErrorMessage('Please fill out all required fields.')
      return
    }

    setErrorMessage('')
    setStatus('submitting')

    const answers = config.questions.map((q) => ({
      question: q.label,
      answer:
        q.type === 'checkbox'
          ? values[q.id] === 'true'
            ? 'Yes'
            : 'No'
          : values[q.id] || '',
    }))

    try {
      const res = await fetch('/api/beta-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: config.id,
          appName: config.appName,
          email,
          answers,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('done')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${config.appName} beta application`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-primary bg-background p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-accent uppercase">
              Beta application
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight uppercase">
              {withXGlyph(config.appName)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {status === 'done' ? (
          <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
            <Check className="size-10 text-accent" aria-hidden="true" />
            <p className="text-lg font-bold tracking-tight uppercase">
              Application sent
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Thanks for applying. Applications are reviewed individually, so
              it&apos;s not instant — but we move fast. If you&apos;re a fit,
              you&apos;ll get an email at the address you provided with your
              access link.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-primary px-5 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div>
              <label
                htmlFor="beta-email"
                className="mb-1.5 block font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase"
              >
                Email address
              </label>
              <input
                id="beta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {config.questions.map((q, i) => (
              <div key={q.id}>
                {q.type === 'checkbox' ? (
                  <label className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      required={q.required}
                      checked={values[q.id] === 'true'}
                      onChange={(e) =>
                        setValue(q.id, e.target.checked ? 'true' : 'false')
                      }
                      className="mt-0.5 size-4 shrink-0 accent-primary"
                    />
                    <span>
                      {i + 1}. {q.label}
                    </span>
                  </label>
                ) : (
                  <>
                    <label
                      htmlFor={q.id}
                      className="mb-1.5 block font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase"
                    >
                      {i + 1}. {q.label}
                      {q.required ? ' *' : ''}
                    </label>
                    {q.type === 'select' ? (
                      <select
                        id={q.id}
                        required={q.required}
                        value={values[q.id] || ''}
                        onChange={(e) => setValue(q.id, e.target.value)}
                        className="w-full border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {q.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : q.type === 'textarea' ? (
                      <textarea
                        id={q.id}
                        required={q.required}
                        value={values[q.id] || ''}
                        onChange={(e) => setValue(q.id, e.target.value)}
                        rows={3}
                        className="w-full border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                      />
                    ) : (
                      <input
                        id={q.id}
                        type="text"
                        required={q.required}
                        value={values[q.id] || ''}
                        onChange={(e) => setValue(q.id, e.target.value)}
                        className="w-full border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 flex items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending
                </>
              ) : (
                'Submit application'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
