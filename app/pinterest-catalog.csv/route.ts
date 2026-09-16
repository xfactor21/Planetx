import { allStoreProducts, isChromeStoreProduct, numericPrice, productPath, publicCheckoutUrl } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'

const csv = (value: string | number) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const googleProductCategory = (productId: string) => {
  switch (productId) {
    case 'creator-asset-forge':
      return 'Software > Computer Software'
    case 'essential-ui-sounds':
    case 'digital-glitch-fx':
    case 'producer-transitions-impacts':
      return 'Media > Music & Sound Recordings'
    case 'indie-launch-kit':
      return 'Software > Digital Goods & Currency > Document Templates'
    case 'digital-worlds-wallpapers':
      return 'Software > Digital Goods & Currency > Desktop Wallpaper'
    default:
      return 'Software > Digital Goods & Currency'
  }
}

export const dynamic = 'force-static'

export function GET() {
  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'price',
    'availability',
    'condition',
    'google_product_category',
  ]

  const rows = allStoreProducts
    .filter((product) => {
      const price = numericPrice(product)
      const checkout = publicCheckoutUrl(product)
      return price !== null && Number(price) > 0 && Boolean(checkout) && !isChromeStoreProduct(product) && product.id !== 'project-x'
    })
    .map((product) => {
      const price = Number(numericPrice(product)!)
      const image = product.gallery[0]?.src ? `${siteUrl}${product.gallery[0].src}` : `${siteUrl}/opengraph-image`
      return [
        product.id,
        product.name,
        product.description,
        `${siteUrl}${productPath(product)}`,
        image,
        `${price.toFixed(2)} USD`,
        'in stock',
        'new',
        googleProductCategory(product.id),
      ].map(csv).join(',')
    })

  return new Response([headers.join(','), ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="planetx-pinterest-catalog.csv"',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
