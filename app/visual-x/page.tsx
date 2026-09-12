import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'

const siteUrl = 'https://www.planet-x.co'
const visualXUrl = `${siteUrl}/visual-x`
const visualXDescription =
  'Turn a song into a deterministic, audio-reactive 360° visual world. Visual.X analyzes rhythm, structure, texture, and dynamics to generate a reactive music experience in your browser.'

export const metadata: Metadata = {
  title: 'Visual.X — 360° Music Engine & Audio-Reactive Visual Experience',
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
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </div>
  )
}
