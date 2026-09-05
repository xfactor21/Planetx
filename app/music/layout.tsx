import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'xFactor Music — Loud Music from planet.X',
  description:
    'Listen to xFactor releases, videos, and loud music connected to the planet.X creative universe.',
  alternates: { canonical: '/music' },
  openGraph: {
    title: 'xFactor Music — Loud Music from planet.X',
    description: 'Listen to xFactor releases, videos, and loud music from planet.X.',
    url: '/music',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xFactor Music — Loud Music from planet.X',
    description: 'Listen to xFactor releases, videos, and loud music from planet.X.',
  },
}

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children
}
