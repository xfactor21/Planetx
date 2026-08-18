'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HexMark } from '@/components/hex-mark'
import { StudyHiveStory } from '@/components/studyhive-story'
import { StudyHiveBetaModal } from '@/components/studyhive-beta-modal'
import { studyHiveDetail } from '@/lib/data'

function JoinBetaButton({
  size = 'md',
}: {
  size?: 'md' | 'lg'
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          size === 'lg'
            ? 'group inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-8 py-5 font-mono text-base font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground md:text-lg'
            : 'group inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground'
        }
      >
        Join Beta
        <ArrowUpRight
          className={
            size === 'lg'
              ? 'size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
              : 'size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          }
          aria-hidden="true"
        />
      </button>
      {open ? <StudyHiveBetaModal onClose={() => setOpen(false)} /> : null}
    </>
  )
}

export default function StudyHivePage() {
  const app = studyHiveDetail

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
            <div className="flex items-center gap-6">
              <Image
                src={app.icon || '/placeholder.svg'}
                alt="StudyHive app icon"
                width={140}
                height={140}
                className="size-20 shrink-0 rounded-2xl border border-border object-cover md:size-28"
              />
              <div>
                <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-amber-400 uppercase">
                  <HexMark className="size-4" />
                  Shipped / live now
                </div>
                <h1 className="mt-2 text-3xl leading-none font-bold tracking-tight text-balance uppercase sm:text-4xl md:text-6xl">
                  {app.name}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {app.tagline}
                </p>
              </div>
            </div>

            <JoinBetaButton size="lg" />
          </div>
        </section>

        <StudyHiveStory />

        {/* Mid-page beta prompt */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-14 text-center md:px-8">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Liking what you see so far? You don&apos;t have to wait until
              the end.
            </p>
            <JoinBetaButton />
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-amber-400 uppercase">
              <HexMark className="size-4" />
              What&apos;s inside
            </div>
            <h2 className="mt-4 text-4xl leading-none font-bold tracking-tight text-balance uppercase md:text-6xl">
              Features
            </h2>

            <div className="mt-12 grid gap-px border border-amber-400/15 bg-amber-400/10 md:grid-cols-3">
              {app.features.map((feature) => (
                <div key={feature.title} className="bg-background p-6 md:p-8">
                  <HexMark className="size-7 text-amber-400" />
                  <h3 className="mt-5 text-xl font-bold tracking-tight uppercase">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beta CTA */}
        <section>
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-12 md:px-8 md:py-28">
            <h2 className="text-4xl leading-none font-bold tracking-tight text-balance uppercase md:text-6xl">
              Join the beta
            </h2>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              StudyHive is live and evolving fast. Jump in, try it with your
              friends, and tell us what to build next.
            </p>
            <JoinBetaButton />
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.16em] text-primary hover:underline"
            >
              ← Back to Planet-X
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
