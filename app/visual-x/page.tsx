import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'

const siteUrl = 'https://www.planet-x.co'
const visualXUrl = `${siteUrl}/visual-x`
const visualXTitle = 'Visual.X — 360° Audio-Reactive Music Engine | planet.X'
const visualXDescription =
  'Turn a song into a deterministic, audio-reactive 360° visual world. Visual.X maps rhythm, structure, texture, and dynamics into a browser-based music experience.'

export const metadata: Metadata = {
  title: { absolute: visualXTitle },
  description: visualXDescription,
  alternates: { canonical: '/visual-x' },
  keywords: [
    '360 music visualizer',
    'audio reactive visuals',
    'music visualization engine',
    'browser music visualizer',
    'procedural music visuals',
    'Visual.X',
  ],
  openGraph: {
    title: 'Visual.X — What Will Your Song Make?',
    description:
      'Choose a song. Visual.X analyzes its structure, rhythm, texture, and dynamics, then builds a reactive 360° world around it.',
    url: '/visual-x',
    type: 'website',
    images: [
      {
        url: '/brand/visual-x-home.jpg',
        width: 720,
        height: 720,
        alt: 'Visual.X 360° Music Engine — What will your song make?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visual.X — What Will Your Song Make?',
    description: 'Turn a song into a reactive 360° visual world directly in your browser.',
    images: ['/brand/visual-x-home.jpg'],
  },
}

const demoUrl = '/visual-x-app/index.html'

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Visual.X',
  alternateName: 'Visual.X 360° Music Engine',
  description: visualXDescription,
  url: visualXUrl,
  image: `${siteUrl}/brand/visual-x-home.jpg`,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web browser',
  browserRequirements: 'Requires a modern WebGL-capable browser and Web Audio support.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Organization',
    name: 'planet.X',
    url: siteUrl,
    logo: `${siteUrl}/brand/planet-x-wordmark-transparent.png`,
  },
}

export default function VisualXPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <style>{'[data-xfactor-pet-root]{display:none!important}'}</style>
      <SiteHeader />
      <main>
        <section aria-label="Visual.X interactive demo" className="relative bg-black">
          <iframe
            src={demoUrl}
            title="Visual.X interactive 360-degree music visualization demo"
            className="block h-[calc(100svh-5.5rem)] min-h-[620px] w-full border-0 bg-black md:h-[calc(100svh-7.5rem)]"
            allow="autoplay; fullscreen; clipboard-write"
            allowFullScreen
          />
        </section>
        <section className="border-t border-white/10 bg-[#030305]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
            <p className="font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">Your Song. A world that only exists once.</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] sm:text-4xl">Visual.X — 360° Audio-Reactive Music Engine</h1>
            <div className="mt-5 grid gap-5 text-sm leading-7 text-white/60 md:grid-cols-2 md:text-base">
              <p>Visual.X turns music into a reactive 360° world in the browser. Instead of applying one looping effect to every track, the engine analyzes rhythm, song structure, texture, energy, and dynamics so the visual environment can respond to the character of the song as it plays.</p>
              <p>Load a track, enter the generated world, and watch regions, camera movement, waveform behavior, and transitions react across the song. Visual.X is part of the planet.X creative-software lab and is built to connect music with interactive visual experiences rather than a traditional flat-screen visualizer.</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-[10px] font-bold tracking-[.12em] uppercase">
              <Link href="/music" className="rounded-lg border border-white/12 px-4 py-3 text-white/70 hover:border-primary/40 hover:text-white">Explore xFactor music</Link>
              <Link href="/store" className="rounded-lg border border-white/12 px-4 py-3 text-white/70 hover:border-cyan-300/40 hover:text-white">Explore planet.X store</Link>
            </div>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </div>
  )
}
