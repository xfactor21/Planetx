import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon — New Apps & Software',
  description:
    'See the apps, developer tools, creative software, and experimental planet.X projects currently in development and heading toward beta or release.',
  alternates: { canonical: '/coming-soon' },
  openGraph: {
    title: 'Coming Soon — New Apps & Software | planet.X',
    description: 'See the apps, developer tools, creative software, and experimental planet.X projects currently in development.',
    url: '/coming-soon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coming Soon — New Apps & Software | planet.X',
    description: 'See the apps, developer tools, creative software, and experimental planet.X projects currently in development.',
  },
}

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children
}
