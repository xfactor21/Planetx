'use client'

import { useEffect, useState } from 'react'
import type { ProductGalleryImage } from '@/lib/store-data'

type StoreProductMediaProps = {
  productId: string
  productName: string
  gallery: ProductGalleryImage[]
  eyebrow?: string
  description?: string
}

export function StoreProductMedia({ productId, productName, gallery, eyebrow, description }: StoreProductMediaProps) {
  const images = gallery.filter((image) => Boolean(image.src))
  const [imageIndex, setImageIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const image = images[imageIndex] ?? images[0]

  useEffect(() => {
    setImageIndex(0)
    setCycleKey((value) => value + 1)
  }, [productId])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener?.('change', sync)
    return () => query.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    if (reduceMotion || images.length <= 1) return
    const timer = window.setInterval(() => {
      setImageIndex((index) => (index + 1) % images.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [productId, images.length, reduceMotion, cycleKey])

  const selectImage = (index: number) => {
    setImageIndex(index)
    setCycleKey((value) => value + 1)
  }

  if (!image) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ff007f]/25 bg-[#080b13] shadow-[0_28px_90px_-45px_rgba(255,0,127,.65)]">
      <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden sm:min-h-[430px] xl:min-h-[500px]">
        <img
          key={`${productId}-${imageIndex}`}
          src={image.src}
          alt={image.alt}
          decoding="async"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${image.fit === 'contain' ? 'object-contain p-4 sm:p-6' : 'object-cover'}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[.03] via-black/[.06] to-black/45" />
        {(eyebrow || description) ? (
          <div className="relative z-10 m-4 max-w-2xl rounded-xl border border-white/10 bg-[#050711]/75 p-4 shadow-2xl backdrop-blur-[6px] sm:m-6 sm:p-5">
            {eyebrow ? <p className="font-mono text-[10px] font-bold tracking-[.16em] text-cyan-300 uppercase">{eyebrow}</p> : null}
            <h2 className="mt-1.5 text-xl font-bold tracking-[-.025em] text-white sm:text-2xl">{productName}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-white/72">{description}</p> : null}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex items-center gap-3 overflow-x-auto border-t border-white/[.07] bg-black/45 px-4 py-4 sm:px-5">
          {images.map((item, index) => (
            <button
              key={`${productId}-${item.src}`}
              type="button"
              onClick={() => selectImage(index)}
              aria-label={`Show ${item.label}`}
              aria-pressed={index === imageIndex}
              className="h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-black/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:h-[72px] sm:w-28"
              style={{
                borderColor: index === imageIndex ? '#ff007f' : 'rgba(255,255,255,.16)',
                opacity: index === imageIndex ? 1 : 0.66,
                boxShadow: index === imageIndex ? '0 0 14px rgba(255,0,127,.55)' : undefined,
              }}
            >
              <img src={item.src} alt="" loading="lazy" className={`h-full w-full ${item.fit === 'contain' ? 'object-contain p-1' : 'object-cover'}`} />
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 font-mono text-[9px] tracking-[.15em] text-white/35 uppercase sm:block">
            {reduceMotion ? 'Manual preview' : 'Auto 4s'} · {imageIndex + 1}/{images.length}
          </span>
        </div>
      ) : null}
    </div>
  )
}
