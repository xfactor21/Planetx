import type { StoreProduct } from '@/lib/store-data'

export const buildSellIndieCreatorTools: StoreProduct = {
  id: 'build-sell-indie-creator-tools',
  name: 'Build & Sell Indie Creator Tools',
  category: 'Creator Resources',
  productType: 'Interactive course + workbook',
  description:
    'A self-paced six-module course for developers, producers, and designers who already make useful things and want a practical system for packaging, pricing, listing, launching, and selling them.',
  price: '$14.99',
  priceNote: 'Current Payhip price',
  status: 'Available now',
  platforms: ['PDF', 'Any modern browser'],
  metrics: [
    { value: '6', label: 'Modules' },
    { value: '2', label: 'Learning formats' },
    { value: 'Local', label: 'Companion app' },
  ],
  includes: [
    'Six-module self-paced course structure',
    'Printable and readable PDF workbook',
    'Interactive local HTML companion app',
    'Clickable module navigation and progress tracking',
    'Autosaving worksheet fields and per-module checklists',
    'Three-question self-check quiz per module',
    'Worksheet answer export to a text file',
    'Packaging, validation, pricing, listing, launch, and post-launch workflows',
  ],
  bestFor: ['Indie developers', 'Digital-product creators', 'Producers and designers'],
  format: 'PDF workbook + local interactive HTML companion app',
  license:
    'Single-purchaser educational-use license. Course files and companion app may not be redistributed, resold, shared, or repackaged as a competing product.',
  gallery: [
    {
      src: '/store/brand/Xupply-09.16-v1-build-sell-course.jpg',
      alt: 'Xupply Build & Sell Indie Creators course artwork',
      label: 'Course identity',
      fit: 'cover',
    },
    {
      src: '/store/brand/Xupply-09.16-v1-courses-education.jpg',
      alt: 'Xupply courses and education branding artwork',
      label: 'Courses & education',
      fit: 'cover',
    },
    {
      src: '/store/brand/Xupply-09.16-v1-universal-tech.jpg',
      alt: 'Xupply by planet.X universal technology branding artwork',
      label: 'Xupply collection',
      fit: 'cover',
    },
  ],
  checkoutUrl: 'https://payhip.com/b/0ugq1',
}
