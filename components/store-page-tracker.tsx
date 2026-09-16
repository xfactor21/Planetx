'use client'

import { useEffect } from 'react'
import { planetXTrack } from '@/lib/client-analytics'
import { pinterestTrack, pinterestTrackCustom } from '@/lib/pinterest-events'

type TrackingValue = string | number | boolean | null

export function StorePageTracker({
  event,
  properties = {},
}: {
  event: string
  properties?: Record<string, TrackingValue>
}) {
  const serialized = JSON.stringify(properties)

  useEffect(() => {
    const parsed = JSON.parse(serialized) as Record<string, TrackingValue>

    planetXTrack(event, parsed, {
      sourceSurface: 'store',
    })

    if (event === 'store_view' || event === 'category_view') {
      pinterestTrack('ViewCategory', {
        product_category: typeof parsed.category === 'string' ? parsed.category : 'planet.X Store',
      })
    }

    if (event === 'product_view' || event === 'article_view') {
      pinterestTrack('ViewContent', {
        product_id: typeof parsed.product_id === 'string' ? parsed.product_id : undefined,
        product_name: typeof parsed.product_name === 'string' ? parsed.product_name : undefined,
        product_category: typeof parsed.category === 'string' ? parsed.category : undefined,
      })
    }

    if (event === 'product_view') {
      pinterestTrackCustom('product_view', {
        product_id: typeof parsed.product_id === 'string' ? parsed.product_id : undefined,
        product_name: typeof parsed.product_name === 'string' ? parsed.product_name : undefined,
        category: typeof parsed.category === 'string' ? parsed.category : undefined,
        product_status: typeof parsed.product_status === 'string' ? parsed.product_status : undefined,
      })
    }
  }, [event, serialized])

  return null
}
