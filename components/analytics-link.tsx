'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { planetXTrack } from '@/lib/client-analytics'

type AnalyticsEventName =
  | 'product_cta_click'
  | 'beta_cta_click'
  | 'external_app_launch'
  | 'visual_x_interest_click'

export function AnalyticsLink({
  href,
  event,
  properties,
  external = false,
  className,
  children,
}: {
  href: string
  event: AnalyticsEventName
  properties?: Record<string, string | number | boolean | null | undefined>
  external?: boolean
  className?: string
  children: ReactNode
}) {
  const onClick = () => {
    planetXTrack(event, properties)
    if (external && event !== 'external_app_launch') {
      planetXTrack('external_app_launch', properties)
    }
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}
