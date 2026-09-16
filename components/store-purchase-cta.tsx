'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { ArrowUpRight, MonitorSmartphone, ShoppingBag } from 'lucide-react'
import { planetXTrack } from '@/lib/client-analytics'
import { pinterestTrackCustom } from '@/lib/pinterest-events'

type CheckoutMap = Record<string, string>

type StorePurchaseCtaProps = {
  productId: string
  productName: string
  mode: 'chrome' | 'payhip' | 'coming-soon'
  checkoutUrl?: string
}

function trackProductCta(productId: string, productName: string, ctaLabel: string) {
  planetXTrack('product_cta_click', {
    product_id: productId,
    product_name: productName,
    cta_label: ctaLabel,
  }, { sourceSurface: 'store_product' })
}

function payhipProductKey(url?: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'payhip.com' && parsed.hostname !== 'www.payhip.com') return null
    return parsed.pathname.match(/^\/b\/([^/?#]+)/)?.[1] ?? null
  } catch {
    return null
  }
}

export function StorePurchaseCta({ productId, productName, mode, checkoutUrl }: StorePurchaseCtaProps) {
  const [checkoutMap, setCheckoutMap] = useState<CheckoutMap>({})
  const [payhipReady, setPayhipReady] = useState(false)
  const [payhipFailed, setPayhipFailed] = useState(false)

  useEffect(() => {
    if (mode !== 'payhip') return
    let cancelled = false

    fetch('/api/store-checkouts')
      .then((response) => response.json())
      .then((payload: { checkouts?: CheckoutMap }) => {
        if (!cancelled) setCheckoutMap(payload.checkouts ?? {})
      })
      .catch(() => {
        if (!cancelled) setCheckoutMap({})
      })

    return () => { cancelled = true }
  }, [mode])

  if (mode === 'coming-soon') {
    return <span className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 py-3 font-mono text-[11px] font-bold tracking-[.14em] text-white/45 uppercase">Coming soon</span>
  }

  if (mode === 'chrome' && checkoutUrl) {
    return (
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackProductCta(productId, productName, 'open_chrome_web_store')
          planetXTrack('external_app_launch', { product_id: productId, product_name: productName, destination: 'chrome_web_store' }, { sourceSurface: 'store_product' })
          pinterestTrackCustom('external_app_launch', {
            product_id: productId,
            product_name: productName,
            destination: 'chrome_web_store',
          })
        }}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white uppercase shadow-[0_8px_30px_rgba(255,43,138,.24)] transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <MonitorSmartphone className="size-4" aria-hidden="true" />
        Open Chrome Web Store
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    )
  }

  const embeddedCheckoutUrl = checkoutMap[productId] ?? checkoutUrl
  const embeddedProductKey = payhipProductKey(embeddedCheckoutUrl)

  return (
    <>
      <Script
        src="https://payhip.com/payhip.js"
        strategy="afterInteractive"
        onLoad={() => { setPayhipReady(true); setPayhipFailed(false) }}
        onReady={() => { setPayhipReady(true); setPayhipFailed(false) }}
        onError={() => { setPayhipReady(false); setPayhipFailed(true) }}
      />
      {embeddedCheckoutUrl && embeddedProductKey && payhipReady ? (
        <a
          href={embeddedCheckoutUrl}
          className="payhip-buy-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white uppercase shadow-[0_8px_30px_rgba(255,43,138,.24)] transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          data-theme="none"
          data-product={embeddedProductKey}
          onClick={() => {
            trackProductCta(productId, productName, 'buy_now')
            planetXTrack('checkout_started', { product_id: productId, product_name: productName, checkout_mode: 'embedded' }, { sourceSurface: 'store_product' })
            pinterestTrackCustom('checkout_started', {
              product_id: productId,
              product_name: productName,
              checkout_mode: 'embedded',
            })
          }}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Buy Now
        </a>
      ) : embeddedCheckoutUrl && !payhipFailed ? (
        <button type="button" disabled className="inline-flex min-h-12 cursor-wait items-center justify-center rounded-lg border border-white/15 px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/45 uppercase">Loading secure checkout…</button>
      ) : (
        <button type="button" disabled className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-lg border border-white/15 px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white/35 uppercase">Checkout unavailable</button>
      )}
    </>
  )
}
