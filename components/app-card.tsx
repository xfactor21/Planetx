'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Lock } from 'lucide-react'
import type { ReleasedApp } from '@/lib/data'
import { withXGlyph } from '@/components/x-glyph'

export function AppCard({ app }: { app: ReleasedApp }) {
  // Mature cards start gated on every load — acceptance is not persisted across sessions.
  const [revealed, setRevealed] = useState(!app.mature)
  const gated = Boolean(app.mature) && !revealed

  return (
    <article className="relative flex flex-col gap-4 sm:gap-6 bg-background p-5 sm:p-8 md:p-10">
      <div
        className={
          gated ? 'flex h-full flex-col pointer-events-none select-none blur-xl' : 'flex h-full flex-col'
        }
        aria-hidden={gated}
      >
        <div className="flex items-start gap-5">
          <Image
            src={app.icon || '/placeholder.svg'}
            alt={`${app.name} app icon`}
            width={72}
            height={72}
            className="app-icon-preview size-16 shrink-0 rounded-2xl border border-border object-cover md:size-[72px]"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-2xl font-bold tracking-tight uppercase">
                {withXGlyph(app.name)}
              </h3>
              {app.version ? (
                <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground">
                  v{app.version}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {app.tagline}
            </p>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-foreground/90">
          {app.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {app.tags.map((tag) => (
            <li
              key={tag}
              className="border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
          <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
            {app.platforms.join(' · ')}
          </p>
          <div className="flex flex-wrap gap-3">
            {app.betaHref ? (
              <Link
                href={app.betaHref}
                tabIndex={gated ? -1 : undefined}
                className="group inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Join Beta
                <ArrowUpRight
                  className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : app.detailHref ? (
              <Link
                href={app.detailHref}
                tabIndex={gated ? -1 : undefined}
                className="group inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn more
                <ArrowUpRight
                  className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              app.downloads.map((dl) => (
                <a
                  key={dl.label}
                  href={dl.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={gated ? -1 : undefined}
                  className="group inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {dl.label}
                  <ArrowUpRight
                    className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {gated ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/40 p-8 text-center backdrop-blur-md">
          <Lock className="size-8 text-primary" aria-hidden="true" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight uppercase">
              Mature Content — 18+
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              This app contains adult/BDSM themes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center justify-center bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {"I'm 18 or older — Show"}
          </button>
        </div>
      ) : null}
    </article>
  )
}
