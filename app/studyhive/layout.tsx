import type { Metadata } from 'next'

const studyHiveUrl = 'https://www.planet-x.co/studyhive'

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

const studyHiveSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'StudyHive',
  url: studyHiveUrl,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  description:
    'A student-focused study community with peer help, shared resources, planning tools, and AI-guided learning support.',
  creator: {
    '@type': 'Organization',
    name: 'planet.X',
    url: 'https://www.planet-x.co',
  },
}

export default function StudyHiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studyHiveSchema) }}
      />
      {children}
    </>
  )
}
