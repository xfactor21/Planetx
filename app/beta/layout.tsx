import type { Metadata } from 'next'

const title = 'Join the planet.X Beta — Test New Apps & Software'
const description =
  'Apply to beta test planet.X apps and software including StudyHive, xMemoirs, Voice Studio X, and bdXm, and help shape what ships next.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/beta' },
  openGraph: {
    title,
    description: 'Test upcoming planet.X apps and software and help shape what ships next.',
    url: '/beta',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: 'Test upcoming planet.X apps and software and help shape what ships next.',
  },
}

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return children
}
