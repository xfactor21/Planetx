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
  { label: 'Join Beta Test', href: '/beta' },
  { label: 'Store', href: '/store' },
  { label: 'Coming Soon', href: '/coming-soon' },
  { label: 'xFactor Music', href: '/music' },
  { label: 'StudyHive', href: '/studyhive' },
  { label: 'About', href: '/about' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  useLockBodyScroll(open)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-stretch">
        {/* Left zone: just the mark, no bottom border — reads as part of the page, not the nav bar. */}
        <Link
          href="/"
          className="flex shrink-0 items-center px-4 py-3 md:px-8"
          aria-label="planet.X home"
        >
          <Image
            src="/brand/planet-x-wordmark-transparent.png"
            alt="planet.X"
            width={802}
            height={298}
            priority
            className="h-16 w-auto md:h-24 lg:h-28"
          />
        </Link>

        {/* Right zone: the actual nav bar, boxed off with its own left divider and bottom border. */}
        <div className="flex flex-1 items-center justify-between gap-4 border-b border-l border-border px-4 py-2 md:px-8">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1 font-mono text-sm tracking-[0.18em] uppercase">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <XMark className="size-3 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    {withXGlyph(link.label, true)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden 2xl:block">
            <Link
              href="/beta"
              className="bg-primary px-4 py-2 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Join beta
            </Link>
          </div>

          {/* Mobile: prompt + trigger fill the space that used to sit empty. */}
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
                    {withXGlyph(link.label, true)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-3 pb-4">
            <Link
              href="/beta"
              onClick={() => setOpen(false)}
              className="block bg-primary px-4 py-4 text-center font-mono text-base font-bold tracking-[0.14em] text-primary-foreground uppercase"
            >
              Join beta
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
