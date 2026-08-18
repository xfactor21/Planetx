import { ArrowDownRight, Play } from 'lucide-react'
import Image from 'next/image'
import { XField, XMark } from '@/components/x-mark'
import { XLetter } from '@/components/x-glyph'
import { MusicPlayerEmbed } from '@/components/music-player-embed'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 x-grid opacity-60" aria-hidden="true" />
      <XField />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 hidden size-[26rem] opacity-30 md:block"
      >
        <Image
          src="/brand/x-mark-grunge.png"
          alt=""
          width={1600}
          height={1600}
          className="size-full object-contain"
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-32">
        <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] text-accent uppercase">
          <XMark className="size-4" />
          <span>
            <span className="inline-block whitespace-nowrap">
              <XLetter />Factor&apos;s
            </span>{' '}
            <span className="inline-block whitespace-nowrap">
              <XLetter />World/
            </span>{' '}
            est. 2019
          </span>
        </div>

        <h1 className="mt-6 text-4xl leading-[0.95] font-bold tracking-tight text-balance uppercase sm:mt-8 sm:text-5xl md:text-7xl lg:text-8xl">
          I build apps
          <br />
          I make Music
          <br />
          <span className="text-primary">F**K permission.</span>
        </h1>

        <p className="mt-6 max-w-xl leading-relaxed text-[#fff6fd] sm:mt-10">
          <span className="inline-block whitespace-nowrap">
            planet-<XLetter />
          </span>{' '}
          Development and{' '}
          <span className="inline-block whitespace-nowrap">
            <XLetter />Factor
          </span>{' '}
          present TOOLS and TUNES for you!
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row">
          <a
            href="#new-releases"
            className="group inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            See the apps
            <ArrowDownRight
              className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="#xfactor-music"
            className="group inline-flex items-center justify-center gap-2 border border-accent px-6 py-4 font-mono text-xs font-bold tracking-[0.18em] text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Play className="size-5" aria-hidden="true" />
            Stream the music
          </a>
        </div>

        <div className="mt-8 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-12">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.28em] text-muted-foreground uppercase">
              <XMark className="size-4 text-accent" />
              Now streaming
            </div>
            <MusicPlayerEmbed />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.28em] text-muted-foreground uppercase">
              <XMark className="size-4 text-primary" />
              About <XLetter />Factor
            </div>
            <p className="max-w-2xl leading-relaxed text-[#fff6fd]">
              <span className="text-lg font-bold text-primary">
                xFactor started with music.
              </span>{' '}
              For a long time, it was a persona, a name attached to songs,
              sounds, ideas, and an ongoing attempt to put something new
              into the world. Eventually the persona became an identity,
              and somewhere along the way the line between the music, the
              technology, and the person making both started disappearing
              completely. These days, xFactor might be writing a song five
              feet away from where he&apos;s writing code, and honestly,
              there isn&apos;t much difference between the two.{' '}
              <span className="text-lg font-bold text-accent">
                Music is waves. Technology is waves.
              </span>{' '}
              Both are about taking something that doesn&apos;t exist yet
              and shaping it until it does. That&apos;s probably why the
              same obsession keeps showing up everywhere: make something
              new, make it yours, and put it into the world. xFactor just
              happens to have an entirely unreasonable number of things to
              build. 🎧⚡
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
