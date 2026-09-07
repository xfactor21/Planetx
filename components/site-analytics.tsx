'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { planetXTrack } from '@/lib/client-analytics'

export function SiteAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const query = searchParams.toString()
    const path = query ? `${pathname}?${query}` : pathname
    if (!path || lastPath.current === path) return

    lastPath.current = path
    planetXTrack('page_view', {
      path,
      referrer: document.referrer || null,
      source: 'planet-x.co',
    })
  }, [pathname, searchParams])

  return null
}
