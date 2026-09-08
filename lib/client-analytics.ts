'use client'

import { track } from '@vercel/analytics'

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

type AnalyticsEnvelope = {
  event: string
  timestamp: string
  source_product: string
  source_surface: string
  session_id: string
  anonymous_user_id: string
  path: string
  platform: string
  properties: Record<string, string | number | boolean | null>
}

const SESSION_KEY = 'planetx:analytics-session-id'
const USER_KEY = 'planetx:analytics-anonymous-user-id'

function getOrCreateStorageId(key: string, storage: Storage) {
  let value = storage.getItem(key)
  if (!value) {
    value = crypto.randomUUID()
    storage.setItem(key, value)
  }
  return value
}

function cleanProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>
}

function getPlatform() {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent.toLowerCase()
  if (/ipad|tablet/.test(ua)) return 'tablet'
  if (/mobi|android|iphone/.test(ua)) return 'mobile'
  return 'desktop'
}

export function planetXTrack(
  event: string,
  properties: AnalyticsProperties = {},
  options: { sourceProduct?: string; sourceSurface?: string } = {},
) {
  const cleaned = cleanProperties(properties)

  // Keep Vercel Analytics as the quick web-analytics view.
  track(event, cleaned)

  if (typeof window === 'undefined') return

  let sessionId = ''
  let anonymousUserId = ''
  try {
    sessionId = getOrCreateStorageId(SESSION_KEY, window.sessionStorage)
    anonymousUserId = getOrCreateStorageId(USER_KEY, window.localStorage)
  } catch {
    // Analytics must never block product behavior if storage is unavailable.
    sessionId = crypto.randomUUID()
    anonymousUserId = crypto.randomUUID()
  }

  const payload: AnalyticsEnvelope = {
    event,
    timestamp: new Date().toISOString(),
    source_product: options.sourceProduct || 'planet-x.co',
    source_surface: options.sourceSurface || 'website',
    session_id: sessionId,
    anonymous_user_id: anonymousUserId,
    path: `${window.location.pathname}${window.location.search}`,
    platform: getPlatform(),
    properties: cleaned,
  }

  // Fire-and-forget through our same-origin proxy so the shared dashboard key
  // remains server-side. Vercel Analytics still receives its copy above.
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}
