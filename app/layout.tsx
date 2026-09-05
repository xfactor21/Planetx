import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, Poppins } from 'next/font/google'
import { MonsterXAnnouncement } from '@/components/monsterx-announcement'
import './globals.css'

const _spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const _jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })
const _poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'] })

const siteUrl = 'https://www.planet-x.co'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'planet.X — Apps, Software, Music & Beta Projects',
    template: '%s | planet.X',
  },
  description:
    'planet.X builds independent software, mobile apps, creator tools, experiments, and loud music. Explore shipped products, beta projects, Xupply assets, and what is coming next.',
  keywords: [
    'planet.X',
    'Planet-X Development',
    'indie software',
    'mobile apps',
    'developer tools',
    'creator tools',
    'beta apps',
    'Xupply',
    'xFactor music',
    'loud music',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'planet.X — Apps, Software, Music & Beta Projects',
    description:
      'Independent software, apps, creator tools, experiments, and loud music from planet.X.',
    url: siteUrl,
    siteName: 'planet.X',
    type: 'website',
    images: [
      {
        url: '/brand/planet-x-wordmark-transparent.png',
        alt: 'planet.X',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'planet.X — Apps, Software, Music & Beta Projects',
    description:
      'Independent software, apps, creator tools, experiments, and loud music from planet.X.',
    images: ['/brand/planet-x-wordmark-transparent.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'planet.X',
  url: siteUrl,
  email: 'xFactor@planet-x.co',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'planet.X',
  url: siteUrl,
  description:
    'Independent software, mobile apps, creator tools, experiments, and music from planet.X.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <MonsterXAnnouncement />
        {children}
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
