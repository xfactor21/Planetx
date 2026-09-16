export type AfterHoursProduct = {
  id: string
  name: string
  category: string
  description: string
  price: string
  priceNote?: string
  image?: {
    src: string
    alt: string
  }
  href?: string
  status?: string
}

/**
 * Adult-only store inventory lives here instead of the public Xupply catalog.
 * Keep this list independent so the After Hours storefront can change providers,
 * merchandising, and checkout behavior without affecting the main planet.X store.
 */
export const afterHoursProducts: AfterHoursProduct[] = []
