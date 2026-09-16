export type AfterHoursProductImage = {
  src: string
  alt: string
  label?: string
}

export type AfterHoursMetric = {
  label: string
  value: number
}

export type AfterHoursProduct = {
  id: string
  name: string
  category: string
  description: string
  price: string
  priceNote?: string
  image?: AfterHoursProductImage
  gallery?: AfterHoursProductImage[]
  metrics?: AfterHoursMetric[]
  href?: string
  status?: string
  safeName?: string
  safeDescription?: string
  ctaLabel?: string
}

/**
 * Adult-only store inventory lives here instead of the public Xupply catalog.
 * Keep this list independent so the After Hours storefront can change providers,
 * merchandising, checkout behavior, and visual merchandising without affecting
 * the main planet.X / Xupply catalog.
 *
 * Privacy-mode fields are optional. When safeName/safeDescription are absent,
 * the UI falls back to deliberately generic discreet labels rather than inventing
 * alternate product claims.
 */
export const afterHoursProducts: AfterHoursProduct[] = []
