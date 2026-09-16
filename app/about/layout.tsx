import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About planet.X — Independent Software & Creative Tech',
  description:
    'Meet planet.X, the independent creative technology studio behind apps, developer tools, Chrome extensions, Visual.X, Xupply, and xFactor music.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About planet.X — Independent Software & Creative Tech',
    description: 'Independent apps, developer tools, creative software, experiments, and xFactor music from planet.X.',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About planet.X — Independent Software & Creative Tech',
    description: 'Independent apps, developer tools, creative software, experiments, and xFactor music from planet.X.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
