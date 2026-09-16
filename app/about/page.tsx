import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { XMark } from '@/components/x-mark'
import { XGlyph, XLetter } from '@/components/x-glyph'

const siteUrl = 'https://www.planet-x.co'

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About planet.X',
  url: `${siteUrl}/about`,
  description:
    'About planet.X, the independent creative technology studio behind apps, developer tools, Chrome extensions, Visual.X, Xupply, StudyHive, and xFactor music.',
  about: {
    '@type': 'Organization',
    name: 'planet.X',
    url: siteUrl,
    logo: `${siteUrl}/brand/planet-x-wordmark-transparent.png`,
  },
}

const exploreLinks = [
  {
    href: '/store',
    label: 'Store + Xupply',
    description: 'Apps, Chrome extensions, developer tools, creator resources, UI sounds, and digital assets.',
  },
  {
    href: '/music',
    label: 'xFactor Music',
    description: 'Original xFactor releases, the eXperiments album, music videos, covers, and streaming links.',
  },
  {
    href: '/visual-x',
    label: 'Visual.X',
    description: 'A 360° audio-reactive music engine that turns songs into interactive visual worlds.',
  },
  {
    href: '/studyhive',
    label: 'StudyHive',
    description: 'A student-focused study community built around peer support, planning, resources, and learning tools.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-20"
          >
            <Image
              src="/brand/x-mark-grunge.png"
              alt=""
              width={800}
              height={800}
              className="absolute -left-16 top-10 size-40 rotate-[-12deg] object-contain sm:size-56"
            />
            <Image
              src="/brand/x-glyph.png"
              alt=""
              width={800}
              height={800}
              className="absolute -right-10 top-1/3 size-32 rotate-[8deg] object-contain sm:size-48"
            />
            <Image
              src="/brand/x-mark-grunge.png"
              alt=""
              width={800}
              height={800}
              className="absolute bottom-0 left-1/4 size-44 rotate-[15deg] object-contain sm:size-64"
            />
          </div>

          <div className="relative mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-accent uppercase">
              <XMark className="size-4" />
              The bigger picture
            </div>
            <h1 className="mt-4 text-4xl leading-none font-bold tracking-tight text-balance uppercase sm:text-5xl md:text-7xl">
              About planet<XGlyph className="!h-[0.85em] !w-[0.85em]" />
            </h1>

            <div className="mt-10 flex flex-col gap-6 text-lg leading-relaxed text-[#fff6fd] md:text-xl">
              <p>
                <span className="font-bold text-primary">
                  planet.<XLetter className="!text-[1em]" /> is an
                  independent creative technology company
                </span>{' '}
                built around a simple belief: the future should be
                something we participate in, not something we simply wait
                for. We build software, creative tools, games, AI
                experiences, and entirely new ideas that sit somewhere
                between technology and imagination. Some projects are
                designed to solve real problems. Others start because we
                asked a dangerous question like, &quot;What if we actually
                tried that?&quot; Either way, the goal is the same: create
                technology that makes people&apos;s lives more capable, more
                creative, more connected, and a little more exciting.
              </p>

              <p>
                At the heart of planet.
                <XLetter className="!text-[1em]" /> is a belief that
                powerful technology shouldn&apos;t have to be cold,
                complicated, or built exclusively for people who already
                know how everything works. We&apos;re interested in making
                sophisticated things feel approachable, giving creators
                better tools, helping people preserve the things that
                matter to them, and building experiences that can
                genuinely improve people&apos;s lives.{' '}
                <span className="font-bold text-accent">
                  That&apos;s why StudyHive matters so much to us.
                </span>{' '}
                It represents the kind of technology we want planet.
                <XLetter className="!text-[1em]" /> to create: something
                built around people first, with the potential to make a
                genuinely positive difference. From there, we&apos;re
                exploring everything from development and game creation to
                AI, memory, creativity, and entirely new ways of
                interacting with technology.
              </p>

              <p>
                That same universe includes planet.X apps and developer tools, the Xupply line of digital creator resources, Visual.X audio-reactive experiences, and xFactor music. They are different products and creative outlets, but they share the same goal: make ambitious technology and creative work feel useful, understandable, and worth exploring.
              </p>

              <p>
                We&apos;re not interested in building a giant pile of apps
                just so we can say we built a giant pile of apps.{' '}
                <span className="font-bold text-primary">
                  We&apos;re building a universe of ideas that share the
                  same DNA:
                </span>{' '}
                curiosity, creativity, accessibility, experimentation, and
                the belief that technology can be better. Sometimes that
                means solving a problem nobody else has bothered to solve.
                Sometimes it means simplifying something that has become
                unnecessarily complicated. Sometimes it means attempting
                something everyone says is impossible and seeing what
                happens anyway.
              </p>

              <p className="font-bold uppercase tracking-tight text-foreground">
                planet.<XLetter className="!text-[1em]" /> is where those
                experiments become real.
                <br />
                We&apos;re not waiting for the future to arrive. We&apos;re
                building pieces of it.
              </p>

              <p className="text-2xl text-primary">
                The future is still under construction. 🚧🌌
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/30">
          <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
            <p className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-accent uppercase">Explore planet.X</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Follow the ideas into the actual work.</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {exploreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border bg-background/65 p-5 transition-colors hover:border-primary/45"
                >
                  <span className="font-mono text-xs font-bold tracking-[0.12em] text-primary uppercase">{item.label} →</span>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground transition-colors group-hover:text-foreground/80">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3 font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase">
              <Link href="/coming-soon" className="rounded-lg border border-border px-4 py-3 text-muted-foreground hover:border-accent/45 hover:text-foreground">See what&apos;s coming next</Link>
              <Link href="/beta" className="rounded-lg border border-border px-4 py-3 text-muted-foreground hover:border-accent/45 hover:text-foreground">Join a beta</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
