import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StudyHive — Learn Together. Grow Together.',
  description:
    'StudyHive is a student-focused study community from planet.X with peer help, shared resources, planning tools, and AI-guided learning support.',
  alternates: { canonical: '/studyhive' },
  openGraph: {
    title: 'StudyHive — Learn Together. Grow Together.',
    description: 'A student-focused study community with peer help, resources, planning, and AI-guided support.',
    url: '/studyhive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyHive — Learn Together. Grow Together.',
    description: 'A student-focused study community with peer help, resources, planning, and AI-guided support.',
  },
}

export default function StudyHiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
