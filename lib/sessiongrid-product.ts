import type { StoreProduct } from '@/lib/store-data'

export const sessionGridProduct: StoreProduct = {
  id: 'sessiongrid-x',
  name: 'SessionGrid X',
  category: 'Software',
  productType: 'Chrome extension · tab & workspace manager',
  description:
    'Save complete Chrome workspaces, restore windows and native tab groups, recover session snapshots, search saved context, and keep duplicate tabs under control without uploading browsing data to a cloud service.',
  price: 'Free',
  priceNote: '7-day Pro trial → permanent Free mode',
  status: 'Available — 7-day Pro trial, then Free',
  platforms: ['Chrome extension'],
  metrics: [
    { value: '7 days', label: 'Pro trial' },
    { value: '1', label: 'Saved workstation in Free' },
    { value: '3', label: 'Recovery snapshots in Free' },
  ],
  includes: [
    'Complete workspace save and restore with pinned tabs and native Chrome tab groups',
    '7-day Pro trial, then permanent Free mode with 1 saved workstation and 3 recovery snapshots',
    'Search across workspace names, tab titles, URLs, notes, and tags where available',
    'Duplicate-tab detection and local JSON backup',
    'Optional Pro unlock for unlimited workspaces, larger snapshot limits, notes, and tags',
    'Pro adds Archive + Close, Markdown export, and configurable recovery intervals',
  ],
  bestFor: ['Heavy-tab workflows', 'Research sessions', 'Multi-project browser work'],
  format: 'Chrome extension / Manifest V3',
  license:
    'Install free from the Chrome Web Store. New installs receive a 7-day Pro trial; after the trial, SessionGrid X continues in Free mode with 1 saved workstation and 3 recovery snapshots unless Pro is activated. Browsing data stays local.',
  gallery: [
    {
      src: '/store/listings/sessiongrid-x-main.jpg',
      alt: 'SessionGrid X — Tab & Workspace Manager — Organize tabs into powerful grids',
      label: 'Tab & workspace manager',
      fit: 'contain',
    },
    {
      src: '/store/listings/sessiongrid-x-secondary.jpg',
      alt: 'SessionGrid X — Organize Tabs. Own Your Workspaces.',
      label: 'Organize your workspaces',
      fit: 'contain',
    },
    {
      src: '/store/listings/sessiongrid-x-workflow.svg',
      alt: 'SessionGrid X workflow and 7-day Pro trial followed by 1-workstation Free mode',
      label: 'Trial and Free mode',
      fit: 'contain',
    },
    {
      src: '/store/listings/sessiongrid-x-app-icon.jpg',
      alt: 'SessionGrid X product identity',
      label: 'SessionGrid identity',
      fit: 'contain',
    },
  ],
  checkoutUrl:
    'https://chromewebstore.google.com/detail/sessiongrid-x/gghgjnmclndonogigpahmgopldpomcel',
}
