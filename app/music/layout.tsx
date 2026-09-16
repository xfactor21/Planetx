import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'xFactor Music — Songs, Videos & eXperiments Album',
  description:
    'Listen to xFactor music, stream the eXperiments album, watch music videos, hear cover tracks, and explore the music side of planet.X.',
  keywords: [
    'xFactor music',
    'xFactor songs',
    'xFactor eXperiments',
    'eXperiments album',
    'planet.X music',
    'loud music',
  ],
  alternates: { canonical: '/music' },
  openGraph: {
    title: 'xFactor Music — Songs, Videos & eXperiments Album',
    description: 'Stream xFactor music, the eXperiments album, cover tracks, and music videos from planet.X.',
    url: '/music',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xFactor Music — Songs, Videos & eXperiments Album',
    description: 'Stream xFactor music, the eXperiments album, cover tracks, and music videos from planet.X.',
  },
}

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children
}
