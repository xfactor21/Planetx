import { sessionGridProduct } from '@/lib/sessiongrid-product'
import { storeProducts, type StoreCategory, type StoreProduct } from '@/lib/store-data'

export type StoreCategorySlug = 'software' | 'audio-fx' | 'creator-resources'

export const CONTEXT_CHROME_URL = 'https://chromewebstore.google.com/detail/context-encrypted-credent/ikedbigbancjamohakblaclcoljlhdbn'
export const XUPPLY_LICENSE_PATH = '/license/xupply'

const XUPPLY_ASSET_LICENSE_SUMMARY =
  'Licensed under the official Xupply Asset License. Personal and commercial end-product use is allowed; the source assets themselves may not be resold, shared, redistributed, sublicensed, or repackaged as standalone or competing assets.'

const XUPPLY_UTILITY_LICENSE_SUMMARY =
  'Licensed to one purchaser for personal and commercial use. You may use Creator Asset Forge and its exported results in your own and client projects, but you may not resell, redistribute, sublicense, or share the utility itself as a standalone product.'

export const PAYHIP_CHECKOUTS: Record<string, string> = {
  'essential-ui-sounds': 'https://payhip.com/b/CIwxS',
  'digital-glitch-fx': 'https://payhip.com/b/ROlqw',
  'indie-launch-kit': 'https://payhip.com/b/7cJjO',
  'creator-asset-forge': 'https://payhip.com/b/3K5at',
  'creator-stream-pack': 'https://payhip.com/b/tA5To',
  'interface-hud-kit': 'https://payhip.com/b/BCK4P',
  'website-atmosphere-pack': 'https://payhip.com/b/49vW6',
  'creator-editing-overlays': 'https://payhip.com/b/NGUKi',
  'digital-worlds-wallpapers': 'https://payhip.com/b/6x4EO',
  'producer-transitions-impacts': 'https://payhip.com/b/PcOWp',
}

const CATEGORY_SLUGS: Record<StoreCategory, StoreCategorySlug> = {
  Software: 'software',
  'Audio & FX': 'audio-fx',
  'Creator Resources': 'creator-resources',
}

const PRODUCT_SLUGS: Record<string, string> = {
  'sessiongrid-x': 'sessiongrid-x',
  'context-pro': 'context',
  'project-x': 'project-x',
  'essential-ui-sounds': 'essential-ui-sounds-vol-1',
  'digital-glitch-fx': 'digital-glitch-transition-fx-vol-1',
  'indie-launch-kit': 'indie-app-creator-launch-kit',
  'creator-asset-forge': 'creator-asset-forge',
  'creator-stream-pack': 'creator-stream-pack',
  'interface-hud-kit': 'interface-hud-kit',
  'website-atmosphere-pack': 'website-atmosphere-pack',
  'creator-editing-overlays': 'creator-editing-overlays',
  'digital-worlds-wallpapers': 'digital-worlds-wallpaper-pack',
  'producer-transitions-impacts': 'producer-transitions-impacts-vol-1',
}

const RELATED_PRODUCT_IDS: Record<string, string[]> = {
  'sessiongrid-x': ['context-pro', 'indie-launch-kit', 'interface-hud-kit'],
  'context-pro': ['sessiongrid-x', 'indie-launch-kit', 'website-atmosphere-pack'],
  'project-x': ['sessiongrid-x', 'context-pro', 'website-atmosphere-pack'],
  'essential-ui-sounds': ['producer-transitions-impacts', 'digital-glitch-fx', 'interface-hud-kit'],
  'digital-glitch-fx': ['producer-transitions-impacts', 'essential-ui-sounds', 'creator-editing-overlays'],
  'indie-launch-kit': ['creator-asset-forge', 'interface-hud-kit', 'creator-editing-overlays'],
  'creator-asset-forge': ['indie-launch-kit', 'creator-editing-overlays', 'website-atmosphere-pack'],
  'creator-stream-pack': ['creator-editing-overlays', 'essential-ui-sounds', 'digital-glitch-fx'],
  'interface-hud-kit': ['website-atmosphere-pack', 'essential-ui-sounds', 'creator-editing-overlays'],
  'website-atmosphere-pack': ['interface-hud-kit', 'digital-worlds-wallpapers', 'creator-editing-overlays'],
  'creator-editing-overlays': ['creator-stream-pack', 'digital-glitch-fx', 'website-atmosphere-pack'],
  'digital-worlds-wallpapers': ['website-atmosphere-pack', 'creator-editing-overlays', 'interface-hud-kit'],
  'producer-transitions-impacts': ['essential-ui-sounds', 'digital-glitch-fx', 'creator-editing-overlays'],
}

export const CATEGORY_CONTENT: Record<StoreCategorySlug, { category: StoreCategory; eyebrow: string; title: string; description: string; starterId: string; guideHref: string; guideLabel: string }> = {
  software: {
    category: 'Software',
    eyebrow: 'planet.X software',
    title: 'planet.X Software, Apps & Browser Tools',
    description: 'Software is the planet.X side of the store: browser tools, local utilities, and larger applications built to solve specific workflow problems. These products are not Xupply assets. Each listing explains the current platform, delivery path, privacy model, and release state so you can tell whether it is available now, free to install, or still in development before you click anything.',
    starterId: 'sessiongrid-x',
    guideHref: '/guides/chrome-web-store-listing-checklist',
    guideLabel: 'What a Chrome Web Store listing actually needs',
  },
  'audio-fx': {
    category: 'Audio & FX',
    eyebrow: 'Xupply by planet.X',
    title: 'UI Sounds, Stingers & Digital FX for Apps and Creators',
    description: 'Xupply audio packs are production assets rather than software. The current library focuses on interface feedback, transitions, impacts, glitches, and other short-form sounds that can drop into apps, games, videos, streams, trailers, and prototypes. Product pages list the real file counts, formats, sample rates, and preview media available in each pack instead of hiding the useful details behind marketing copy.',
    starterId: 'essential-ui-sounds',
    guideHref: '/store/free/indie-extension-release-checklist',
    guideLabel: 'Get the free Indie Extension Release Checklist',
  },
  'creator-resources': {
    category: 'Creator Resources',
    eyebrow: 'Xupply by planet.X',
    title: 'Creator Resources for Indie Developers & Technical Creators',
    description: 'Xupply creator resources are downloadable production systems: editable templates, interface kits, broadcast graphics, web effects, overlays, wallpapers, and launch materials. The goal is practical reuse. Each page shows what files are included, who the pack is intended for, what software or workflow it fits, and the real previews already available for the product.',
    starterId: 'indie-launch-kit',
    guideHref: '/guides/chrome-extension-screenshot-guide',
    guideLabel: 'How to build clear Chrome extension screenshots',
  },
}

const approvedContextHero = {
  src: '/store/listings/context-pro-hero-v1410.svg',
  alt: 'conteXt encrypted developer workspace product banner',
  label: 'Product banner',
  fit: 'cover' as const,
}

function normalizeStoreProduct(product: StoreProduct): StoreProduct {
  if (product.id === 'context-pro') {
    return {
      ...product,
      name: 'conteXt',
      productType: 'Encrypted developer workspace',
      price: 'Free',
      priceNote: 'Chrome extension',
      status: 'Available now',
      platforms: ['Chrome extension'],
      format: 'Chrome extension / Manifest V3',
      license: 'Install free from the Chrome Web Store. Existing local vault data remains on-device. Optional Pro licensing is available from the private in-extension upgrade flow.',
      checkoutUrl: CONTEXT_CHROME_URL,
      gallery: [
        approvedContextHero,
        ...product.gallery.filter((image) => image.src !== approvedContextHero.src),
      ],
    }
  }

  if (product.id === 'project-x') {
    return { ...product, checkoutUrl: undefined, status: 'Coming soon', priceNote: 'Planned release' }
  }

  if (product.id === 'creator-asset-forge') {
    return {
      ...product,
      category: 'Software',
      productType: 'Local browser utility',
      status: 'Available now',
      priceNote: product.priceNote === 'Proposed launch price' ? 'Current price' : product.priceNote,
      license: XUPPLY_UTILITY_LICENSE_SUMMARY,
      checkoutUrl: PAYHIP_CHECKOUTS[product.id],
    }
  }

  const usesAssetLicense = product.category === 'Audio & FX' || product.category === 'Creator Resources'
  const normalized = usesAssetLicense ? { ...product, license: XUPPLY_ASSET_LICENSE_SUMMARY } : product
  const verifiedCheckout = PAYHIP_CHECKOUTS[product.id]

  if (verifiedCheckout) {
    return {
      ...normalized,
      status: 'Available now',
      priceNote: normalized.priceNote === 'Proposed launch price' ? 'Current price' : normalized.priceNote,
      checkoutUrl: verifiedCheckout,
    }
  }

  return normalized
}

export const allStoreProducts = [sessionGridProduct, ...storeProducts].map(normalizeStoreProduct)
export function categorySlug(category: StoreCategory): StoreCategorySlug { return CATEGORY_SLUGS[category] }
export function productSlug(product: StoreProduct): string { return PRODUCT_SLUGS[product.id] ?? product.id }
export function productPath(product: StoreProduct): string { return `/store/${categorySlug(product.category)}/${productSlug(product)}` }
export function productsForCategory(slug: StoreCategorySlug): StoreProduct[] { return allStoreProducts.filter((product) => product.category === CATEGORY_CONTENT[slug].category) }
export function getProductByRoute(category: string, slug: string): StoreProduct | null { return allStoreProducts.find((product) => categorySlug(product.category) === category && productSlug(product) === slug) ?? null }
export function getProductById(id: string): StoreProduct | null { return allStoreProducts.find((product) => product.id === id) ?? null }
export function relatedProducts(product: StoreProduct, limit = 3): StoreProduct[] {
  const preferred = (RELATED_PRODUCT_IDS[product.id] ?? []).map(getProductById).filter((item): item is StoreProduct => Boolean(item))
  if (preferred.length >= limit) return preferred.slice(0, limit)
  const fallbacks = allStoreProducts.filter((candidate) => candidate.id !== product.id && !preferred.some((item) => item.id === candidate.id))
  return [...preferred, ...fallbacks].slice(0, limit)
}
export function storefrontBrand(product: StoreProduct): string { return product.category === 'Software' ? 'planet.X software' : 'Xupply by planet.X' }
export function usesXupplyLicense(product: StoreProduct): boolean { return product.id === 'creator-asset-forge' || product.category === 'Audio & FX' || product.category === 'Creator Resources' }
export function publicCheckoutUrl(product: StoreProduct): string | undefined { if (product.checkoutUrl?.includes('chromewebstore.google.com')) return product.checkoutUrl; return PAYHIP_CHECKOUTS[product.id] }
export function isChromeStoreProduct(product: StoreProduct): boolean { return publicCheckoutUrl(product)?.includes('chromewebstore.google.com') ?? false }
export function numericPrice(product: StoreProduct): string | null { const match = product.price.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/); return match?.[1] ?? (product.price.trim().toLowerCase() === 'free' ? '0' : null) }
export const FEATURED_PRODUCT_IDS = ['sessiongrid-x', 'context-pro', 'essential-ui-sounds', 'interface-hud-kit']
export const START_HERE_PRODUCT_IDS = ['sessiongrid-x', 'essential-ui-sounds', 'indie-launch-kit']
export const PRODUCT_OUTCOMES: Record<string, string> = {
  'sessiongrid-x': 'Close the tabs. Keep the context.',
  'context-pro': 'Keep developer credentials and project context encrypted on-device.',
  'project-x': 'See projects, repositories, deployments, files, and next actions in one workspace.',
  'essential-ui-sounds': 'Give interface actions clear feedback without digging through a giant sound library.',
  'digital-glitch-fx': 'Add matched glitch, transition, and motion effects to edits, streams, trailers, and demos.',
  'indie-launch-kit': 'Take an indie app from coming soon to launch without rebuilding every graphic and message.',
  'creator-asset-forge': 'Turn one source image into correctly sized creator assets locally in the browser.',
  'creator-stream-pack': 'Build a consistent stream package with editable scenes and original alert sounds.',
  'interface-hud-kit': 'Prototype technical interfaces with reusable HUD vectors and matching sounds.',
  'website-atmosphere-pack': 'Add standalone visual atmosphere to a site without a framework or dependency stack.',
  'creator-editing-overlays': 'Add reusable titles, captions, callouts, and CTA graphics to landscape and vertical video.',
  'digital-worlds-wallpapers': 'Use matched desktop and mobile digital-world artwork without stretching one layout across both.',
  'producer-transitions-impacts': 'Add focused risers, impacts, whooshes, glitches, and pulses to production work.',
}
export function productOutcome(product: StoreProduct): string { return PRODUCT_OUTCOMES[product.id] ?? product.description }
