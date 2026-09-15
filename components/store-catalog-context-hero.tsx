'use client'

import { StoreCatalog } from '@/components/store-catalog'
import { storeProducts } from '@/lib/store-data'

const contextProduct = storeProducts.find((product) => product.id === 'context-pro')
const approvedContextHero = {
  src: '/store/listings/context-pro-hero-v1410.svg',
  alt: 'conteXt encrypted developer workspace product banner',
  label: 'Product banner',
  fit: 'cover' as const,
}

if (contextProduct) {
  contextProduct.gallery = [
    approvedContextHero,
    ...contextProduct.gallery.filter((image) => image.src !== approvedContextHero.src),
  ]
}

export function StoreCatalogWithContextHero() {
  return <StoreCatalog />
}
