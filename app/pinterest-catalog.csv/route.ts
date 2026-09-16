import { allStoreProducts, isChromeStoreProduct, numericPrice, productPath, publicCheckoutUrl } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'

const csv = (value: string | number) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const dynamic = 'force-static'

export function GET() {
  const headers = ['id', 'title', 'description', 'link', 'image_link', 'price', 'availability']

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
