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
    '/visual-x',
    '/coming-soon',
  ]

  return routes.map((route): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/visual-x' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/store' || route === '/beta' || route === '/visual-x' ? 0.9 : 0.7,
  }))
}
