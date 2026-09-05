import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the planet.X Beta',
  description:
    'Apply to beta test planet.X projects including StudyHive, xMemoirs, Voice Studio X, and bdXm, and help shape what ships next.',
  alternates: { canonical: '/beta' },
  openGraph: {
    title: 'Join the planet.X Beta',
    description: 'Test upcoming planet.X apps and help shape what ships next.',
    url: '/beta',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the planet.X Beta',
    description: 'Test upcoming planet.X apps and help shape what ships next.',
  },
}

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return children
}
