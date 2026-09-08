'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { XMark } from '@/components/x-mark'
import { withXGlyph } from '@/components/x-glyph'
import { NavPrompt } from '@/components/nav-prompt'
import { useLockBodyScroll } from '@/lib/use-lock-body-scroll'
import { GradientMenuIcon } from '@/components/gradient-menu-icon'

const links = [
  { label: 'Visual.X', href: '/visual-x', kind: 'visualx' as const },
  { label: 'Store', href: '/store', kind: 'single' as const },
  { label: 'Coming Soon', href: '/coming-soon', kind: 'coming' as const },
  { label: 'Beta Testing', href: '/beta', kind: 'beta' as const },
  { label: 'StudyHive', href: '/studyhive', kind: 'single' as const },
  { label: 'X Factor Music', href: '/music', kind: 'music' as const },
  { label: 'About', href: '/about', kind: 'single' as const },
]

function DesktopNavLabel({ kind, label }: { kind: (typeof links)[number]['kind']; label: string }) {
  if (kind === 'coming') {
    return (
      <span className="flex flex-col items-center justify-center leading-[1.05]">
        <span>Coming</span>
        <span>Soon</span>
      </span>
    )
  }

  if (kind === 'music') {
    return (
      <span className="flex flex-col items-center justify-center leading-[1.05]">
        <span className="inline-flex items-center justify-center whitespace-nowrap">
          <span className="mr-0.5 inline-flex size-[1.15em] items-center justify-center align-middle">
            <Image
              src="/brand/uppercase_X_transparent.png"
              alt="X"
              width={1600}
              height={1600}
              className="size-full object-contain"
            />
          </span>
          Factor
        </span>
        <span>Music</span>
      </span>
    )
  }

  return <span className="whitespace-nowrap">{withXGlyph(label, true)}</span>
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  useLockBodyScroll(open)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-stretch">
        <Link
          href="/"
          className="flex shrink-0 items-center px-4 py-3 md:px-6 lg:px-8"
          aria-label="planet.X home"
        >
          <Image
            src="/brand/planet-x-wordmark-transparent.png"
            alt="planet.X"
            width={802}
            height={298}
            priority
            className="h-16 w-auto md:h-20 lg:h-24 xl:h-28"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center border-b border-l border-border px-3 py-2 md:px-4 lg:px-5">
          <nav aria-label="Main" className="hidden min-w-0 flex-1 md:block">
            <ul className="flex min-w-0 items-stretch justify-between gap-0.5 font-mono text-[0.9rem] font-semibold tracking-[0.08em] uppercase lg:text-[0.98rem] xl:text-base xl:tracking-[0.1em]">
              {links.map((link) => (
                <li key={link.href} className="flex min-w-0 flex-1 items-stretch">
                  <Link
                    href={link.href}
                    className="group flex min-h-14 w-full items-center justify-center px-1.5 py-2 text-center text-muted-foreground transition-colors hover:text-foreground lg:px-2 xl:px-2.5"
                  >
                    <DesktopNavLabel kind={link.kind} label={link.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            <NavPrompt open={open} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex size-12 shrink-0 items-center justify-center border-2 border-primary/60 bg-black/40"
            >
              <span className="sr-only">
                {open ? 'Close menu' : 'Open menu'}
              </span>
              <GradientMenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t-2 border-primary/50 bg-black md:hidden"
        >
          <div className="mx-3 mb-3 mt-3 border-2 border-accent/40 bg-background/60">
            <ul className="flex flex-col font-mono text-base font-bold tracking-[0.14em] uppercase">
              {links.map((link, i) => (
                <li
                  key={link.href}
                  className={i > 0 ? 'border-t border-accent/20' : ''}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-foreground/90 transition-colors active:bg-primary/10"
                  >
                    <XMark className="size-2.5 shrink-0 text-primary" />
                    {link.kind === 'music' ? (
                      <span className="inline-flex items-center">
                        <Image
                          src="/brand/uppercase_X_transparent.png"
                          alt="X"
                          width={1600}
                          height={1600}
                          className="mr-1 size-5 object-contain"
                        />
                        Factor Music
                      </span>
                    ) : (
                      withXGlyph(link.label, true)
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
