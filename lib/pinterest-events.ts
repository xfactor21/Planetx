'use client'

type PinterestValue = string | number | boolean | null | undefined

type PinterestPayload = Record<string, PinterestValue | PinterestValue[] | Record<string, PinterestValue>[]>
export type PinterestStandardEvent =
  | 'PageVisit'
  | 'ViewCategory'
  | 'ViewContent'
  | 'Search'
  | 'Lead'
  | 'SignUp'
  | 'StartTrial'
  | 'Subscribe'
  | 'WatchVideo'
  | 'InitiateCheckout'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'AddPaymentInfo'
  | 'Contact'

declare global {
  interface Window {
    pintrk?: (...args: unknown[]) => void
  }
}

function clean(payload: PinterestPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

/** Send a Pinterest-defined event suitable for conversion reporting/optimization. */
export function pinterestTrack(event: PinterestStandardEvent, payload: PinterestPayload = {}) {
  if (typeof window === 'undefined' || typeof window.pintrk !== 'function') return
  window.pintrk('track', event, clean(payload))
}

/** Keep planet.X-specific events available for custom reporting alongside standard events. */
export function pinterestTrackCustom(event: string, payload: PinterestPayload = {}) {
  if (typeof window === 'undefined' || typeof window.pintrk !== 'function') return
  window.pintrk('track', 'custom', {
    event,
    ...clean(payload),
  })
}
