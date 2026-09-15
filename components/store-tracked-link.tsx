'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { planetXTrack } from '@/lib/client-analytics'

type TrackingValue = string | number | boolean | null | undefined

export function StoreTrackedLink({
  href,
  event,
  properties,
  className,
  children,
}: {
  href: string
  event: 'related_product_click' | 'bundle_cta_click'
  properties?: Record<string, TrackingValue>
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => planetXTrack(event, properties, { sourceSurface: 'store' })}
    >
      {children}
    </Link>
  )
}
