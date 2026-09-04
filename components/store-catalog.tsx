'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ArrowUpRight,
  Check,
  MonitorSmartphone,
} from 'lucide-react'
import {
  storeCategories,
  storeProducts,
  type ProductGalleryImage,
  type StoreCategory,
  type StoreProduct,
} from '@/lib/store-data'

type CategoryFilter = 'All' | StoreCategory

const categoryStyles: Record<StoreCategory, string> = {
  Software: 'border-accent/60 bg-accent/10 text-accent',
  'Audio & FX': 'border-primary/60 bg-primary/10 text-primary',
  'Creator Resources': 'border-primary/40 bg-[linear-gradient(90deg,rgba(255,46,159,.12),rgba(0,245,255,.1))] text-white',
}

function ProductGallery({ product }: { product: StoreProduct }) {
  const [selected, setSelected] = useState(0)
  const image = product.gallery[selected]

  return (
    <div className="min-w-0 lg:sticky lg:top-40 lg:self-start">
      <div className="relative aspect-[16/10] overflow-hidden border border-border bg-black">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className={image.fit === 'contain' ? 'object-contain p-5 sm:p-8' : 'object-cover'}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/85 px-4 py-3 backdrop-blur">
          <span className="font-mono text-[0.64rem] tracking-[0.14em] text-white uppercase">{image.label}</span>
          <span className="font-mono text-[0.6rem] tracking-[0.12em] text-muted-foreground">{selected + 1} / {product.gallery.length}</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {product.gallery.map((item: ProductGalleryImage, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`Show ${item.label}`}
            aria-pressed={selected === index}
            className={`group min-w-0 border bg-black text-left transition-colors ${selected === index ? 'border-primary' : 'border-border hover:border-accent/70'}`}
          >
            <span className="relative block aspect-[16/10] overflow-hidden">
              <Image src={item.src} alt="" fill sizes="16vw" className={item.fit === 'contain' ? 'object-contain p-2' : 'object-cover'} />
            </span>
            <span className="block truncate border-t border-border px-2 py-2 font-mono text-[0.56rem] tracking-[0.08em] text-muted-foreground uppercase group-hover:text-white">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductSection({ product }: { product: StoreProduct }) {
  const productNumber = String(storeProducts.findIndex((item) => item.id === product.id) + 1).padStart(2, '0')

  return (
    <article id={product.id} className="scroll-mt-36 border-t-2 border-primary/80 bg-[linear-gradient(180deg,rgba(255,46,159,.035),transparent_12rem)]">
      <header className="mx-auto max-w-7xl px-4 pb-7 pt-8 md:px-8 md:pb-9 md:pt-11">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.14em] uppercase ${categoryStyles[product.category]}`}>{product.category}</span>
          <span className="font-mono text-[0.66rem] tracking-[0.18em] text-muted-foreground">PRODUCT {productNumber}</span>
        </div>
        <p className="mt-6 font-mono text-[0.66rem] tracking-[0.16em] text-accent uppercase">{product.productType}</p>
        <h2 className="mt-2 text-3xl font-medium tracking-normal sm:text-4xl lg:text-5xl">{product.name}</h2>
      </header>

      <div className="mx-auto grid max-w-7xl gap-9 px-4 pb-12 md:px-8 md:pb-16 lg:grid-cols-[1.04fr_.96fr] lg:gap-14 lg:pb-20">
        <ProductGallery product={product} />

        <div className="min-w-0">
          <p className="text-base leading-7 text-foreground/78 sm:text-lg">{product.description}</p>

          {product.platforms ? (
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
              <p className="mt-2"><span className="font-medium text-white">License:</span> {product.license}</p>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-5 border-l-2 border-primary bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">{product.priceNote}</p>
              <p className="mt-1 text-xl font-medium text-primary">{product.price}</p>
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.1em] text-accent uppercase">{product.status}</p>
            </div>
            {product.checkoutUrl ? (
              <a
                href={product.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-accent"
              >
                Preview checkout
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex min-h-12 items-center justify-center border border-border px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase" aria-label="Checkout is not configured yet">
                Checkout pending
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function StoreCatalog() {
  const [category, setCategory] = useState<CategoryFilter>('All')
  const products = useMemo(
    () => category === 'All' ? storeProducts : storeProducts.filter((product) => product.category === category),
    [category],
  )

  return (
    <>
      <div className="sticky top-[5.5rem] z-30 border-b border-primary/60 bg-background/95 px-4 py-3 backdrop-blur md:top-[7.5rem] md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto scrollbar-none">
          {storeCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`shrink-0 border px-4 py-2 font-mono text-[0.66rem] tracking-[0.12em] uppercase transition-colors ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-accent hover:text-accent'}`}
            >
              {item}
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase sm:block">{products.length} products</span>
        </div>
      </div>

      <section aria-live="polite">
        {products.map((product) => <ProductSection key={product.id} product={product} />)}
      </section>

      <section className="border-y-2 border-primary/80 bg-[linear-gradient(90deg,rgba(255,46,159,.08),transparent_40%,rgba(0,245,255,.07))]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.16em] text-primary uppercase">Xupply bundles</p>
            <h2 className="mt-2 text-2xl font-medium tracking-normal sm:text-3xl">Collections are being assembled.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Audio Starter, Creator Launch, and First Four bundles will appear after their final files, licenses, and pricing are verified.</p>
          </div>
          <span className="shrink-0 border border-accent/50 px-3 py-2 font-mono text-[0.64rem] tracking-[0.14em] text-accent uppercase">Coming after QA</span>
        </div>
      </section>
    </>
  )
}
