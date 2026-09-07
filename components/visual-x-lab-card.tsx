import Link from 'next/link'
import { ArrowUpRight, Maximize2, Music2, Sparkles } from 'lucide-react'
import { XMark } from '@/components/x-mark'
import { XLetter } from '@/components/x-glyph'

export function VisualXLabCard() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-black">
      <div aria-hidden="true" className="absolute inset-0 x-grid opacity-35" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(255,46,159,.16),transparent_32%),radial-gradient(circle_at_80%_55%,rgba(0,245,255,.13),transparent_30%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.75fr)] lg:items-center">
          <div>
            <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.24em] text-accent uppercase">
              <XMark className="size-4" />
              planet.X Labs
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-tight uppercase md:text-6xl">
              Visual<span className="text-primary">.</span><XLetter />
            </h2>
            <p className="mt-4 max-w-2xl text-2xl font-bold leading-tight text-balance md:text-3xl">
              Your song. A world that only exists once.
            </p>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              A procedural 360-degree music-world engine that builds a different visual run from the track, then directs the camera and scenes through it as the music changes.
            </p>
            <Link
              href="/visual-x"
              className="group mt-7 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              See the engine preview
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-center gap-4 bg-background p-5">
              <Music2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Upload or search for music</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-5">
              <Sparkles className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium">A different procedural run every time</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-5">
              <Maximize2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Fullscreen immersive world view</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
