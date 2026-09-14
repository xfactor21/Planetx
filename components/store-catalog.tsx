'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

type StoreView = 'Trending' | StoreCategory
type CheckoutMap = Record<string, string>

const CONTEXT_CHROME_URL =
  'https://chromewebstore.google.com/detail/context-encrypted-credent/ikedbigbancjamohakblaclcoljlhdbn'

const VERIFIED_PAYHIP_CHECKOUTS: CheckoutMap = {
  'essential-ui-sounds': 'https://payhip.com/b/CIwxS',
  'digital-glitch-fx': 'https://payhip.com/b/ROlqw',
  'indie-launch-kit': 'https://payhip.com/b/7cJjO',
  'creator-asset-forge': 'https://payhip.com/b/3K5at',
  'creator-stream-pack': 'https://payhip.com/b/tA5To',
  'interface-hud-kit': 'https://payhip.com/b/BCK4P',
  'website-atmosphere-pack': 'https://payhip.com/b/49vW6',
  'creator-editing-overlays': 'https://payhip.com/b/NGUKi',
  'digital-worlds-wallpapers': 'https://payhip.com/b/6x4EO',
  'producer-transitions-impacts': 'https://payhip.com/b/PcOWp',
}

const TRENDING_IDS = new Set([
  'sessiongrid-x',
  'context-pro',
  'essential-ui-sounds',
  'interface-hud-kit',
])

function normalizeProduct(product: StoreProduct): StoreProduct {
  if (product.id === 'context-pro') {
    return {
      ...product,
      name: 'conteXt',
      productType: 'Encrypted developer workspace',
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

const allProducts = [sessionGridProduct, ...storeProducts].map(normalizeProduct)
const views: StoreView[] = ['Trending', ...storeCategories.filter((item): item is StoreCategory => item !== 'All')]

function productGallery(product: StoreProduct): ProductGalleryImage[] {
  return product.gallery.filter((image) => Boolean(image.src))
}

function categoryTone(category: StoreCategory) {
  if (category === 'Software') return '#00f0ff'
  if (category === 'Audio & FX') return '#a855f7'
  return '#ff2b8a'
}

function ProductCard({
  product,
  active,
  index,
  onSelect,
}: {
  product: StoreProduct
  active: boolean
  index: number
  onSelect: () => void
}) {
  const gallery = productGallery(product)
  const image = gallery[0]
  const tone = categoryTone(product.category)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="group relative min-w-0 overflow-hidden rounded-lg border bg-[#090c15] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
      style={{
        borderColor: active ? '#ff2b8a' : 'rgba(255,255,255,.08)',
        boxShadow: active ? '0 0 22px rgba(255,43,138,.18)' : undefined,
        animation: 'store-card-in .45s ease both',
        animationDelay: `${index * 45}ms`,
      }}
    >
      <div className="relative h-36 overflow-hidden bg-[#0a0e1a]">
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${
              image.fit === 'contain' ? 'object-contain p-3' : 'object-cover'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,43,138,.12),transparent_45%),#080b13] font-mono text-[10px] tracking-[.2em] text-white/35 uppercase">
            planet.X / asset
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25" />
        {active ? (
          <span className="absolute right-3 top-3 size-1.5 rounded-full bg-primary shadow-[0_0_10px_#ff2b8a]" />
        ) : null}
      </div>

      <div className="p-3.5">
        <p className="font-mono text-[10px] font-bold tracking-[.14em] uppercase" style={{ color: tone }}>
          {product.productType}
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold tracking-[-.01em] text-white">{product.name}</h3>
            <p className="mt-1 font-mono text-xs font-bold text-primary">{product.price}</p>
          </div>
          <span className="shrink-0 font-mono text-[10px] font-bold tracking-[.12em] text-cyan-300 uppercase">
            Inspect →
          </span>
        </div>
      </div>
    </button>
  )
}

function ProductDetail({
  product,
  checkoutMap,
}: {
  product: StoreProduct
  checkoutMap: CheckoutMap
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const gallery = productGallery(product)
  const image = gallery[imageIndex] ?? gallery[0]
  const tone = categoryTone(product.category)
  const isChromeStore = product.checkoutUrl?.includes('chromewebstore.google.com') ?? false
  const isProjectX = product.id === 'project-x'
  const checkoutHref = !isChromeStore && !isProjectX
    ? checkoutMap[product.id] ?? VERIFIED_PAYHIP_CHECKOUTS[product.id]
    : undefined

  useEffect(() => setImageIndex(0), [product.id])

  const trackCta = (ctaLabel: string, destination: string) => {
    planetXTrack('product_cta_click', {
      product_id: product.id,
      product_name: product.name,
      cta_label: ctaLabel,
    })
    planetXTrack('external_app_launch', {
      product_id: product.id,
      product_name: product.name,
      destination,
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/[.08] bg-[#090c15] shadow-2xl shadow-black/30">
      <div className="relative h-[260px] overflow-hidden bg-[#0a0e1a] sm:h-[300px]">
        {image ? (
          <img
            key={`${product.id}-${imageIndex}`}
            src={image.src}
            alt={image.alt}
            decoding="async"
            className={`h-full w-full ${
              image.fit === 'contain' ? 'object-contain p-5' : 'object-cover'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs tracking-[.18em] text-white/35 uppercase">
            planet.X / preview
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#090c15]/70" />
        <span className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-2 py-1 font-mono text-[9px] font-bold tracking-[.16em] text-white/80 uppercase backdrop-blur">
          Focus • {product.id.replaceAll('-', ' ')}
        </span>
        <span
          className="absolute right-3 top-3 rounded border border-white/10 bg-black/65 px-2.5 py-1 font-mono text-[10px] font-bold backdrop-blur"
          style={{ color: tone }}
        >
          {product.price}
        </span>
      </div>

      {gallery.length > 1 ? (
        <div className="flex items-center gap-2 overflow-x-auto border-y border-white/[.06] bg-black/30 px-5 py-3">
          {gallery.map((item, index) => (
            <button
              key={`${product.id}-${item.src}`}
              type="button"
              onClick={() => setImageIndex(index)}
              aria-label={`Show ${item.label}`}
              aria-pressed={index === imageIndex}
              className="relative h-10 w-16 shrink-0 overflow-hidden rounded border transition-opacity"
              style={{
                borderColor: index === imageIndex ? '#ff2b8a' : 'rgba(255,255,255,.15)',
                opacity: index === imageIndex ? 1 : 0.6,
              }}
            >
              <img
                src={item.src}
                alt=""
                loading="lazy"
                className={`h-full w-full ${item.fit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
              />
            </button>
          ))}
          <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[9px] tracking-[.18em] text-white/45 uppercase">
            <span className="size-1 animate-pulse rounded-full bg-cyan-300" />
            Live preview
          </div>
        </div>
      ) : null}

      <div className="p-5">
        <p className="font-mono text-[10px] font-bold tracking-[.18em] uppercase" style={{ color: tone }}>
          {product.category} / {product.productType}
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-[-.02em] text-white sm:text-2xl">{product.name}</h2>
        <p className="mt-3 text-[13px] leading-6 text-white/55">{product.description}</p>

        <ul className="mt-5 grid gap-2">
          {product.includes.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs leading-5 text-white/60">
              <Check className="mt-0.5 size-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.08] pt-5">
          <div>
            <p className="font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">{product.priceNote}</p>
            <p className="mt-1 font-mono text-lg font-bold text-primary">{product.price}</p>
          </div>

          {isChromeStore && product.checkoutUrl ? (
            <a
              href={product.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta('add_to_chrome', product.checkoutUrl!)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-mono text-[11px] font-bold tracking-[.14em] text-white uppercase shadow-[0_4px_20px_rgba(255,43,138,.25)] transition hover:bg-accent"
            >
              <MonitorSmartphone className="size-4" aria-hidden="true" />
              Add to Chrome
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : isProjectX ? (
            <span className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 py-3 font-mono text-[11px] font-bold tracking-[.14em] text-white/45 uppercase">
              Coming soon
            </span>
          ) : checkoutHref ? (
            <a
              href={checkoutHref}
              className="payhip-buy-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-mono text-[11px] font-bold tracking-[.14em] text-white uppercase shadow-[0_4px_20px_rgba(255,43,138,.25)] transition hover:bg-accent"
              data-theme="none"
              onClick={() => trackCta('buy_now', 'embedded_checkout')}
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              Buy Now
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-md border border-white/15 px-5 py-3 font-mono text-[11px] font-bold tracking-[.14em] text-white/35 uppercase"
            >
              Checkout unavailable
            </button>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[.08] pt-4 font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">
          <span>Xupply entry</span>
          <span>{product.category} • {product.format}</span>
        </div>
      </div>
    </div>
  )
}

export function StoreCatalog() {
  const [view, setView] = useState<StoreView>('Trending')
  const [selectedId, setSelectedId] = useState('sessiongrid-x')
  const [checkoutMap, setCheckoutMap] = useState<CheckoutMap>({})
  const detailRef = useRef<HTMLDivElement>(null)

  const products = useMemo(() => {
    if (view === 'Trending') return allProducts.filter((product) => TRENDING_IDS.has(product.id))
    return allProducts.filter((product) => product.category === view)
  }, [view])

  const selected = allProducts.find((product) => product.id === selectedId) ?? products[0] ?? allProducts[0]

  useEffect(() => {
    if (!products.some((product) => product.id === selectedId) && products[0]) {
      setSelectedId(products[0].id)
    }
  }, [products, selectedId])

  useEffect(() => {
    let cancelled = false
    fetch('/api/store-checkouts')
      .then((response) => response.json())
      .then((payload: { checkouts?: CheckoutMap }) => {
        if (!cancelled) setCheckoutMap(payload.checkouts ?? {})
      })
      .catch(() => {
        if (!cancelled) setCheckoutMap({})
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selected) return
    planetXTrack('product_view', {
      product_id: selected.id,
      product_name: selected.name,
      product_status: selected.status,
      product_category: selected.category,
      store_surface: 'vault_detail',
    })
  }, [selected])

  const selectProduct = (id: string) => {
    setSelectedId(id)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  return (
    <>
      <Script src="https://payhip.com/payhip.js" strategy="afterInteractive" />

      <section className="relative overflow-hidden bg-[#030305] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -left-20 -top-28 size-[420px] rounded-full bg-primary/10 blur-[90px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-44 size-[520px] rounded-full bg-cyan-400/10 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-[30%] h-80 w-[600px] rounded-full bg-violet-500/[.06] blur-[120px]" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1380px]">
          <header className="flex items-end justify-between gap-5 border-b border-white/[.08] px-5 py-7 md:px-8">
            <div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-xl font-bold tracking-[-.02em]">planet.X</span>
                <span className="font-mono text-[11px] tracking-[.18em] text-white/35">//</span>
                <span className="font-mono text-[11px] font-bold tracking-[.22em] text-white/80 uppercase">Xupply Vault</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-.03em] sm:text-4xl">Tools, sounds & assets built to ship.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Software, Chrome extensions, audio and creator resources from planet.X. Pick a category, inspect a product, then install or buy without losing your place.
              </p>
            </div>
            <div className="hidden text-right md:block">
              <p className="font-mono text-[10px] tracking-[.2em] text-white/35 uppercase">Dynamic vault</p>
              <div className="ml-auto mt-2 h-px w-24 bg-white/10" />
            </div>
          </header>

          <nav className="flex items-center gap-2.5 overflow-x-auto border-b border-white/[.06] px-5 py-5 md:px-8" aria-label="Store categories">
            {views.map((item) => {
              const active = item === view
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  aria-pressed={active}
                  className="shrink-0 rounded-full px-4 py-1.5 font-mono text-[11px] font-bold tracking-[.08em] uppercase transition"
                  style={{
                    border: `1px solid ${active ? '#ff2b8a' : 'rgba(255,255,255,.14)'}`,
                    background: active ? 'rgba(255,43,138,.12)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,.45)',
                  }}
                >
                  {item}
                </button>
              )
            })}
            <div className="ml-auto hidden shrink-0 items-center gap-2 font-mono text-[10px] tracking-[.16em] text-white/35 uppercase md:flex">
              <span>{products.length} items</span>
              <span className="size-1 rounded-full bg-white/35" />
              <span>{allProducts.length} total</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 gap-6 px-5 py-6 md:gap-8 md:px-8 md:py-8 lg:grid-cols-[1.25fr_.75fr]">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-[18px]">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    active={selected?.id === product.id}
                    index={index}
                    onSelect={() => selectProduct(product.id)}
                  />
                ))}
              </div>

              <div className="mt-10 flex items-center gap-3 font-mono text-[10px] tracking-[.16em] text-white/35 uppercase">
                <div className="h-px flex-1 bg-white/[.08]" />
                <span>{view} • {products.length} / {allProducts.length}</span>
                <div className="h-px flex-1 bg-white/[.08]" />
              </div>
            </div>

            <div ref={detailRef} className="order-1 scroll-mt-28 lg:order-2">
              <div className="lg:sticky lg:top-28">
                {selected ? <ProductDetail product={selected} checkoutMap={checkoutMap} /> : null}
                <div className="mt-4 flex items-center justify-between px-1 font-mono text-[10px] tracking-[.14em] text-white/35 uppercase">
                  <span>planet.X / Xupply</span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-primary" />
                    Secure checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes store-card-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    </>
  )
}
