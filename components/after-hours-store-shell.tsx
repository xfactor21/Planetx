'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, MoonStar, ShieldCheck } from 'lucide-react'
import { afterHoursProducts } from '@/lib/after-hours-store-data'

const AGE_KEY = 'planetx-after-hours-18'

export function AfterHoursStoreShell() {
  const [confirmed, setConfirmed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    try {
      setConfirmed(window.sessionStorage.getItem(AGE_KEY) === 'yes')
    } catch {
      setConfirmed(false)
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(afterHoursProducts.map((product) => product.category)))],
    [],
  )

  const visibleProducts = useMemo(
    () => selectedCategory === 'All'
      ? afterHoursProducts
      : afterHoursProducts.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  )

  const confirmAdult = () => {
    try {
      window.sessionStorage.setItem(AGE_KEY, 'yes')
    } catch {
      // Session persistence is optional; access should still work.
    }
    setConfirmed(true)
  }

  if (!confirmed) {
    return (
      <section className="relative flex min-h-[68vh] items-center overflow-hidden border-b border-white/10 bg-[#030305] px-5 py-16 text-white sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-10 size-[460px] rounded-full bg-fuchsia-500/15 blur-[115px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-violet-500/12 blur-[125px]" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-fuchsia-300/20 bg-black/55 p-7 shadow-[0_0_80px_-35px_rgba(236,72,153,.7)] backdrop-blur sm:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold tracking-[.18em] text-fuchsia-300 uppercase">
            <LockKeyhole className="size-4" aria-hidden="true" /> 18+ section
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[-.045em] sm:text-6xl">After Hours</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
            This section contains adult novelty products and is intended for adults only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={confirmAdult}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white uppercase shadow-[0_10px_35px_rgba(236,72,153,.3)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
            >
              Enter After Hours
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <Link href="/store" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/70 uppercase transition hover:border-white/30 hover:text-white">
              Back to Store
            </Link>
          </div>
          <p className="mt-5 text-xs leading-5 text-white/35">By entering, you confirm that you are at least 18 years old.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#030305] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.045) 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 -top-24 size-[460px] rounded-full bg-pink-500/15 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-20 size-[520px] rounded-full bg-violet-500/12 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:py-24">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[.2em] text-fuchsia-300 uppercase">
              <MoonStar className="size-4" aria-hidden="true" /> planet.X / 18+
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.045em] sm:text-5xl lg:text-6xl">After Hours</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              A separate adults-only catalog for novelty products, kept apart from the public Xupply inventory and software store.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/store" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/15 bg-white/[.03] px-5 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/80 uppercase transition hover:border-fuchsia-300/35 hover:text-white">
                Back to main store
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['Access', 'Adults 18+ only'],
              ['Catalog', 'Separate inventory source'],
              ['Collection', 'After Hours'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                <p className="font-mono text-[9px] tracking-[.15em] text-white/35 uppercase">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white/85">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030305] px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.18em] text-fuchsia-300 uppercase">After Hours catalog</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-.035em]">A different shelf entirely.</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[.14em] text-white/35 uppercase">
              <ShieldCheck className="size-4 text-fuchsia-300" aria-hidden="true" /> 18+ inventory
            </div>
          </div>

          {categories.length > 1 ? (
            <nav className="mt-8 flex gap-2 overflow-x-auto" aria-label="After Hours categories">
              {categories.map((category) => {
                const active = category === selectedCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className="shrink-0 rounded-full px-4 py-2 font-mono text-[10px] font-bold tracking-[.1em] uppercase transition"
                    style={{ border: `1px solid ${active ? '#e879f9' : 'rgba(255,255,255,.14)'}`, background: active ? 'rgba(232,121,249,.12)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,.48)' }}
                  >
                    {category}
                  </button>
                )
              })}
            </nav>
          ) : null}

          {visibleProducts.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
                  <div className="aspect-[16/10] bg-[#090912]">
                    {product.image ? <img src={product.image.src} alt={product.image.alt} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-[.18em] text-white/30 uppercase">After Hours</div>}
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[9px] font-bold tracking-[.14em] text-fuchsia-300 uppercase">{product.category}</p>
                    <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">{product.description}</p>
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
                      <div>
                        {product.priceNote ? <p className="font-mono text-[9px] tracking-[.12em] text-white/35 uppercase">{product.priceNote}</p> : null}
                        <p className="mt-1 font-mono text-base font-bold text-fuchsia-300">{product.price}</p>
                      </div>
                      {product.href ? <Link href={product.href} className="font-mono text-[10px] font-bold tracking-[.12em] text-white/70 uppercase hover:text-white">View →</Link> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-fuchsia-300/20 bg-fuchsia-400/[.025] p-8 sm:p-10">
              <p className="font-mono text-[10px] font-bold tracking-[.16em] text-fuchsia-300 uppercase">Catalog ready</p>
              <h3 className="mt-3 text-2xl font-bold">No After Hours products are published yet.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">The storefront is wired to its own inventory source, so adult products can be added here without mixing them into Xupply, software, or the public store catalog.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
