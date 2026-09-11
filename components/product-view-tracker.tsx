'use client'

import { useEffect } from 'react'
import { planetXTrack } from '@/lib/client-analytics'

export function ProductViewTracker({
  productId,
  productName,
  productStatus,
}: {
  productId: string
  productName: string
  productStatus: string
}) {
  useEffect(() => {
    planetXTrack('product_view', {
      product_id: productId,
      product_name: productName,
      product_status: productStatus,
    })
  }, [productId, productName, productStatus])

  return null
}
