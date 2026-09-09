import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Visual.X — 360 Music Engine',
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
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main>
        <section aria-label="Visual.X interactive demo" className="relative bg-black">
          <iframe
            src={demoUrl}
            title="Visual.X interactive music visualizer demo"
            className="block h-[calc(100svh-5.5rem)] min-h-[620px] w-full border-0 bg-black md:h-[calc(100svh-7.5rem)]"
            allow="autoplay; fullscreen; clipboard-write"
            allowFullScreen
          />
        </section>
      </main>
    </div>
  )
}
