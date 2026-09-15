import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { StoreProduct } from '@/lib/store-data'
import { productPath, storefrontBrand } from '@/lib/store-catalog'

export function StoreProductCard({ product }: { product: StoreProduct }) {
  const image = product.gallery[0]
  const href = productPath(product)

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#070a12]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`${image.fit === 'contain' ? 'object-contain p-3' : 'object-cover'} transition duration-500 group-hover:scale-[1.02]`}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[9px] font-bold tracking-[.14em] text-white/80 uppercase backdrop-blur">
            {storefrontBrand(product)}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold tracking-[.14em] text-cyan-300 uppercase">
                {product.category}
              </p>
              <h3 className="mt-2 text-lg font-bold tracking-[-.02em] text-white">{product.name}</h3>
            </div>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/35 transition group-hover:text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{product.description}</p>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="font-mono text-[9px] tracking-[.14em] text-white/35 uppercase">{product.priceNote}</p>
              <p className="mt-1 font-mono text-base font-bold text-primary">{product.price}</p>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-[.12em] text-white/70 uppercase">View product</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
