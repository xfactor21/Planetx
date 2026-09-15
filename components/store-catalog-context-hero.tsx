'use client'

import { StoreCatalog } from '@/components/store-catalog'
import { storeProducts } from '@/lib/store-data'

const approvedContextHero = {
  src: '/store/listings/context-pro-hero-v1410.svg',
  alt: 'conteXt encrypted developer workspace product banner',
  label: 'Product banner',
  fit: 'cover' as const,
}

const contextProduct = storeProducts.find((product) => product.id === 'context-pro')
if (
  contextProduct &&
  contextProduct.gallery[0]?.src !== approvedContextHero.src &&
  !contextProduct.gallery.some((image) => image.src === approvedContextHero.src)
) {
  contextProduct.gallery.unshift(approvedContextHero)
}

export function StoreCatalogWithContextHero() {
  return <StoreCatalog />
}
