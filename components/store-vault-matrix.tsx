'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { StorePurchaseCta } from '@/components/store-purchase-cta'
import { planetXTrack } from '@/lib/client-analytics'
import { pinterestTrackCustom } from '@/lib/pinterest-events'
import {
  storeCategories,
  type ProductGalleryImage,
  type StoreCategory,
  type StoreProduct,
} from '@/lib/store-data'
import {
  allStoreProducts,
  FEATURED_PRODUCT_IDS,
  productPath,
  publicCheckoutUrl,
} from '@/lib/store-catalog'

type StoreView = 'Featured' | StoreCategory

const FEATURED_IDS = new Set(FEATURED_PRODUCT_IDS)

const CATEGORY_ROUTES: Record<StoreCategory, string> = {
  Software: '/store/software',
  'Audio & FX': '/store/audio-fx',
  'Creator Resources': '/store/creator-resources',
}

const products = allStoreProducts
const views: StoreView[] = [
  'Featured',
  ...storeCategories.filter((category): category is StoreCategory => category !== 'All'),
]

function galleryFor(product: StoreProduct): ProductGalleryImage[] {
  return product.gallery.filter((image) => Boolean(image.src))
}

function toneFor(category: StoreCategory) {
  if (category === 'Software') return '#00f0ff'
  if (category === 'Audio & FX') return '#ff2b8a'
  return '#a855f7'
}

function checkoutMode(product: StoreProduct): 'chrome' | 'payhip' | 'coming-soon' {
  const checkoutUrl = publicCheckoutUrl(product)
  if (!checkoutUrl) return 'coming-soon'
  if (checkoutUrl.includes('chromewebstore.google.com')) return 'chrome'
  return 'payhip'
}

function ProductCard({ product, selected, onSelect }: { product: StoreProduct; selected: boolean; onSelect: () => void }) {
  const image = galleryFor(product)[0]
  const tone = toneFor(product.category)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex min-w-0 flex-col overflow-hidden rounded border bg-[#090c15] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
      style={{
        borderColor: selected ? '#ff007f' : 'rgba(255,255,255,.08)',
        boxShadow: selected ? '0 0 18px rgba(255,0,127,.2)' : undefined,
      }}
    >
      <div className="relative h-[110px] overflow-hidden bg-[#080b13] sm:h-[126px]">
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.025] ${image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-[.18em] text-white/35 uppercase">planet.X / asset</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#090c15]" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[.14em] uppercase" style={{ color: tone }}>{product.productType}</p>
          <h3 className="mt-1.5 text-[15px] font-bold leading-tight text-white">{product.name}</h3>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mono text-sm font-bold text-[#ff007f]">{product.price}</span>
          <span className="font-mono text-[10px] font-bold tracking-[.12em] text-[#00f0ff] uppercase">Inspect →</span>
        </div>
      </div>
    </button>
  )
}

function ProductShowcase({ product }: { product: StoreProduct }) {
  const gallery = galleryFor(product)
  const [imageIndex, setImageIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const showcaseRef = useRef<HTMLDivElement>(null)
  const image = gallery[imageIndex] ?? gallery[0]
  const tone = toneFor(product.category)

  useEffect(() => {
    setImageIndex(0)
    setCycleKey((value) => value + 1)
  }, [product.id])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener?.('change', sync)
    return () => query.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    if (reduceMotion || gallery.length <= 1) return
    const timer = window.setInterval(() => {
      setImageIndex((index) => (index + 1) % gallery.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [product.id, gallery.length, reduceMotion, cycleKey])

  const selectImage = (index: number) => {
    setImageIndex(index)
    setCycleKey((value) => value + 1)
  }

  return (
    <aside className="h-fit overflow-hidden rounded border border-[#ff007f]/30 bg-[#090c15] shadow-[0_24px_70px_-40px_rgba(255,0,127,.55)] lg:sticky lg:top-24">
      <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden bg-[#080b13] p-5 sm:min-h-[310px]">
        {image ? (
          <img
            key={`${product.id}-${imageIndex}`}
            src={image.src}
            alt={image.alt}
            decoding="async"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030305]/20 via-[#030305]/35 to-[#090c15]/95" />
        <div className="relative z-10">
          <p className="font-mono text-[10px] font-bold tracking-[.16em] uppercase" style={{ color: tone }}>{product.category} / {product.productType}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-.025em] text-white">{product.name}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8b92a5]">{product.description}</p>
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="flex items-center gap-2 overflow-x-auto border-y border-white/[.06] bg-black/40 px-5 py-3">
          {gallery.map((item, index) => (
            <button
              key={`${product.id}-${item.src}`}
              type="button"
              onClick={() => selectImage(index)}
              aria-label={`Show ${item.label}`}
              aria-pressed={index === imageIndex}
              className="h-11 w-16 shrink-0 overflow-hidden rounded-sm border bg-black/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
              style={{
                borderColor: index === imageIndex ? '#ff007f' : 'rgba(255,255,255,.2)',
                opacity: index === imageIndex ? 1 : 0.6,
                boxShadow: index === imageIndex ? '0 0 9px rgba(255,0,127,.7)' : undefined,
              }}
            >
              <img src={item.src} alt="" loading="lazy" className={`h-full w-full ${item.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 font-mono text-[9px] tracking-[.15em] text-white/35 uppercase sm:block">{imageIndex + 1}/{gallery.length}</span>
        </div>
      ) : null}

      <div className="p-5">
        <ul className="grid gap-2">
          {product.includes.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs leading-5 text-white/58">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#00f0ff]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.08] pt-5">
          <div>
            <p className="font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">{product.priceNote}</p>
            <p className="mt-1 font-mono text-xl font-bold text-[#ff007f]">{product.price}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href={productPath(product)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/70 uppercase transition hover:border-[#00f0ff]/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            >
              Full details <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <StorePurchaseCta
              productId={product.id}
              productName={product.name}
              mode={checkoutMode(product)}
              checkoutUrl={publicCheckoutUrl(product)}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

export function StoreVaultMatrix() {
  const [view, setView] = useState<StoreView>('Featured')
  const initial = products.find((product) => product.id === 'sessiongrid-x') ?? products[0]
  const [selectedId, setSelectedId] = useState(initial?.id ?? '')
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener?.('change', sync)
    return () => query.removeEventListener?.('change', sync)
  }, [])

  const visibleProducts = useMemo(() => {
    if (view === 'Featured') return products.filter((product) => FEATURED_IDS.has(product.id))
    return products.filter((product) => product.category === view)
  }, [view])

  const selected = products.find((product) => product.id === selectedId) ?? visibleProducts[0] ?? products[0]

  const selectProduct = (product: StoreProduct) => {
    setSelectedId(product.id)

    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => {
        showcaseRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      })
    }
    try {
      planetXTrack('product_view', {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        surface: 'vault_matrix',
      }, { sourceSurface: 'store_vault_matrix' })
      pinterestTrackCustom('product_view', {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
      })
    } catch {
      // Product selection must never depend on analytics.
    }
  }

  const selectView = (next: StoreView) => {
    setView(next)
    const nextProducts = next === 'Featured'
      ? products.filter((product) => FEATURED_IDS.has(product.id))
      : products.filter((product) => product.category === next)
    if (nextProducts[0]) selectProduct(nextProducts[0])
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ff007f]/20 pb-4">
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[.2em] text-[#00f0ff] uppercase">planet.X // Vault Matrix</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-.035em] text-white sm:text-3xl">Dynamic Vault</h1>
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[.14em] text-[#ff007f] uppercase">
          {reduceMotion ? 'Auto-cycle paused · reduced motion' : 'Auto-cycle active · 4s'}
        </span>
      </div>

      <div className="mb-7 flex gap-2 overflow-x-auto border-b border-white/[.05] pb-4">
        {views.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => selectView(item)}
            className="shrink-0 border px-4 py-2 font-mono text-[11px] font-bold tracking-[.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
            style={{
              borderColor: view === item ? '#ff007f' : 'rgba(255,255,255,.1)',
              background: view === item ? 'rgba(255,0,127,.1)' : 'transparent',
              color: view === item ? '#fff' : '#8b92a5',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} selected={selected?.id === product.id} onSelect={() => selectProduct(product)} />
          ))}
        </div>
        <div ref={showcaseRef} className="scroll-mt-24">
          {selected ? <ProductShowcase key={selected.id} product={selected} /> : null}
        </div>
      </div>

      <div className="mt-10 grid gap-3 border-t border-white/[.06] pt-6 sm:grid-cols-3">
        {storeCategories.filter((category): category is StoreCategory => category !== 'All').map((category) => (
          <Link key={category} href={CATEGORY_ROUTES[category]} className="flex min-h-12 items-center justify-between rounded border border-white/10 bg-white/[.02] px-4 py-3 font-mono text-[10px] font-bold tracking-[.1em] text-white/60 uppercase transition hover:border-[#00f0ff]/40 hover:text-white">
            Full {category} index <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="mt-5 border-t border-white/[.06] pt-5 text-xs text-white/35">
        <p>Dedicated product pages, guides, bundles and free resources remain available for search and deep browsing.</p>
      </div>
    </section>
  )
}
