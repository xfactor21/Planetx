'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon, X } from 'lucide-react'
import { BetaApplicationModal } from '@/components/beta-application-modal'
import { withXGlyph } from '@/components/x-glyph'
import type { BetaAppConfig } from '@/lib/beta-questions'

export function BetaAppCard({
  id,
  name,
  tagline,
  description,
  icon,
  tags,
  screenshots,
  config,
  linkHref,
  detailsHref,
  detailsLabel = 'Learn more',
  buttonLabel = 'Join Beta',
}: {
  id?: string
  name: string
  tagline: string
  description: string
  icon: string
  tags: string[]
  screenshots?: string[]
  /** Opens the qualification modal. Omit and pass linkHref instead for apps with their own dedicated flow (e.g. StudyHive). */
  config?: BetaAppConfig
  /** When set instead of config, the button becomes a plain link to this URL. */
  linkHref?: string
  /** Optional supporting page shown alongside the application action. */
  detailsHref?: string
  detailsLabel?: string
  buttonLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !config) return

    const requestedApp = new URLSearchParams(window.location.search).get('apply')
    if (requestedApp === id) {
      setOpen(true)
    }
  }, [config, id])

  return (
    <div
      id={id}
      className="flex h-full scroll-mt-24 flex-col gap-4 border border-border bg-card p-5 sm:gap-6 sm:p-8 md:p-10"
    >
      <div className="flex items-start gap-4">
        <Image
          src={icon || '/placeholder.svg'}
          alt={`${name} icon`}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-2xl border border-border object-contain bg-background/70"
        />
        <div>
          <h3 className="text-2xl font-bold tracking-tight uppercase">{withXGlyph(name)}</h3>
          <p className="mt-1 text-sm text-foreground/80">{tagline}</p>
        </div>
      </div>

      <p className="leading-relaxed text-muted-foreground">{description}</p>

      <div>
        <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
          Screenshots
        </span>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(screenshots && screenshots.length > 0
            ? screenshots
            : [null, null, null]
          )
            .slice(0, 3)
            .map((src, i) =>
              src ? (
                <button
                  key={src}
                  type="button"
                  onClick={() => setZoomed(src)}
                  className="beta-screenshot-preview relative aspect-[9/16] w-full overflow-hidden rounded-md border border-border bg-background/70"
                  aria-label={`Open ${name} screenshot ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${name} screenshot ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 30vw, 14vw"
                  />
                </button>
              ) : (
                <div
                  key={i}
                  className="flex aspect-[9/16] w-full items-center justify-center rounded-md border border-dashed border-border bg-background/50"
                >
                  <ImageIcon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              ),
            )}
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-4">
        {linkHref ? (
          <Link
            href={linkHref}
            className="w-fit bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {buttonLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-fit bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {buttonLabel}
          </button>
        )}
        {detailsHref ? (
          <Link
            href={detailsHref}
            className="font-mono text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
          >
            {detailsLabel}
          </Link>
        ) : null}
      </div>


      {zoomed ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setZoomed(null)}
        >
          <button
            type="button"
            aria-label="Close screenshot"
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/60 p-3 text-white hover:border-primary hover:text-primary"
            onClick={() => setZoomed(null)}
          >
            <X className="size-6" />
          </button>
          <div className="relative h-[88vh] w-full max-w-[42rem]" onClick={(e) => e.stopPropagation()}>
            <Image src={zoomed} alt={`${name} expanded screenshot`} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      ) : null}

      {open && config ? (
        <BetaApplicationModal config={config} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  )
}
