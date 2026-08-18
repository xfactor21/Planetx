'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon } from 'lucide-react'
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
  buttonLabel?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      id={id}
      className="flex scroll-mt-24 flex-col gap-4 border border-border bg-card p-5 sm:gap-6 sm:p-8 md:p-10"
    >
      <div className="flex items-start gap-4">
        <Image
          src={icon || '/placeholder.svg'}
          alt={`${name} icon`}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-2xl border border-border object-cover"
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
                <Image
                  key={src}
                  src={src}
                  alt={`${name} screenshot ${i + 1}`}
                  width={200}
                  height={360}
                  className="aspect-[9/16] w-full rounded-md border border-border object-cover"
                />
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

      {linkHref ? (
        <Link
          href={linkHref}
          className="mt-auto w-fit bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {buttonLabel}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-auto w-fit bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {buttonLabel}
        </button>
      )}

      {open && config ? (
        <BetaApplicationModal config={config} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  )
}
