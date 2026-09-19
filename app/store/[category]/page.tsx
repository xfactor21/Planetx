import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { StoreVaultMatrix } from '@/components/store-vault-matrix'
import { CATEGORY_CONTENT, type StoreCategorySlug } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'
const validCategories = Object.keys(CATEGORY_CONTENT) as StoreCategorySlug[]
const titles: Record<StoreCategorySlug, string> = {
  software: 'planet.X Software, Apps & Browser Tools',
  'audio-fx': 'UI Sounds, Stingers & Digital FX for Apps and Creators | Xupply',
  'creator-resources': 'Creator Resources for Indie Developers & Technical Creators | Xupply',
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  if (!validCategories.includes(category as StoreCategorySlug)) return {}
  const slug = category as StoreCategorySlug
  const content = CATEGORY_CONTENT[slug]
  const canonical = `${siteUrl}/store/${slug}`
  const title = titles[slug]
  return {
    title: { absolute: title },
    description: content.description,
    alternates: { canonical },
    openGraph: { title, description: content.description, url: canonical, siteName: 'planet.X', type: 'website', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title, description: content.description, images: ['/opengraph-image'] },
  }
}

export default async function StoreCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  if (!validCategories.includes(category as StoreCategorySlug)) notFound()
  const slug = category as StoreCategorySlug
  const content = CATEGORY_CONTENT[slug]
  const canonical = `${siteUrl}/store/${slug}`
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'planet.X', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Store', item: `${siteUrl}/store` },
      { '@type': 'ListItem', position: 3, name: content.category, item: canonical },
    ],
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <StorePageTracker event="category_view" properties={{ category: content.category, category_slug: slug }} />
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[#ff007f]/15 bg-[#050711]">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-30" />
          <div className="relative mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <nav className="font-mono text-[10px] tracking-[.14em] text-white/40 uppercase" aria-label="Breadcrumb">
              <Link href="/store" className="hover:text-white">Store</Link> / {content.category}
            </nav>
            <p className="mt-7 font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">{content.eyebrow}</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-[-.045em] sm:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">{content.description}</p>
          </div>
        </section>

        <StoreVaultMatrix initialView={content.category} />

        <section className="mx-auto max-w-[1380px] px-4 pb-12 sm:px-6 lg:px-8">
          <Link
            href={content.guideHref}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.025] px-5 py-4 font-mono text-[10px] font-bold tracking-[.1em] text-white/60 uppercase transition hover:border-cyan-300/35 hover:text-white"
          >
            {content.guideLabel}
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
