import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Layers3 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { StoreProductCard } from '@/components/store-product-card'
import { CATEGORY_CONTENT, getProductById, productPath, productsForCategory, type StoreCategorySlug } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'
const validCategories = Object.keys(CATEGORY_CONTENT) as StoreCategorySlug[]
const titles: Record<StoreCategorySlug, string> = { software: 'planet.X Software, Apps & Browser Tools', 'audio-fx': 'UI Sounds, Stingers & Digital FX for Apps and Creators | Xupply', 'creator-resources': 'Creator Resources for Indie Developers & Technical Creators | Xupply' }
export function generateStaticParams() { return validCategories.map((category) => ({ category })) }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  if (!validCategories.includes(category as StoreCategorySlug)) return {}
  const slug = category as StoreCategorySlug
  const content = CATEGORY_CONTENT[slug]
  const canonical = `${siteUrl}/store/${slug}`
  const title = titles[slug]
  return { title: { absolute: title }, description: content.description, alternates: { canonical }, openGraph: { title, description: content.description, url: canonical, siteName: 'planet.X', type: 'website', images: ['/opengraph-image'] }, twitter: { card: 'summary_large_image', title, description: content.description, images: ['/opengraph-image'] } }
}

export default async function StoreCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  if (!validCategories.includes(category as StoreCategorySlug)) notFound()
  const slug = category as StoreCategorySlug
  const content = CATEGORY_CONTENT[slug]
  const products = productsForCategory(slug)
  const starter = getProductById(content.starterId)
  const canonical = `${siteUrl}/store/${slug}`
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'planet.X', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Store', item: `${siteUrl}/store` }, { '@type': 'ListItem', position: 3, name: content.category, item: canonical }] }
  return <div className="min-h-screen bg-[#030305] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><StorePageTracker event="category_view" properties={{ category: content.category, category_slug: slug }} /><SiteHeader />
    <main>
      <section className="border-b border-white/10 bg-white/[.018]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"><nav className="font-mono text-[10px] tracking-[.14em] text-white/40 uppercase" aria-label="Breadcrumb"><Link href="/store" className="hover:text-white">Store</Link> / {content.category}</nav><p className="mt-8 font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">{content.eyebrow}</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-[-.045em] sm:text-5xl">{content.title}</h1><div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-white/60 sm:text-base"><p>{content.description}</p><p>Every item below links to its own crawlable page with real product media, exact included files or features, compatibility, current delivery state, and the correct purchase or install action. Software stays under the planet.X identity; downloadable production assets stay under Xupply by planet.X.</p></div></div></section>
      {starter ? <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[.04] p-5 sm:p-6"><div><p className="font-mono text-[9px] font-bold tracking-[.15em] text-cyan-300 uppercase">Best place to start</p><h2 className="mt-2 text-xl font-bold">{starter.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{starter.description}</p></div><Link href={productPath(starter)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2 font-mono text-[10px] font-bold tracking-[.12em] uppercase hover:border-cyan-300/40">View {starter.name} <ArrowRight className="size-4" aria-hidden="true" /></Link></div></section> : null}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="font-mono text-[10px] font-bold tracking-[.16em] text-primary uppercase">Full category</p><h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">{products.length} current {products.length === 1 ? 'product' : 'products'}</h2><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <StoreProductCard key={product.id} product={product} />)}</div></section>
      <section className="border-y border-white/10 bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-2"><Link href="/store/bundles" className="group rounded-2xl border border-white/10 bg-black/30 p-6 hover:border-primary/35"><Layers3 className="size-5 text-primary" aria-hidden="true" /><p className="mt-5 font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">Bundle architecture</p><h2 className="mt-2 text-xl font-bold">See the proposed product stacks</h2><p className="mt-3 text-sm leading-6 text-white/50">Bundle combinations are mapped now; bundle pricing remains owner-approval only.</p></Link><Link href={content.guideHref} className="group rounded-2xl border border-white/10 bg-black/30 p-6 hover:border-cyan-300/35"><ArrowRight className="size-5 text-cyan-300" aria-hidden="true" /><p className="mt-5 font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">Related resource</p><h2 className="mt-2 text-xl font-bold">{content.guideLabel}</h2><p className="mt-3 text-sm leading-6 text-white/50">Useful context before you choose a product or prepare a release.</p></Link></div></section>
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><h2 className="text-2xl font-bold tracking-[-.03em]">Category FAQ</h2><div className="mt-6 divide-y divide-white/10 border-y border-white/10"><details className="py-5"><summary className="cursor-pointer font-semibold">How are planet.X software and Xupply products separated?</summary><p className="mt-3 text-sm leading-6 text-white/55">Apps, Chrome extensions, and utilities are planet.X software. Xupply is reserved for downloadable production assets such as audio packs, templates, UI kits, overlays, and creator resources.</p></details><details className="py-5"><summary className="cursor-pointer font-semibold">Do listings show the actual files or features?</summary><p className="mt-3 text-sm leading-6 text-white/55">Yes. Product pages use the current catalog data and real gallery assets to show exact counts, formats, included items, platform requirements, and release state where those facts are available.</p></details></div></section>
    </main><SiteFooter />
  </div>
}
