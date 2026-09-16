'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { planetXTrack } from '@/lib/client-analytics'

type GoogleAnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

export function SiteAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`
    if (!path || lastPath.current === path) return

    const previousPath = lastPath.current
    lastPath.current = path

    planetXTrack('page_view', {
      path,
      referrer: document.referrer || null,
      source: 'planet-x.co',
    })

    // The initial page view is sent by gtag('config'). Send subsequent
    // App Router navigations explicitly so GA4 sees SPA page transitions too.
    if (previousPath !== null) {
      const googleWindow = window as GoogleAnalyticsWindow
      googleWindow.gtag?.('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}
