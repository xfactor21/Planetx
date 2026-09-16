import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Boxes, Download, Headphones, Laptop, MoonStar, PackageOpen, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { StoreProductCard } from '@/components/store-product-card'
import { FEATURED_PRODUCT_IDS, START_HERE_PRODUCT_IDS, allStoreProducts, getProductById, productPath, productsForCategory } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'
const SHOW_AFTER_HOURS_ENTRY = true

export const metadata: Metadata = {
  title: { absolute: 'planet.X Store — Software, Xupply Assets & Creator Resources' },
  description: 'Browse planet.X software and Xupply digital production assets with dedicated product pages, real previews, clear file details, and on-site checkout.',
  alternates: { canonical: '/store' },
  openGraph: { title: 'planet.X Store — Software, Xupply Assets & Creator Resources', description: 'planet.X software plus Xupply audio, creator resources, interface kits, launch materials, and practical digital production assets.', url: '/store', siteName: 'planet.X', type: 'website', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'planet.X Store — Software, Xupply Assets & Creator Resources', description: 'planet.X software plus Xupply audio, creator resources, interface kits, launch materials, and practical digital production assets.', images: ['/opengraph-image'] },
}

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'planet.X', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Store', item: `${siteUrl}/store` }] }
const featured = FEATURED_PRODUCT_IDS.map((id) => getProductById(id)).filter(Boolean)
const startHere = START_HERE_PRODUCT_IDS.map((id) => getProductById(id)).filter(Boolean)
const categories = [
  { href: '/store/software', label: 'Software', brand: 'planet.X', count: productsForCategory('software').length, description: 'Chrome extensions, browser utilities, and larger software projects.', icon: Laptop },
  { href: '/store/creator-resources', label: 'Creator Resources', brand: 'Xupply', count: productsForCategory('creator-resources').length, description: 'Editable launch systems, UI kits, overlays, web effects, and production assets.', icon: Boxes },
  { href: '/store/audio-fx', label: 'Audio & FX', brand: 'Xupply', count: productsForCategory('audio-fx').length, description: 'Original UI sounds, impacts, transitions, glitches, and short-form production FX.', icon: Headphones },
  { href: '/store/free', label: 'Free Resources', brand: 'planet.X', count: 1, description: 'Useful standalone checklists and resources with no purchase required.', icon: Download },
  { href: '/store/bundles', label: 'Bundles', brand: 'planet.X + Xupply', count: 4, description: 'Logical product stacks prepared for bundle pricing review.', icon: PackageOpen },
]
const faq = [
  { q: 'What is planet.X versus Xupply?', a: 'planet.X is the software and app studio. Xupply is the digital-asset sub-brand for downloadable production assets such as audio, templates, UI kits, overlays, and creator resources.' },
  { q: 'Do paid Xupply products send me to another storefront?', a: 'No. The product page stays on planet.X and uses the embedded checkout flow. The fulfillment provider handles the transaction behind the checkout without replacing the planet.X product page.' },
  { q: 'Where do Chrome extensions install from?', a: 'Chrome extensions link directly to their official Chrome Web Store listings. Software pages clearly label that external install step before you click.' },
  { q: 'What support information is available before purchase?', a: 'Each product page lists the current format, compatibility, contents, license summary, delivery path, and support contact when those details are known. Unapproved claims and fake reviews are not used.' },
]

export default function StorePage() {
  return <div className="min-h-screen bg-[#030305] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <StorePageTracker event="store_view" properties={{ surface: 'storefront' }} /><SiteHeader />
    <main>
      <section className="relative overflow-hidden border-b border-white/10"><div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" /><div className="pointer-events-none absolute -left-24 -top-24 size-[460px] rounded-full bg-primary/15 blur-[110px]" aria-hidden="true" /><div className="pointer-events-none absolute -right-24 top-20 size-[520px] rounded-full bg-cyan-400/10 blur-[120px]" aria-hidden="true" /><div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:py-24"><div><p className="font-mono text-[11px] font-bold tracking-[.2em] text-cyan-300 uppercase">planet.X store</p><h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-.045em] text-white sm:text-5xl lg:text-6xl">Software from planet.X. Production assets from Xupply.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">Real tools, real files, real previews. Browse by category, open a dedicated product page, see exactly what is included, and use the correct install or checkout path without digging through one giant catalog wall.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/store/software" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 font-mono text-[11px] font-bold tracking-[.12em] uppercase transition hover:bg-accent">Browse software <ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/store/creator-resources" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/15 bg-white/[.03] px-5 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/80 uppercase transition hover:border-cyan-300/35 hover:text-white">Browse Xupply assets</Link></div></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{[['Dedicated pages', `${allStoreProducts.length} current products`], ['Checkout', 'Embedded for paid assets'], ['Install', 'Official Chrome Web Store links']].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur"><p className="font-mono text-[9px] tracking-[.15em] text-white/35 uppercase">{label}</p><p className="mt-2 text-sm font-semibold text-white/85">{value}</p></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] font-bold tracking-[.18em] text-primary uppercase">Shop by category</p><h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Find the right shelf first.</h2></div><Link href="/guides" className="font-mono text-[10px] font-bold tracking-[.12em] text-cyan-300 uppercase hover:text-white">Read the guides →</Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.map(({ href, label, brand, count, description, icon: Icon }) => <Link key={href} href={href} className="group rounded-2xl border border-white/10 bg-white/[.03] p-5 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Icon className="size-5 text-cyan-300" aria-hidden="true" /><p className="mt-6 font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">{brand}</p><h3 className="mt-1 text-lg font-bold">{label}</h3><p className="mt-3 text-sm leading-6 text-white/50">{description}</p><p className="mt-5 font-mono text-[10px] font-bold tracking-[.12em] text-primary uppercase">{count} {count === 1 ? 'item' : 'items'} →</p></Link>)}</div>

        {SHOW_AFTER_HOURS_ENTRY ? (
          <div className="mt-10 border-t border-white/10 pt-8">
            <Link href="/store/after-hours" className="group relative block overflow-hidden rounded-2xl border border-fuchsia-300/25 bg-gradient-to-r from-pink-500/[.09] via-fuchsia-500/[.08] to-violet-500/[.09] p-[1px] shadow-[0_0_45px_-24px_rgba(236,72,153,.9)] transition hover:-translate-y-0.5 hover:border-fuchsia-300/45 hover:shadow-[0_0_60px_-20px_rgba(236,72,153,.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
              <div className="relative flex flex-col gap-6 rounded-[15px] bg-[#08070d]/95 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-fuchsia-500/20 blur-3xl transition group-hover:bg-fuchsia-500/30" aria-hidden="true" />
                <div className="relative flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-fuchsia-300/25 bg-fuchsia-400/10 shadow-[0_0_25px_-12px_rgba(236,72,153,.9)]">
                    <MoonStar className="size-5 text-fuchsia-300" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-[10px] font-bold tracking-[.18em] text-fuchsia-300 uppercase">18+ / separate collection</p>
                      <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/[.07] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[.12em] text-fuchsia-200 uppercase">After Hours</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-black tracking-[-.03em] text-white">After Hours</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">A separate adults-only store for novelty products, outside the normal Xupply and software catalogs.</p>
                  </div>
                </div>
                <span className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-5 py-3 font-mono text-[10px] font-bold tracking-[.13em] text-white uppercase shadow-[0_8px_30px_rgba(236,72,153,.2)] transition group-hover:brightness-110">Enter After Hours <ArrowRight className="size-4" aria-hidden="true" /></span>
              </div>
            </Link>
          </div>
        ) : null}
      </section>

      <section className="border-y border-white/10 bg-white/[.018]"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="max-w-2xl"><p className="font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">Featured</p><h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Start with products that explain the range.</h2><p className="mt-3 text-sm leading-6 text-white/55">Two software tools, one audio pack, and one creator-resource kit. Each opens into a full indexable product page instead of an in-page detail drawer.</p></div><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{featured.map((product) => product ? <StoreProductCard key={product.id} product={product} /> : null)}</div></div></section>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[.72fr_1.28fr]"><div><p className="font-mono text-[10px] font-bold tracking-[.18em] text-primary uppercase">Start here</p><h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Three clean entry points.</h2><p className="mt-4 text-sm leading-6 text-white/55">If you do not want to browse the full catalog, these cover browser workflow, interface audio, and app-launch production.</p></div><div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[.025]">{startHere.map((product) => product ? <Link key={product.id} href={productPath(product)} className="group flex min-h-20 items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><div><p className="font-mono text-[9px] tracking-[.14em] text-cyan-300 uppercase">{product.category}</p><p className="mt-1 font-semibold">{product.name}</p><p className="mt-1 text-xs text-white/45">{product.productType}</p></div><span className="font-mono text-xs font-bold text-primary">{product.price} →</span></Link> : null)}</div></section>
      <section className="border-y border-white/10 bg-gradient-to-r from-primary/[.06] via-violet-500/[.04] to-cyan-400/[.06]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.16em] text-cyan-300 uppercase"><Download className="size-4" aria-hidden="true" /> Free resource</div><h2 className="mt-3 text-3xl font-bold tracking-[-.035em]">Indie Extension Release Checklist</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">A practical pre-release pass covering packaging, permissions, privacy, store assets, QA, reviewer notes, and release evidence. Useful on its own; no thin lead-magnet filler.</p></div><Link href="/store/free/indie-extension-release-checklist" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-black/30 px-5 py-3 font-mono text-[11px] font-bold tracking-[.12em] uppercase transition hover:border-cyan-300/40">Open free resource <ArrowRight className="size-4" aria-hidden="true" /></Link></div></section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="grid gap-5 md:grid-cols-3">{[{ icon: BadgeCheck, title: 'Clear delivery', body: 'Listings spell out format, compatibility, release state, and what the buyer receives.' }, { icon: ShieldCheck, title: 'No fake proof', body: 'No invented ratings, review counts, scarcity, or purchase-completion events.' }, { icon: PackageOpen, title: 'Support is visible', body: 'Product pages expose the current license summary, delivery path, and planet.X support contact.' }].map(({ icon: Icon, title, body }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><Icon className="size-5 text-cyan-300" aria-hidden="true" /><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{body}</p></div>)}</div></section>
      <section className="border-t border-white/10 bg-white/[.018]"><div className="mx-auto max-w-4xl px-5 py-14 sm:px-8"><p className="font-mono text-[10px] font-bold tracking-[.18em] text-primary uppercase">FAQ</p><h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Before you click buy or install.</h2><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{faq.map((item) => <details key={item.q} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-white marker:hidden">{item.q}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{item.a}</p></details>)}</div></div></section>
    </main><SiteFooter />
  </div>
}
