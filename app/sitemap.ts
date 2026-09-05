import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.planet-x.co'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/store',
    '/beta',
    '/music',
    '/about',
    '/studyhive',
    '/coming-soon',
  ]

  return routes.map((route): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/store' || route === '/beta' ? 0.9 : 0.7,
  }))
}
