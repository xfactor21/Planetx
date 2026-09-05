import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About planet.X',
  description:
    'Learn about planet.X, an independent software and creative studio building apps, developer tools, experiments, and music.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About planet.X',
    description: 'Independent software, apps, experiments, and music from planet.X.',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About planet.X',
    description: 'Independent software, apps, experiments, and music from planet.X.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
