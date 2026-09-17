import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { StoreVaultMatrix } from '@/components/store-vault-matrix'

const siteUrl = 'https://www.planet-x.co'
const title = 'planet.X Store — Dynamic Vault'
const description = 'Browse planet.X software and Xupply creator assets in the interactive Vault Matrix, with real previews, dedicated product pages, official install links, and embedded checkout.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/store' },
  openGraph: {
    title,
    description,
    url: '/store',
    siteName: 'planet.X',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'planet.X', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Store', item: `${siteUrl}/store` },
  ],
}

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: title,
  description,
  url: `${siteUrl}/store`,
  isPartOf: { '@type': 'WebSite', name: 'planet.X', url: siteUrl },
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <StorePageTracker event="store_view" properties={{ surface: 'vault_matrix', catalog: 'planetx_xupply' }} />
      <SiteHeader />
      <main id="catalog">
        <StoreVaultMatrix />
      </main>
      <SiteFooter />
    </div>
  )
}
