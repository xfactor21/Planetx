import type { StoreProduct } from '@/lib/store-data'

export const sessionGridProduct: StoreProduct = {
  id: 'sessiongrid-x',
  name: 'SessionGrid X',
  category: 'Software',
  productType: 'Chrome extension · tab & workspace manager',
  description:
    'Save complete Chrome workspaces, restore windows and native tab groups, recover session snapshots, search saved context, and keep duplicate tabs under control without uploading browsing data to a cloud service.',
  price: 'Free',
  priceNote: 'Chrome extension',
  status: 'Available free',
  platforms: ['Chrome extension'],
  metrics: [
    { value: 'Chrome', label: 'Extension' },
    { value: 'Local', label: 'Browsing data' },
    { value: 'Free', label: 'Install' },
  ],
  includes: [
    'Complete workspace save and restore with pinned tabs and native Chrome tab groups',
    'Permanent Free tier with saved-workspace and recovery-snapshot support',
    'Search across workspace names, tab titles, URLs, notes, and tags where available',
    'Duplicate-tab detection and local JSON backup',
    'Optional Pro unlock for larger workspace and snapshot limits, notes, and tags',
    'Pro adds Archive + Close, Markdown export, and configurable recovery intervals',
  ],
  bestFor: ['Heavy-tab workflows', 'Research sessions', 'Multi-project browser work'],
  format: 'Chrome extension / Manifest V3',
  license: 'Install free from the Chrome Web Store. Browsing data stays local. Optional Pro licensing is available from the private upgrade flow inside the extension.',
  gallery: [
    {
      src: '/store/listings/sessiongrid-x-logo.svg',
      alt: 'SessionGrid X product identity',
      label: 'Product identity',
      fit: 'contain',
    },
    {
      src: '/store/listings/sessiongrid-x-workflow.svg',
      alt: 'SessionGrid X save, search, and restore workflow',
      label: 'Workspace workflow',
      fit: 'cover',
    },
    {
      src: '/store/listings/sessiongrid-x-privacy.svg',
      alt: 'SessionGrid X local-first privacy model',
      label: 'Local-first privacy',
      fit: 'cover',
    },
  ],
  checkoutUrl: 'https://chromewebstore.google.com/detail/sessiongrid-x/gghgjnmclndonogigpahmgopldpomcel',
}
