'use client'

type PinterestValue = string | number | boolean | null | undefined

type PinterestPayload = Record<string, PinterestValue | PinterestValue[] | Record<string, PinterestValue>[]>

declare global {
  interface Window {
    pintrk?: (...args: unknown[]) => void
  }
}

export function pinterestTrackCustom(event: string, payload: PinterestPayload = {}) {
  if (typeof window === 'undefined' || typeof window.pintrk !== 'function') return

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )

  window.pintrk('track', 'custom', {
    event,
    ...cleanPayload,
  })
}
