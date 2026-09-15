import type { MetadataRoute } from 'next'
import { releasedApps, upcomingApps } from '@/lib/data'
import { allStoreProducts, productPath } from '@/lib/store-catalog'

const siteUrl = 'https://www.planet-x.co'
export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = ['', '/store', '/store/software', '/store/audio-fx', '/store/creator-resources', '/store/free', '/store/free/indie-extension-release-checklist', '/guides', '/guides/chrome-web-store-listing-checklist', '/guides/chrome-extension-screenshot-guide', '/beta', '/music', '/about', '/studyhive', '/coming-soon', '/visual-x', '/build-notes']
  const appRoutes = [...releasedApps.filter((app) => !app.mature && app.id !== 'studyhive').map((app) => `/apps/${app.id}`), ...upcomingApps.filter((app) => !app.companionSlot).map((app) => `/apps/${app.id}`)]
  const storeProductRoutes = allStoreProducts.map(productPath)
  return [...new Set([...coreRoutes, ...appRoutes, ...storeProductRoutes])].map((route): MetadataRoute.Sitemap[number] => ({ url: `${siteUrl}${route}`, changeFrequency: route === '' || route === '/store' || route === '/visual-x' || route.startsWith('/guides/') ? 'weekly' : 'monthly', priority: route === '' ? 1 : route === '/store' || route === '/visual-x' ? 0.9 : route.startsWith('/store/') || route.startsWith('/apps/') ? 0.8 : 0.7 }))
}
