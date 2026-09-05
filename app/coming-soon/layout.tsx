import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon — planet.X Projects in Development',
  description:
    'Explore planet.X projects currently in development, including experimental apps, developer tools, connected software, and new creative systems.',
  alternates: { canonical: '/coming-soon' },
  openGraph: {
    title: 'Coming Soon — planet.X Projects in Development',
    description: 'See what planet.X is building next.',
    url: '/coming-soon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coming Soon — planet.X Projects in Development',
    description: 'See what planet.X is building next.',
  },
}

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children
}
