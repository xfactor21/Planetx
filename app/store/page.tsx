import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StoreCatalog } from '@/components/store-catalog'

const siteUrl = 'https://www.planet-x.co'

export const metadata: Metadata = {
  title: 'Xupply Store — Software, Audio, FX & Creator Assets',
  description:
    'Shop original planet.X software, Chrome extensions, audio packs, transition effects, creator resources, and development tools from the Xupply catalog.',
  alternates: {
    canonical: '/store',
  },
  openGraph: {
    title: 'Xupply Store — Software, Audio, FX & Creator Assets',
    description:
      'Original software, Chrome extensions, audio packs, effects, and creator resources from planet.X.',
    url: '/store',
    images: ['/store/project-x.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xupply Store — Software, Audio, FX & Creator Assets',
    description:
      'Original software, Chrome extensions, audio packs, effects, and creator resources from planet.X.',
    images: ['/store/project-x.png'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'planet.X',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Store',
      item: `${siteUrl}/store`,
    },
  ],
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#030305] text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main id="catalog">
        <StoreCatalog />
      </main>
      <SiteFooter />
    </div>
  )
}
