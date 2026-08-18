import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { XMark } from '@/components/x-mark'
import { XGlyph, XLetter } from '@/components/x-glyph'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          {/* Scattered X decoration */}
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
      </main>
      <SiteFooter />
    </div>
  )
}
