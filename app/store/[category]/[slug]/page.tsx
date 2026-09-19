import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, CircleHelp, Mail, PackageCheck, ShieldCheck } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { StoreProductCard } from '@/components/store-product-card'
import { StoreProductMedia } from '@/components/store-product-media'
import { StorePurchaseCta } from '@/components/store-purchase-cta'
import { StoreTrackedLink } from '@/components/store-tracked-link'
import {
  XUPPLY_LICENSE_PATH,
  allStoreProducts,
  categorySlug,
  getProductByRoute,
  isChromeStoreProduct,
  numericPrice,
  productOutcome,
  productPath,
  productSlug,
  publicCheckoutUrl,
  relatedProducts,
  storefrontBrand,
  usesXupplyLicense,
} from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'

export function generateStaticParams() {
  return allStoreProducts.map((product) => ({
    category: categorySlug(product.category),
    slug: productSlug(product),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const product = getProductByRoute(category, slug)
  if (!product) return {}
  const canonical = `${siteUrl}${productPath(product)}`
  const brand = storefrontBrand(product)
  const title = `${product.name} — ${product.productType} | ${brand}`
  const image = product.gallery[0]?.src ?? '/opengraph-image'
  return {
    title: { absolute: title },
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: product.description,
      url: canonical,
      siteName: 'planet.X',
      type: 'website',
      images: [{ url: image, alt: product.gallery[0]?.alt ?? product.name }],
    },
    twitter: { card: 'summary_large_image', title, description: product.description, images: [image] },
  }
}

function deliveryText(productId: string, chrome: boolean) {
  if (productId === 'project-x') return 'No purchase or download is offered yet. project.X is listed as Coming Soon.'
  if (chrome) return 'Install from the official Chrome Web Store listing. The store page remains the source of install availability.'
  return 'Digital fulfillment uses the embedded Payhip checkout. The purchase window opens over planet.X instead of navigating the shopper to Payhip.'
}

function workflowSteps(productId: string, chrome: boolean) {
  if (productId === 'project-x') return ['Review the current product scope.', 'Follow development updates.', 'Return when the release listing changes from Coming Soon.']
  if (chrome) return ['Open the official Chrome Web Store listing.', 'Install the extension into Chrome.', 'Use the local-first workflow described on the listing; optional paid entitlements remain inside the product flow where offered.']
  return ['Review the exact contents and formats below.', 'Open the embedded checkout without leaving the planet.X product page.', 'Use the delivered files in the compatible workflow described for the product.']
}

export default async function StoreProductPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const product = getProductByRoute(category, slug)
  if (!product) notFound()

  const canonical = `${siteUrl}${productPath(product)}`
  const brand = storefrontBrand(product)
  const checkoutUrl = publicCheckoutUrl(product)
  const chrome = isChromeStoreProduct(product)
  const isComingSoon = product.id === 'project-x'
  const ctaMode = isComingSoon ? 'coming-soon' : chrome ? 'chrome' : 'payhip'
  const price = numericPrice(product)
  const related = relatedProducts(product, 3)

  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.id,
    category: product.category,
    description: product.description,
    url: canonical,
    image: product.gallery.map((image) => `${siteUrl}${image.src}`),
    brand: { '@type': 'Brand', name: brand },
  }
  if (!isComingSoon && price !== null && checkoutUrl) {
    productSchema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      url: chrome ? checkoutUrl : canonical,
      seller: { '@type': 'Organization', name: 'planet.X', url: siteUrl },
    }
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'planet.X', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Store', item: `${siteUrl}/store` },
      { '@type': 'ListItem', position: 3, name: product.category, item: `${siteUrl}/store/${categorySlug(product.category)}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: canonical },
    ],
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <StorePageTracker event="product_view" properties={{ product_id: product.id, product_name: product.name, category: product.category, product_status: product.status }} />
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-[#ff007f]/15">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-25" />
          <div className="relative mx-auto grid max-w-[1380px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:px-8 lg:py-14">
            <div>
              <nav className="font-mono text-[10px] tracking-[.13em] text-white/40 uppercase" aria-label="Breadcrumb">
                <Link href="/store" className="hover:text-white">Store</Link> /{' '}
                <Link href={`/store/${categorySlug(product.category)}`} className="hover:text-white">{product.category}</Link> / {product.name}
              </nav>
              <p className="mt-7 font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">{brand}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-.045em] sm:text-5xl">{product.name}</h1>
              <p className="mt-4 text-xl font-semibold leading-8 text-white/90">{productOutcome(product)}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">{product.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <div>
                  <p className="font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">{product.priceNote}</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{product.price}</p>
                </div>
                <StorePurchaseCta productId={product.id} productName={product.name} mode={ctaMode} checkoutUrl={checkoutUrl} />
              </div>
              <p className="mt-4 font-mono text-[9px] tracking-[.11em] text-white/35 uppercase">Status: {product.status}</p>
            </div>

            <StoreProductMedia
              productId={product.id}
              productName={product.name}
              gallery={product.gallery}
              eyebrow={`${product.category} / ${product.productType}`}
              description={product.description}
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {product.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="rounded-xl border border-white/10 bg-white/[.025] p-4">
                <p className="font-mono text-lg font-bold text-cyan-300">{metric.value}</p>
                <p className="mt-1 text-xs text-white/45">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1380px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
            <p className="font-mono text-[10px] font-bold tracking-[.16em] text-primary uppercase">What is included</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">The actual product, not a vague promise.</h2>
            <ul className="mt-7 grid gap-3">
              {product.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/62">
                  <Check className="mt-1 size-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
            <p className="font-mono text-[10px] font-bold tracking-[.16em] text-cyan-300 uppercase">Best fit</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Built for a specific job.</h2>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.bestFor.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[.025] px-3 py-2 text-xs text-white/65">{item}</span>)}
            </div>
            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
              <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]"><dt className="font-mono text-[10px] tracking-[.12em] text-white/35 uppercase">Format</dt><dd className="text-white/65">{product.format}</dd></div>
              <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]"><dt className="font-mono text-[10px] tracking-[.12em] text-white/35 uppercase">Platforms</dt><dd className="text-white/65">{product.platforms?.join(', ') || 'Use the file formats and compatibility notes listed above.'}</dd></div>
              <div className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]"><dt className="font-mono text-[10px] tracking-[.12em] text-white/35 uppercase">Delivery</dt><dd className="text-white/65">{deliveryText(product.id, chrome)}</dd></div>
            </dl>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1380px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6">
            <PackageCheck className="size-5 text-cyan-300" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">How it is used</h2>
            <ol className="mt-5 grid gap-4">
              {workflowSteps(product.id, chrome).map((step, index) => (
                <li key={step} className="grid grid-cols-[28px_1fr] gap-3 text-sm leading-6 text-white/60">
                  <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span><span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">License, delivery & support</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">{product.license}</p>
            {usesXupplyLicense(product) ? <Link href={XUPPLY_LICENSE_PATH} className="mt-4 inline-flex font-mono text-[10px] font-bold tracking-[.12em] text-primary uppercase hover:text-white">Read the official Xupply License Terms →</Link> : null}
            <p className="mt-4 text-sm leading-6 text-white/60">{deliveryText(product.id, chrome)}</p>
            <a href="mailto:chris@planet-x.co" className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.12em] text-cyan-300 uppercase hover:text-white">
              <Mail className="size-4" aria-hidden="true" /> chris@planet-x.co
            </a>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[.018]">
          <div className="mx-auto max-w-[1380px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.16em] text-primary uppercase"><CircleHelp className="size-4" aria-hidden="true" /> Product FAQ</div>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              <details className="py-5"><summary className="cursor-pointer font-semibold">What exactly do I receive?</summary><p className="mt-3 text-sm leading-6 text-white/55">The exact current contents are listed above. No unlisted bonus files, fake quantities, or assumed features are included in this page.</p></details>
              <details className="py-5"><summary className="cursor-pointer font-semibold">Where does checkout or installation happen?</summary><p className="mt-3 text-sm leading-6 text-white/55">{deliveryText(product.id, chrome)}</p></details>
              <details className="py-5"><summary className="cursor-pointer font-semibold">What if I need help before buying?</summary><p className="mt-3 text-sm leading-6 text-white/55">Use the visible planet.X support email above with the product name and the compatibility or licensing question you need answered.</p></details>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.16em] text-cyan-300 uppercase">Related products</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">Keep the workflow connected.</h2>
            </div>
            <Link href="/store" className="font-mono text-[10px] font-bold tracking-[.12em] text-primary uppercase">Browse all items →</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <div key={item.id} className="relative">
                <StoreProductCard product={item} />
                <StoreTrackedLink href={productPath(item)} event="related_product_click" properties={{ source_product_id: product.id, related_product_id: item.id }} className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span className="sr-only">View related product {item.name}</span>
                </StoreTrackedLink>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-gradient-to-r from-primary/[.06] via-violet-500/[.04] to-cyan-400/[.06]">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.16em] text-white/40 uppercase">{brand}</p>
              <h2 className="mt-2 text-2xl font-bold">{isComingSoon ? 'Follow the release.' : `Ready for ${product.name}?`}</h2>
            </div>
            <StorePurchaseCta productId={product.id} productName={product.name} mode={ctaMode} checkoutUrl={checkoutUrl} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
