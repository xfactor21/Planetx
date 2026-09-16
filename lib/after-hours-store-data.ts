export type AfterHoursProductImage = {
  src: string
  alt: string
  label?: string
}

export type AfterHoursMetric = {
  label: string
  value: number
}

export type AfterHoursProduct = {
  id: string
  name: string
  category: string
  description: string
  price: string
  priceNote?: string
  image?: AfterHoursProductImage
  gallery?: AfterHoursProductImage[]
  metrics?: AfterHoursMetric[]
  href?: string
  status?: string
  safeName?: string
  safeDescription?: string
  ctaLabel?: string
}

/**
 * Adult-only inventory stays isolated from the public Xupply catalog.
 * These first entries are supplier-backed DEMO listings built from AWD's public
 * catalog while API/data-feed approval is pending. Public AWD pages hide account
 * pricing and in several cases expose placeholder imagery, so planet.X does not
 * invent prices or represent the temporary illustrations as supplier photography.
 */
export const afterHoursProducts: AfterHoursProduct[] = [
  {
    id: 'awd-trojan-magnum-3',
    name: 'Trojan Magnum 3 Pack',
    safeName: 'Protection / 3 Pack',
    category: 'Protection',
    description: 'Adult Wholesale Direct currently lists the Trojan Magnum 3 Pack in its live Trojan catalog. This demo keeps supplier pricing locked until the authenticated AWD feed is connected; the public catalog showed 419 units in stock during the September 16 inventory check.',
    safeDescription: 'Three-count protection item. Supplier pricing remains hidden until the authenticated feed is connected.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '419 IN STOCK',
    image: { src: '/store/after-hours/demo/protection-magnum.svg', alt: 'Abstract demo packaging for the Trojan Magnum 3 Pack', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=411_560&main_page=product_info&products_id=55412',
    ctaLabel: 'View supplier item',
  },
  {
    id: 'awd-trojan-ultra-thin-3',
    name: 'Trojan Ultra Thin 3 Pack',
    safeName: 'Protection / Ultra Thin',
    category: 'Protection',
    description: 'Adult Wholesale Direct currently lists the Trojan Ultra Thin 3 Pack in its Trojan catalog. The public catalog showed 181 units in stock during the September 16 inventory check. Wholesale cost and final retail pricing will come from the authenticated AWD feed.',
    safeDescription: 'Three-count protection item. Supplier cost and final retail price are waiting on the private feed.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '181 IN STOCK',
    image: { src: '/store/after-hours/demo/protection-ultrathin.svg', alt: 'Abstract demo packaging for the Trojan Ultra Thin 3 Pack', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=411_413&main_page=product_info&products_id=55426',
    ctaLabel: 'View supplier item',
  },
  {
    id: 'awd-mood-silicone-lube-4oz',
    name: 'Mood Silicone Lube 4 Oz.',
    safeName: 'Personal Care / 4 Oz.',
    category: 'Lubricants',
    description: 'A four-ounce Mood silicone lubricant from Doc Johnson, currently listed by Adult Wholesale Direct. AWD public inventory showed 36 units in stock on the latest catalog snapshot. The supplier account feed will provide the private wholesale cost and licensed product assets.',
    safeDescription: 'Four-ounce personal-care product. Supplier cost and licensed imagery are waiting on the private feed.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '36 IN STOCK',
    image: { src: '/store/after-hours/demo/mood-silicone.svg', alt: 'Abstract bottle visualization for Mood Silicone Lube 4 Oz.', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=389_393&main_page=product_info&products_id=59120',
    ctaLabel: 'View supplier item',
  },
  {
    id: 'awd-mood-frisky-pink',
    name: 'Mood Frisky G-Spot Vibrator - Pink',
    safeName: 'Personal Device / Pink',
    category: 'Vibrators',
    description: 'Doc Johnson’s Mood Frisky is a multi-speed G-spot vibrator with an angled oversized head, twist-dial control, and a water-resistant/waterproof design depending on the published seller specification. AWD currently lists the pink model with 4 units in stock. Two AA batteries are required and are not included.',
    safeDescription: 'Battery-powered personal device. Supplier listing currently shows limited stock.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '4 IN STOCK',
    image: { src: '/store/after-hours/demo/mood-frisky.svg', alt: 'Abstract non-explicit product visualization for the Mood Frisky G-Spot Vibrator', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=21528_318&main_page=product_info&products_id=52199',
    ctaLabel: 'View supplier item',
  },
  {
    id: 'awd-mood-pleaser-purple',
    name: 'Mood Pleaser Thick Ribbed Purple',
    safeName: 'Personal Device / Purple',
    category: 'For Him',
    description: 'A soft, stretchable, open-ended Mood stroker with a ribbed internal texture and external grip rings. Adult Wholesale Direct currently lists the purple version with 5 units in stock. Final copy, product photography, and wholesale cost will be replaced by the licensed AWD feed when access is approved.',
    safeDescription: 'Soft personal device with a textured internal design. Supplier listing currently shows limited stock.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '5 IN STOCK',
    image: { src: '/store/after-hours/demo/mood-pleaser.svg', alt: 'Abstract non-explicit product visualization for the Mood Pleaser Thick Ribbed Purple', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=151_323&main_page=product_info&products_id=50153',
    ctaLabel: 'View supplier item',
  },
  {
    id: 'awd-mood-thrill-blue',
    name: 'Mood Thrill Blue',
    safeName: 'Personal Device / Blue',
    category: 'For Him',
    description: 'Adult Wholesale Direct currently lists Mood Thrill Blue in the Doc Johnson catalog with 10 units in stock. This is intentionally a light demo record: the richer description, licensed images, private cost, and SKU metadata will be replaced automatically once AWD grants product-data access.',
    safeDescription: 'Personal device. Detailed supplier copy and pricing are waiting on the private product feed.',
    price: 'Feed pending',
    priceNote: 'AWD account price required',
    status: '10 IN STOCK',
    image: { src: '/store/after-hours/demo/mood-thrill.svg', alt: 'Abstract non-explicit product visualization for Mood Thrill Blue', label: 'Temporary demo visual' },
    href: 'https://adultwholesaledirect.com/tour/index.php?cPath=151_323&main_page=product_info&products_id=45577',
    ctaLabel: 'View supplier item',
  },
]
