'use client'

import { useEffect } from 'react'
import { planetXTrack } from '@/lib/client-analytics'

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
    planetXTrack(event, JSON.parse(serialized) as Record<string, TrackingValue>, {
      sourceSurface: 'store',
    })
  }, [event, serialized])

  return null
}
