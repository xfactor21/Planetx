import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Maximize2, Music2, RefreshCw, Share2, Sparkles, Video } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { XMark } from '@/components/x-mark'
import { XLetter } from '@/components/x-glyph'

const siteUrl = 'https://www.planet-x.co'
const pageUrl = `${siteUrl}/visual-x`

export const metadata: Metadata = {
  title: 'Visual.X — Procedural Music Worlds',
  description:
    'Visual.X is an experimental procedural music-world engine from planet.X. Load a song and watch a unique 360-degree world evolve around its structure, energy, and movement.',
  alternates: { canonical: '/visual-x' },
  openGraph: {
    title: 'Visual.X — Every Play Creates a Different World',
    description:
      'An experimental procedural music-world engine from planet.X. Your song becomes a world that is generated differently every time.',
    url: pageUrl,
    siteName: 'planet.X',
    type: 'website',
    images: [{ url: '/brand/planet-x-wordmark-transparent.png', alt: 'Visual.X by planet.X' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visual.X — Every Play Creates a Different World',
    description:
      'An experimental procedural music-world engine from planet.X. Your song becomes a world that is generated differently every time.',
    images: ['/brand/planet-x-wordmark-transparent.png'],
  },
}

const visualXSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Visual.X',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  url: pageUrl,
  description:
    'An experimental procedural music-world engine that interprets music into evolving 360-degree visual environments.',
  creator: {
    '@type': 'Organization',
    name: 'planet.X',
    url: siteUrl,
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/PreOrder',
  },
}

const features = [
  {
    icon: Music2,
    title: 'Bring your own music',
    body: 'The engine is being built around both uploaded tracks and music search, so the experience begins with the song you actually want to see.',
  },
  {
    icon: Sparkles,
    title: 'A different world every time',
    body: 'Visual.X does not play back a canned animation. It procedurally builds and directs a new visual run from the song, so repeat plays can unfold differently.',
  },
  {
    icon: Maximize2,
    title: 'Built for immersion',
    body: 'The world can take over the screen while the camera and scene director move through changing regions and musical moments.',
  },
  {
    icon: RefreshCw,
    title: 'Remix the experience',
    body: 'The same track can be interpreted again instead of locking the song to one permanent visual result.',
  },
]

const upcoming = [
  { icon: Video, label: 'Record what you saw' },
  { icon: Share2, label: 'Export and share generated clips' },
  { icon: XMark, label: 'Lightweight planet.X attribution on shared exports' },
]

export default function VisualXPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(visualXSchema) }}
        />

        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-45" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_25%_30%,rgba(255,46,159,.18),transparent_38%),radial-gradient(circle_at_78%_22%,rgba(0,245,255,.14),transparent_34%),radial-gradient(circle_at_55%_70%,rgba(143,67,255,.16),transparent_38%)]"
          />

          <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-28">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to planet.X
            </Link>

            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.72fr)] lg:items-end">
              <div>
                <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.25em] text-accent uppercase">
                  <XMark className="size-4" />
                  planet.X Labs / engine preview
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.9] tracking-tight uppercase sm:text-6xl md:text-8xl">
                  Visual<span className="text-primary">.</span><XLetter />
                </h1>

                <p className="mt-6 max-w-3xl text-2xl font-bold leading-tight text-balance md:text-4xl">
                  Your song. A world that only exists once.
                </p>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Visual.X is an experimental procedural music-world engine. It analyzes a track, builds a 360-degree environment around it, and uses an internal scene and camera director to move through that world as the music changes.
                </p>
              </div>

              <div className="border border-primary/40 bg-black/55 p-5 backdrop-blur-sm md:p-7">
                <p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">Current status</p>
                <p className="mt-3 text-xl font-bold uppercase">Still in the lab</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The engine is real and actively being refined. The public-facing UI, recording/export workflow, and final Visual.X presentation are still being finished before it opens up here.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/45">
          <div className="mx-auto grid w-full max-w-7xl gap-px border-x border-border bg-border md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, body }) => (
              <article key={title} className="bg-background p-6 md:p-8">
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-bold tracking-tight uppercase">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[0.7rem] tracking-[0.22em] text-primary uppercase">What makes it different</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight uppercase md:text-5xl">
                The engine is the product.
              </h2>
              <div className="mt-6 max-w-xl space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Visual.X is being built around musical structure rather than a library of pre-authored videos. Song variables feed a procedural world system, while scene and camera direction determine how the experience unfolds through time.
                </p>
                <p>
                  The goal is not to hand the viewer a complicated editor. The finished public experience should make the engine feel effortless while still letting curious users see the musical variables and analysis driving what is happening around them.
                </p>
              </div>
            </div>

            <div className="border border-border bg-card p-6 md:p-8">
              <p className="font-mono text-[0.7rem] tracking-[0.22em] text-accent uppercase">Next on the build</p>
              <ul className="mt-6 space-y-4">
                {upcoming.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-primary/40 bg-primary/5">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
                Shared clips are planned to remain the user&apos;s creation first, with subtle Visual.X / planet-X.co attribution rather than an intrusive ad covering the artwork.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
