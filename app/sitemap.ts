import type { MetadataRoute } from 'next'
import { releasedApps, upcomingApps } from '@/lib/data'

const siteUrl = 'https://www.planet-x.co'

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = [
    '',
    '/store',
    '/beta',
    '/music',
    '/about',
    '/studyhive',
    '/coming-soon',
    '/visual-x',
  ]

  const productRoutes = [
    ...releasedApps
      .filter((app) => !app.mature && app.id !== 'studyhive')
      .map((app) => `/apps/${app.id}`),
    ...upcomingApps
      .filter((app) => !app.companionSlot)
      .map((app) => `/apps/${app.id}`),
  ]

  return [...coreRoutes, ...productRoutes].map((route): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === '' || route === '/visual-x' ? 'weekly' : 'monthly',
    priority:
      route === ''
        ? 1
        : route === '/store' || route === '/beta' || route === '/visual-x'
          ? 0.9
          : route.startsWith('/apps/')
            ? 0.8
            : 0.7,
  }))
}
