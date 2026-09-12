import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const siteUrl = 'https://www.planet-x.co'

export const metadata: Metadata = {
  title: 'Build Notes — planet.X Development Log',
  description:
    'Short development notes from planet.X covering shipped website updates, Visual.X, Chrome extensions, analytics, storefront work, and software releases.',
  alternates: { canonical: '/build-notes' },
  openGraph: {
    title: 'Build Notes — planet.X Development Log',
    description: 'Follow real planet.X shipping notes, fixes, experiments, and product milestones.',
    url: '/build-notes',
    type: 'website',
  },
}

const notes = [
  {
    date: 'September 12, 2026',
    title: 'Visual.X + Xupply storefront polish',
    body:
      'Replaced the Visual.X homepage promo artwork, clarified Chrome-extension positioning for SessionGrid X and conteXt, removed incorrect X overlays from Xupply galleries, and normalized six storefront covers to the Xupply visual system.',
    tags: ['Visual.X', 'Xupply', 'Chrome extensions'],
    href: '/store',
    cta: 'View the store',
  },
  {
    date: 'September 12, 2026',
    title: 'Storefront checkout repair',
    body:
      'Reworked storefront status handling so active paid products no longer inherit a false Coming Soon state from stale checkout data. Chrome extensions now route to the Chrome Web Store, while paid checkout fails closed until a verified product destination is configured.',
    tags: ['Storefront', 'Checkout', 'Licensing'],
    href: '/store',
    cta: 'Open Xupply',
  },
  {
    date: 'September 11, 2026',
    title: 'Analytics pipeline repair',
    body:
      'Normalized website and Visual.X events into the shared analytics envelope, added product and conversion tracking, preserved internal-test filtering, and verified production event delivery without simulated success states.',
    tags: ['Analytics', 'Visual.X', 'Growth'],
    href: '/visual-x',
    cta: 'Try Visual.X',
  },
  {
    date: 'September 9, 2026',
    title: 'Visual.X moved fully onto planet.X',
    body:
      'Migrated the public Visual.X experience off its old hosted runtime and into the planet.X site, then restored the current feature line, featured xFactor tracks, SongDNA caching, recording, sharing, and mobile-first controls.',
    tags: ['Visual.X', 'WebGL', 'Audio DSP'],
    href: '/visual-x',
    cta: 'Enter Visual.X',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'planet.X Build Notes',
  url: `${siteUrl}/build-notes`,
  description:
    'Development notes covering planet.X software, apps, Chrome extensions, creative tools, analytics, and shipping milestones.',
  publisher: {
    '@type': 'Organization',
    name: 'planet.X',
    url: siteUrl,
  },
}

export default function BuildNotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-black">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-35" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Development log</p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.05em] text-white md:text-7xl">Build Notes</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">
              Short, real notes from what planet.X is shipping, fixing, rebuilding, and learning along the way.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
          <div className="space-y-8">
            {notes.map((note) => (
              <article key={`${note.date}-${note.title}`} className="border border-border bg-card/40 p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent">{note.date}</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">{note.title}</h2>
                    <p className="mt-4 leading-7 text-foreground/72">{note.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <span key={tag} className="border border-border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={note.href}
                    className="inline-flex shrink-0 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary hover:text-accent"
                  >
                    {note.cta}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  )
}
