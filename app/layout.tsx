import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Space_Grotesk, JetBrains_Mono, Poppins } from 'next/font/google'
import { MonsterXAnnouncement } from '@/components/monsterx-announcement'
import { XFactorSitePet } from '@/components/xfactor-site-pet'
import { SiteAnalytics } from '@/components/site-analytics'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })
const poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-poppins' })

const siteUrl = 'https://www.planet-x.co'
const siteTitle = 'planet.X — Independent Apps, Developer Tools & Creative Software Studio'
const siteDescription =
  'planet.X is an independent software studio building mobile apps, Chrome extensions, developer tools, creative software, experimental web experiences, and loud music.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'planet.X',
  category: 'technology',
  creator: 'planet.X',
  publisher: 'planet.X',
  title: {
    default: siteTitle,
    template: '%s | planet.X',
  },
  description: siteDescription,
  keywords: [
    'planet.X',
    'independent software studio',
    'mobile app development',
    'Chrome extensions',
    'developer tools',
    'creative software',
    'indie software',
    'creator tools',
    'audio reactive visuals',
    'Xupply',
    'xFactor music',
    'loud music',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'planet.X',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'planet.X — independent apps, developer tools and creative software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image'],
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
  logo: `${siteUrl}/brand/planet-x-wordmark-transparent.png`,
  email: 'xFactor@planet-x.co',
  description: siteDescription,
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'planet.X',
  url: siteUrl,
  inLanguage: 'en-US',
  publisher: {
    '@type': 'Organization',
    name: 'planet.X',
    url: siteUrl,
  },
  description: siteDescription,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${spaceGrotesk.variable} ${jetBrainsMono.variable} ${poppins.variable}`}>
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
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        {children}
        <XFactorSitePet />
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
