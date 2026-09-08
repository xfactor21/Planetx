import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Visual.X — 360 Music Engine | planet.X',
  description:
    'Turn a song into a deterministic, audio-reactive 360° visual world. Try the current Visual.X web demo free on planet.X.',
  alternates: { canonical: '/visual-x' },
  openGraph: {
    title: 'Visual.X — 360 Music Engine',
    description:
      'Choose a song. Visual.X analyzes its structure, rhythm, texture, and dynamics, then builds a reactive world around it.',
    url: '/visual-x',
    type: 'website',
  },
}

const demoUrl = 'https://visual-x-g9w4nz.v2.appdeploy.ai/'

export default function VisualXPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-8">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-cyan-300 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              planet.X
            </Link>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fuchsia-300">
              Free web experience
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Visual<span className="bg-gradient-to-r from-pink-500 via-violet-400 to-cyan-300 bg-clip-text text-transparent">.X</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              A deterministic 360° music engine. Choose a song and Visual.X builds a reactive world from its rhythm, structure, texture, and dynamics.
            </p>
          </div>
          <a
            href={demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 border border-cyan-300/50 px-4 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            Open standalone
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section aria-label="Visual.X interactive demo" className="relative bg-black">
        <div className="mx-auto w-full max-w-[1800px] p-0 md:p-3">
          <div className="relative h-[calc(100svh-210px)] min-h-[560px] overflow-hidden border-y border-white/10 bg-black md:h-[calc(100svh-190px)] md:rounded-xl md:border">
            <iframe
              src={demoUrl}
              title="Visual.X interactive music visualizer demo"
              className="h-full w-full border-0 bg-black"
              allow="autoplay; fullscreen; clipboard-write"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black px-4 py-8 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cyan-300">What this is</p>
            <p className="mt-3 max-w-3xl leading-relaxed text-white/70">
              This is the current public Visual.X experience, not a cut-down mockup. The engine is still being expanded with more regions, effects, choreography, and world behaviors while this stable demo remains available free on the site.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fuchsia-300">Current flow</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Choose or upload a song → generate a world → experience it → record → export → share.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
