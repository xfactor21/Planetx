'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { ArrowUpRight, Check, MonitorSmartphone, ShoppingBag } from 'lucide-react'
import {
  storeCategories,
  storeProducts,
  type ProductGalleryImage,
  type StoreCategory,
  type StoreProduct,
} from '@/lib/store-data'
import { sessionGridProduct } from '@/lib/sessiongrid-product'
import { planetXTrack } from '@/lib/client-analytics'

type CategoryFilter = 'All' | StoreCategory
type CheckoutMap = Record<string, string>

const CONTEXT_CHROME_URL = 'https://chromewebstore.google.com/detail/context-encrypted-credent/ikedbigbancjamohakblaclcoljlhdbn'

const brandedCoverById: Record<string, string> = {
  'creator-stream-pack': '/store/listings/xupply-creator-stream-pack.svg',
  'interface-hud-kit': '/store/listings/xupply-interface-hud-kit.svg',
  'website-atmosphere-pack': '/store/listings/xupply-website-atmosphere-pack.svg',
  'creator-editing-overlays': '/store/listings/xupply-creator-editing-overlays.svg',
  'digital-worlds-wallpapers': '/store/listings/xupply-digital-worlds-wallpapers.svg',
  'producer-transitions-impacts': '/store/listings/xupply-producer-transitions-impacts.svg',
}

function normalizeProduct(product: StoreProduct): StoreProduct {
  if (product.id === 'context-pro') {
    return {
      ...product,
      name: 'conteXt',
      productType: 'Chrome extension · encrypted developer workspace',
      price: 'Free',
      priceNote: 'Chrome extension',
      status: 'Available now',
      platforms: ['Chrome extension'],
      format: 'Chrome extension / Manifest V3',
      license:
        'Install free from the Chrome Web Store. Existing local vault data remains on-device. Optional Pro licensing is available from the private in-extension upgrade flow.',
      checkoutUrl: CONTEXT_CHROME_URL,
    }
  }

  if (product.id === 'project-x') {
    return {
      ...product,
      checkoutUrl: undefined,
      status: 'Coming soon',
      priceNote: 'Planned release',
    }
  }

  return product
}

const allStoreProducts = [sessionGridProduct, ...storeProducts].map(normalizeProduct)

const categoryStyles: Record<StoreCategory, string> = {
  Software: 'border-accent/60 bg-accent/10 text-accent',
  'Audio & FX': 'border-primary/60 bg-primary/10 text-primary',
  'Creator Resources': 'border-primary/40 bg-[linear-gradient(90deg,rgba(255,46,159,.12),rgba(0,245,255,.1))] text-white',
}

function galleryForProduct(product: StoreProduct): ProductGalleryImage[] {
  const cover = brandedCoverById[product.id]
  if (!cover || product.gallery.length === 0) return product.gallery
  return [
    {
      ...product.gallery[0],
      src: cover,
      alt: `${product.name} Xupply product cover`,
      label: 'Xupply identity',
      fit: 'cover',
    },
    ...product.gallery.slice(1),
  ]
}

function ProductGallery({ product }: { product: StoreProduct }) {
  const [selected, setSelected] = useState(0)
  const gallery = galleryForProduct(product)
  const image = gallery[selected] ?? gallery[0]

  useEffect(() => {
    setSelected(0)
  }, [product.id])

  if (!image) return null

  return (
    <div className="min-w-0 lg:sticky lg:top-40 lg:self-start">
      <div className="relative aspect-[16/10] overflow-hidden border border-border bg-[radial-gradient(circle_at_88%_12%,rgba(255,46,159,.11),transparent_30%),radial-gradient(circle_at_8%_90%,rgba(0,245,255,.08),transparent_32%),#030307]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className={image.fit === 'contain' ? 'object-contain p-5 sm:p-8' : 'object-cover'}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_70%,rgba(3,3,8,.28))]" aria-hidden="true" />
        <div className="absolute left-4 top-4 border border-white/10 bg-black/55 px-2.5 py-1 font-mono text-[0.55rem] font-bold tracking-[0.16em] text-white/75 uppercase backdrop-blur">
          Xupply / {product.category}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/85 px-4 py-3 backdrop-blur">
          <span className="font-mono text-[0.64rem] tracking-[0.14em] text-white uppercase">{image.label}</span>
          <span className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground">{selected + 1} / {gallery.length}</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {gallery.map((item: ProductGalleryImage, index) => (
          <button
            key={`${product.id}-${item.src}`}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`Show ${item.label}`}
            aria-pressed={selected === index}
            className={`group min-w-0 border bg-black text-left transition-colors ${selected === index ? 'border-primary' : 'border-border hover:border-accent/70'}`}
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-[#030307]">
              <Image src={item.src} alt="" fill sizes="16vw" className={item.fit === 'contain' ? 'object-contain p-2' : 'object-cover'} />
              <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_75%,rgba(3,3,8,.25))]" aria-hidden="true" />
            </span>
            <span className="block truncate border-t border-border px-2 py-2 font-mono text-[0.56rem] tracking-[0.08em] text-muted-foreground uppercase group-hover:text-white">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductSection({ product, checkoutMap, checkoutLoading }: { product: StoreProduct; checkoutMap: CheckoutMap; checkoutLoading: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const productNumber = String(allStoreProducts.findIndex((item) => item.id === product.id) + 1).padStart(2, '0')
  const isChromeStore = product.checkoutUrl?.includes('chromewebstore.google.com') ?? false
  const isProjectX = product.id === 'project-x'
  const isPaidProduct = !isChromeStore && !isProjectX
  const embeddedCheckoutHref = isPaidProduct ? checkoutMap[product.id] : undefined
  const cleanProductType = product.productType.replace(/^Chrome extension\s*·\s*/i, '')

  const priceNote = isChromeStore
    ? 'Chrome extension'
    : isProjectX
      ? 'Planned release'
      : /test-mode|proposed/i.test(product.priceNote)
        ? 'Current price'
        : product.priceNote

  const status = isChromeStore
    ? 'Available now'
    : isProjectX
      ? 'Coming soon'
      : embeddedCheckoutHref
        ? 'Available now'
        : checkoutLoading
          ? 'Loading checkout'
          : 'Checkout temporarily unavailable'

  const license = isChromeStore
    ? product.license
    : isProjectX
      ? 'Final license terms will be published before release.'
      : /draft|planned|not active yet|requires final legal review/i.test(product.license)
        ? 'License terms are included with the product purchase.'
        : product.license

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let tracked = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || tracked) return
        tracked = true
        planetXTrack('product_view', {
          product_id: product.id,
          product_name: product.name,
          product_status: status,
          product_category: product.category,
        })
        observer.disconnect()
      },
      { threshold: 0.35 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [product.category, product.id, product.name, status])

  const trackCta = (ctaLabel: string, destination: string) => {
    planetXTrack('product_cta_click', { product_id: product.id, product_name: product.name, cta_label: ctaLabel })
    planetXTrack('external_app_launch', { product_id: product.id, product_name: product.name, destination })
  }

  return (
    <article ref={sectionRef} id={product.id} className="scroll-mt-36 border-t-2 border-primary/80 bg-[linear-gradient(180deg,rgba(255,46,159,.035),transparent_12rem)]">
      <header className="mx-auto max-w-7xl px-4 pb-7 pt-8 md:px-8 md:pb-9 md:pt-11">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.14em] uppercase ${categoryStyles[product.category]}`}>{product.category}</span>
          <span className="font-mono text-[0.66rem] tracking-[0.18em] text-muted-foreground">PRODUCT {productNumber}</span>
        </div>
        {isChromeStore ? (
          <div className="mt-6 inline-flex items-center gap-2 border-2 border-cyan-300/70 bg-cyan-300/10 px-3 py-2 font-mono text-[0.72rem] font-black tracking-[0.18em] text-cyan-200 uppercase shadow-[0_0_24px_-14px_rgba(0,245,255,.9)]">
            <MonitorSmartphone className="size-4" aria-hidden="true" />
            Chrome Extension
          </div>
        ) : null}
        <p className={`${isChromeStore ? 'mt-3 text-white/70' : 'mt-6 text-accent'} font-mono text-[0.66rem] tracking-[0.16em] uppercase`}>{isChromeStore ? cleanProductType : product.productType}</p>
        <h2 className="mt-2 text-3xl font-medium tracking-normal sm:text-4xl lg:text-5xl">{product.name}</h2>
      </header>

      <div className="mx-auto grid max-w-7xl gap-9 px-4 pb-12 md:px-8 md:pb-16 lg:grid-cols-[1.04fr_.96fr] lg:gap-14 lg:pb-20">
        <ProductGallery product={product} />
        <div className="min-w-0">
          <p className="text-base leading-7 text-foreground/78 sm:text-lg">{product.description}</p>

          {!isChromeStore && product.platforms ? (
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
              <MonitorSmartphone className="size-4 text-accent" aria-hidden="true" />
              {product.platforms.join(' / ')}
            </p>
          ) : null}

          <dl className="mt-8 grid grid-cols-3 border-y border-border">
            {product.metrics.map((metric, index) => (
              <div key={metric.label} className={`min-w-0 py-4 ${index > 0 ? 'border-l border-border pl-4' : 'pr-4'}`}>
                <dt className="text-lg font-medium text-white sm:text-xl">{metric.value}</dt>
                <dd className="mt-1 font-mono text-[0.56rem] leading-4 tracking-[0.08em] text-muted-foreground uppercase">{metric.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h3 className="font-mono text-[0.67rem] tracking-[0.16em] text-primary uppercase">Inside this product</h3>
            <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {product.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-foreground/76">
                  <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-6 border-t border-border pt-7 sm:grid-cols-2">
            <div>
              <h3 className="font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">Best for</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.bestFor.map((item) => <span key={item} className="border border-border px-2.5 py-1.5 text-xs text-foreground/75">{item}</span>)}
              </div>
            </div>
            <div className="text-sm leading-6 text-foreground/72">
              <p><span className="font-medium text-white">Format:</span> {product.format}</p>
              <p className="mt-2"><span className="font-medium text-white">License:</span> {license}</p>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-5 border-l-2 border-primary bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">{priceNote}</p>
              <p className="mt-1 text-xl font-medium text-primary">{product.price}</p>
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.1em] text-accent uppercase">{status}</p>
            </div>

            {isChromeStore && product.checkoutUrl ? (
              <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackCta('add_to_chrome', product.checkoutUrl!)} className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-accent">
                <MonitorSmartphone className="size-4" aria-hidden="true" />
                Add to Chrome
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : isProjectX ? (
              <span className="inline-flex min-h-12 items-center justify-center border border-border px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">Coming soon</span>
            ) : embeddedCheckoutHref ? (
              <a href={embeddedCheckoutHref} className="payhip-buy-button inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-accent" data-theme="none" onClick={() => trackCta('buy_now', 'embedded_checkout')}>
                <ShoppingBag className="size-4" aria-hidden="true" />
                Buy Now
              </a>
            ) : (
              <button type="button" disabled className="inline-flex min-h-12 cursor-not-allowed items-center justify-center border border-border px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase opacity-70" aria-label={checkoutLoading ? 'Checkout is loading' : 'Checkout is temporarily unavailable'}>
                {checkoutLoading ? 'Loading…' : 'Checkout unavailable'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function StoreCatalog() {
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [checkoutMap, setCheckoutMap] = useState<CheckoutMap>({})
  const [checkoutLoading, setCheckoutLoading] = useState(true)

  const products = useMemo(() => category === 'All' ? allStoreProducts : allStoreProducts.filter((product) => product.category === category), [category])

  useEffect(() => {
    let cancelled = false
    fetch('/api/store-checkouts')
      .then((response) => response.json())
      .then((payload: { checkouts?: CheckoutMap }) => { if (!cancelled) setCheckoutMap(payload.checkouts ?? {}) })
      .catch(() => { if (!cancelled) setCheckoutMap({}) })
      .finally(() => { if (!cancelled) setCheckoutLoading(false) })
    return () => { cancelled = true }
  }, [])

  const hasEmbeddedCheckout = Object.keys(checkoutMap).length > 0

  return (
    <>
      {hasEmbeddedCheckout ? <Script src="https://payhip.com/payhip.js" strategy="afterInteractive" /> : null}
      <div className="sticky top-[5.5rem] z-30 border-b border-primary/60 bg-background/95 px-4 py-3 backdrop-blur md:top-[7.5rem] md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto scrollbar-none">
          {storeCategories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 border px-4 py-2 font-mono text-[0.66rem] tracking-[0.12em] uppercase transition-colors ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-accent hover:text-accent'}`}>
              {item}
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase sm:block">{products.length} products</span>
        </div>
      </div>

      <section aria-live="polite">
        {products.map((product) => <ProductSection key={product.id} product={product} checkoutMap={checkoutMap} checkoutLoading={checkoutLoading} />)}
      </section>

      <section className="border-y-2 border-primary/80 bg-[linear-gradient(90deg,rgba(255,46,159,.08),transparent_40%,rgba(0,245,255,.07))]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <p className="font-mono text-[0.65rem] tracking-[0.16em] text-primary uppercase">Xupply bundles</p>
          <h2 className="mt-2 text-2xl font-medium tracking-normal sm:text-3xl">Bundles are coming soon.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Curated Xupply collections are being packaged now. Individual products above can be purchased directly from their listings.</p>
        </div>
      </section>
    </>
  )
}
