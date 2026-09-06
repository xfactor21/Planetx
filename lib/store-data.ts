export const STORE_VERSION = 'v11'
export const STORE_FAMILY = 'Xupply'

export type StoreCategory = 'Software' | 'Audio & FX' | 'Creator Resources'

export type ProductGalleryImage = {
  src: string
  alt: string
  label: string
  fit?: 'cover' | 'contain'
}

export type ProductMetric = {
  value: string
  label: string
}

export type StoreProduct = {
  id: string
  name: string
  category: StoreCategory
  productType: string
  description: string
  price: string
  priceNote: string
  status: string
  platforms?: string[]
  metrics: ProductMetric[]
  includes: string[]
  bestFor: string[]
  format: string
  license: string
  gallery: ProductGalleryImage[]
  checkoutUrl?: string
}

export const storeCategories: Array<'All' | StoreCategory> = [
  'All',
  'Software',
  'Audio & FX',
  'Creator Resources',
]

export const storeProducts: StoreProduct[] = [
  {
    id: 'context-pro',
    name: 'conteXt Pro',
    category: 'Software',
    productType: 'Developer credential command center',
    description:
      'A local-first encrypted workspace for the API keys, tokens, environment values, notes, and project context developers otherwise lose across dashboards and files.',
    price: '$24/year or $39 lifetime',
    priceNote: 'Test-mode pricing',
    status: 'Working prototype',
    platforms: ['Chrome extension', 'Installable PWA'],
    metrics: [
      { value: 'AES-GCM', label: 'Local encryption' },
      { value: '.env', label: 'Ready exports' },
      { value: '0', label: 'Cloud uploads' },
    ],
    includes: [
      'Encrypted local credential vault',
      'Provider, account, project, and environment mapping',
      'Notes, URLs, labels, and searchable context',
      'Portable .env generation and local export workflows',
      'Installable PWA and Chrome extension builds',
      'Settings, backups, and local vault controls',
    ],
    bestFor: ['Indie developers', 'API-heavy projects', 'Multi-environment apps'],
    format: 'Installable PWA and Chrome extension',
    license: 'Single-user software license planned; production licensing is not active yet.',
    gallery: [
      { src: '/store/context-pro.png', alt: 'conteXt Pro encrypted vault dashboard', label: 'Vault dashboard', fit: 'cover' },
      { src: '/store/gallery/context-launcher.png', alt: 'conteXt mobile launcher icon', label: 'Launcher identity', fit: 'contain' },
      { src: '/store/gallery/context-splash.png', alt: 'conteXt mobile splash screen', label: 'Mobile launch screen', fit: 'contain' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/8b1fa37c-1a6a-4627-b418-66f125e3d55a',
  },
  {
    id: 'project-x',
    name: 'project.X',
    category: 'Software',
    productType: 'Visual project management software',
    description:
      'A Windows command center for seeing projects, repositories, deployments, notes, local files, and next actions together, with an Android companion for continuity away from the desk.',
    price: '$49/year or $99 lifetime',
    priceNote: 'Test-mode pricing',
    status: 'Active development',
    platforms: ['Windows', 'Android companion'],
    metrics: [
      { value: '1', label: 'Project command center' },
      { value: '2', label: 'Connected platforms' },
      { value: 'Local', label: 'Workspace first' },
    ],
    includes: [
      'Visual project portfolio and status views',
      'Repository and deployment references',
      'Project notes, files, previews, and backups',
      'Local project launch and command workflows',
      'Desktop-first workspace with Android companion',
      'Multiple practical and visual project views',
    ],
    bestFor: ['Multi-project developers', 'Solo studios', 'Vibe-coding workflows'],
    format: 'Windows application with Android companion',
    license: 'Single-user software license planned; production licensing is not active yet.',
    gallery: [
      { src: '/store/project-x.png', alt: 'project.X product identity', label: 'Product identity', fit: 'contain' },
      { src: '/store/gallery/project-x-workspace.webp', alt: 'project.X project workspace', label: 'Project workspace', fit: 'cover' },
      { src: '/store/gallery/project-x-command.webp', alt: 'project.X command and project interface', label: 'Command interface', fit: 'cover' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/7948c9c5-63ac-4891-9c5e-d4cf8bb913e7',
  },
  {
    id: 'essential-ui-sounds',
    name: 'Essential UI Sounds Vol. 1',
    category: 'Audio & FX',
    productType: 'Original interface sound library',
    description:
      'A practical, consistently named library of original feedback sounds for interfaces, menus, dashboards, games, system actions, notifications, and achievements.',
    price: '$4.99',
    priceNote: 'Launch price',
    status: 'Packaged and verified',
    metrics: [
      { value: '144', label: 'Original sounds' },
      { value: '48 kHz', label: 'Sample rate' },
      { value: '24-bit', label: 'PCM WAV' },
    ],
    includes: [
      'Clicks, hover, select, open, close, and toggles',
      'Success, warning, error, and notification sounds',
      'Transfer, scan, process, security, and system tones',
      'Achievement and completion feedback',
      'Categorized folders and consistent filenames',
      'Preview montage, waveform, manifest, and documentation',
    ],
    bestFor: ['Apps and dashboards', 'Game interfaces', 'Interactive prototypes'],
    format: '144 WAV files, 48 kHz / 24-bit PCM',
    license: 'A commercial-use draft license is included and still requires final legal review.',
    gallery: [
      { src: '/store/listings/XupplyCatalog-08.31-v2-ui-sounds-cover.png', alt: 'Xupply Essential UI Sounds Vol. 1 product cover', label: 'Xupply identity', fit: 'cover' },
      { src: '/store/gallery/ui-sounds-waveform.png', alt: 'Essential UI Sounds preview waveform', label: 'Preview waveform', fit: 'contain' },
      { src: '/store/gallery/ui-sounds-spectrum.png', alt: 'Essential UI Sounds preview spectrum', label: 'Frequency detail', fit: 'cover' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/34c76d19-b09c-43a6-9a76-be088e86f02c',
  },
  {
    id: 'digital-glitch-fx',
    name: 'Digital Glitch + Transition FX Vol. 1',
    category: 'Audio & FX',
    productType: 'Matched audio and motion effects',
    description:
      'An original mixed-media effects collection for transitions, signal failures, impacts, distortion, movement, tension, and recovery across edits, games, streams, and product demos.',
    price: '$6.99',
    priceNote: 'Launch price',
    status: 'Packaged and verified',
    metrics: [
      { value: '80', label: 'Audio effects' },
      { value: '24', label: 'Motion clips' },
      { value: '104', label: 'Total assets' },
    ],
    includes: [
      'Glitches, impacts, risers, downers, and whooshes',
      'Stutters, pulses, signal events, and digital failures',
      'RGB splits, tears, scan bursts, snow, and frame slices',
      'Terminal rain, data lines, corruption, and recovery clips',
      '48 kHz / 24-bit WAV audio masters',
      'Lightweight 1280 x 720 H.264 MP4 motion files',
    ],
    bestFor: ['Video editors', 'Game trailers', 'Streams and product demos'],
    format: '80 WAV files plus 24 H.264 MP4 clips',
    license: 'A commercial-use draft license is included and still requires final legal review.',
    gallery: [
      { src: '/store/listings/XupplyCatalog-08.31-v2-glitch-fx-cover.png', alt: 'Xupply Digital Glitch and Transition FX product cover', label: 'Xupply identity', fit: 'cover' },
      { src: '/store/gallery/glitch-terminal-rain.jpg', alt: 'Terminal rain motion effect frame', label: 'Terminal rain', fit: 'cover' },
      { src: '/store/gallery/glitch-scan-burst.jpg', alt: 'Scan burst motion effect frame', label: 'Scan burst', fit: 'cover' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/6cd95479-9af0-4b7a-87de-aeaa935bb987',
  },
  {
    id: 'indie-launch-kit',
    name: 'Indie App Creator Launch Kit',
    category: 'Creator Resources',
    productType: 'Editable app launch system',
    description:
      'A coordinated design and messaging system for taking an indie app from coming-soon announcement through launch day, follow-up posts, reviews, updates, and offers.',
    price: '$7.99',
    priceNote: 'Launch price',
    status: 'Packaged and verified',
    metrics: [
      { value: '60', label: 'Editable templates' },
      { value: '3', label: 'Visual systems' },
      { value: '30 days', label: 'Longest plan' },
    ],
    includes: [
      'Minimal, Dark Tech, and Light Modern visual systems',
      'Square and vertical/story layouts',
      'Coming soon, beta, launch, feature, review, and offer posts',
      'Social copy library and five-email launch sequence',
      '7-day, 14-day, and 30-day launch plans',
      'Launch, screenshot, and publishing checklists',
    ],
    bestFor: ['Indie apps', 'Chrome extensions', 'Small SaaS launches'],
    format: '60 editable SVG templates plus copy and planning documents',
    license: 'A commercial-use draft license is included and still requires final legal review.',
    gallery: [
      { src: '/store/listings/XupplyCatalog-08.31-v2-launch-kit-cover.png', alt: 'Xupply Indie App Creator Launch Kit product cover', label: 'Xupply identity', fit: 'cover' },
      { src: '/store/listings/XupplyCatalog-08.31-v2-launch-kit-library.jpg', alt: 'Current Launch Kit v2 template contact sheet', label: 'Template library', fit: 'cover' },
      { src: '/store/listings/XupplyCatalog-08.31-v2-launch-kit-example.png', alt: 'Current Dark Tech feature announcement template', label: 'Editable example', fit: 'contain' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/e4f17803-c45a-4a8c-81b2-28054fa95336',
  },
  {
    id: 'creator-asset-forge',
    name: 'Creator Asset Forge',
    category: 'Creator Resources',
    productType: 'Private local creator utility',
    description:
      'A browser-based production utility that turns one source image into correctly sized social, channel, app-icon, Discord, and website assets without uploading the source anywhere.',
    price: '$7.99',
    priceNote: 'Launch price',
    status: 'Packaged and verified',
    platforms: ['Local browser app'],
    metrics: [
      { value: '12', label: 'Export presets' },
      { value: '0', label: 'Required uploads' },
      { value: '1 click', label: 'Batch export' },
    ],
    includes: [
      'Instagram, TikTok, YouTube, LinkedIn, X, and Pinterest presets',
      'App icon, Discord icon, Open Graph, and website hero exports',
      'Contain and crop/cover fit modes',
      'Background color control',
      'Individual PNG and all-preset export',
      'Windows and macOS launch helpers plus source and documentation',
    ],
    bestFor: ['Creators', 'Indie developers', 'Small product teams'],
    format: 'Offline-capable local HTML application',
    license: 'A commercial-use draft license is included and still requires final legal review.',
    gallery: [
      { src: '/store/listings/XupplyCatalog-08.31-v2-asset-forge-cover.png', alt: 'Xupply Creator Asset Forge product cover', label: 'Xupply identity', fit: 'cover' },
      { src: '/store/listings/XupplyCatalog-08.31-v2-asset-forge-desktop.png', alt: 'Creator Asset Forge v2 desktop interface processing the Xupply mark', label: 'Desktop workspace', fit: 'cover' },
      { src: '/store/listings/XupplyCatalog-08.31-v2-asset-forge-mobile.png', alt: 'Creator Asset Forge v2 mobile interface', label: 'Mobile workspace', fit: 'contain' },
    ],
    checkoutUrl:
      'https://planet-x.lemonsqueezy.com/checkout/buy/8233f241-740f-4372-a8e0-977b72370a33',
  },
  {
    id: 'creator-stream-pack',
    name: 'Creator Stream Pack',
    category: 'Creator Resources',
    productType: 'Editable broadcast scene and alert system',
    description:
      'A coordinated set of editable broadcast scenes and original alert sounds for OBS, Twitch, YouTube Live, music streams, gaming, and creator broadcasts.',
    price: '$9.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '12', label: 'Editable scenes' },
      { value: '18', label: 'Original alerts' },
      { value: '1080p', label: 'Scene masters' },
    ],
    includes: [
      'Starting Soon, Be Right Back, and Stream Complete scenes',
      'Gameplay, camera, chat, and intermission layouts',
      'Schedule, sponsor, goal, and Now Playing screens',
      '18 original 48 kHz / 16-bit WAV alerts',
      'Editable 1920 x 1080 SVG scene masters',
      'Interactive start page, manifest, and release notes',
    ],
    bestFor: ['OBS creators', 'Twitch and YouTube Live', 'Music and gaming streams'],
    format: '12 SVG scenes plus 18 WAV alert sounds',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-stream-pack-cover.png', alt: 'Xupply Creator Stream Pack cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-stream-pack-sample.png', alt: 'Creator Stream Pack Starting Soon scene', label: 'Editable scene', fit: 'contain' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-stream-pack-details.png', alt: 'Creator Stream Pack contents', label: 'Package details', fit: 'cover' },
    ],
  },
  {
    id: 'interface-hud-kit',
    name: 'Interface HUD Kit',
    category: 'Creator Resources',
    productType: 'Editable interface component library',
    description:
      'A modular vector HUD system with matching interface sounds for games, prototypes, dashboards, streams, motion design, and science-fiction concept interfaces.',
    price: '$11.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '40', label: 'HUD vectors' },
      { value: '24', label: 'Interface sounds' },
      { value: '7', label: 'Component families' },
    ],
    includes: [
      'Status bars, meters, counters, slots, and indicators',
      'Objective, mission, dialogue, and communication panels',
      'Radar, reticle, targeting, minimap, and navigation elements',
      '40 editable SVG components with semantic geometry',
      '24 original 48 kHz / 16-bit WAV interface sounds',
      'Interactive component gallery and clear documentation',
    ],
    bestFor: ['Game UI prototypes', 'Motion graphics', 'Figma and web concepts'],
    format: '40 SVG components plus 24 WAV interface sounds',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-interface-hud-kit-cover.png', alt: 'Xupply Interface HUD Kit cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-interface-hud-kit-sample.png', alt: 'Interface HUD Kit objective component', label: 'HUD component', fit: 'contain' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-interface-hud-kit-details.png', alt: 'Interface HUD Kit contents', label: 'Package details', fit: 'cover' },
    ],
  },
  {
    id: 'website-atmosphere-pack',
    name: 'Website Atmosphere Pack',
    category: 'Creator Resources',
    productType: 'Standalone interactive web effects',
    description:
      'Ten distinct, dependency-free visual effects that can be inspected, customized, and integrated into landing pages, portfolios, music sites, and experimental interfaces.',
    price: '$7.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '10', label: 'Distinct effects' },
      { value: '0', label: 'Dependencies' },
      { value: 'Local', label: 'Demo pages' },
    ],
    includes: [
      'Interactive cursor energy and pointer glow effects',
      'Canvas data rain and parallax star fields',
      'Animated particles, rings, mesh, grain, and scanlines',
      'Geometric X-grid atmosphere system',
      'Standalone HTML, CSS, and JavaScript demos',
      'No frameworks, accounts, telemetry, or network assets',
    ],
    bestFor: ['Landing pages', 'Music and creator sites', 'Interactive prototypes'],
    format: '10 standalone HTML/CSS/JavaScript effect folders',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-website-atmosphere-pack-cover.png', alt: 'Xupply Website Atmosphere Pack cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-website-atmosphere-pack-sample.png', alt: 'Website Atmosphere Pack data rain effect', label: 'Live effect', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-website-atmosphere-pack-details.png', alt: 'Website Atmosphere Pack contents', label: 'Package details', fit: 'cover' },
    ],
  },
  {
    id: 'creator-editing-overlays',
    name: 'Creator Editing Overlays',
    category: 'Creator Resources',
    productType: 'Editable video graphics library',
    description:
      'A flexible overlay collection for long-form and vertical video, with title, caption, credit, tutorial, product, podcast, progress, and call-to-action graphics.',
    price: '$8.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '40', label: 'Editable overlays' },
      { value: '24', label: 'Landscape layouts' },
      { value: '16', label: 'Vertical layouts' },
    ],
    includes: [
      'Lower thirds, title cards, subtitles, and speaker labels',
      'Tutorial steps, callouts, shortcuts, and progress graphics',
      'Podcast, music, product, sponsor, and review elements',
      'Vertical CTAs, captions, polls, countdowns, and end cards',
      'Editable SVG masters for every overlay',
      'True 1920 x 1080 and 1080 x 1920 formats',
    ],
    bestFor: ['YouTube and podcasts', 'Reels and TikTok', 'Tutorials and product demos'],
    format: '40 editable SVG overlays in landscape and vertical formats',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-editing-overlays-cover.png', alt: 'Xupply Creator Editing Overlays cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-editing-overlays-sample.png', alt: 'Creator Editing Overlays lower third', label: 'Editable overlay', fit: 'contain' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-creator-editing-overlays-details.png', alt: 'Creator Editing Overlays contents', label: 'Package details', fit: 'cover' },
    ],
  },
  {
    id: 'digital-worlds-wallpapers',
    name: 'Digital Worlds Wallpaper Pack',
    category: 'Creator Resources',
    productType: 'Matched desktop and mobile wallpaper collection',
    description:
      'Fifteen coordinated digital-world compositions, each delivered in dedicated desktop and mobile layouts with dark technical space, luminous paths, grids, and network detail.',
    price: '$5.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '30', label: 'Wallpapers' },
      { value: '15', label: 'Matched worlds' },
      { value: '2', label: 'Native formats' },
    ],
    includes: [
      '15 desktop compositions at 2560 x 1440',
      '15 mobile compositions at 1440 x 2560',
      'Matched dark-tech visual direction across both formats',
      'High-quality JPG exports',
      'Pink, cyan, violet, grid, path, and node systems',
      'Interactive desktop preview gallery',
    ],
    bestFor: ['Desktop personalization', 'Mobile lock screens', 'Creator backdrops'],
    format: '30 high-resolution JPG wallpapers',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-digital-worlds-wallpaper-pack-cover.png', alt: 'Xupply Digital Worlds Wallpaper Pack cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-digital-worlds-wallpaper-pack-sample.jpg', alt: 'Digital Worlds desktop wallpaper example', label: 'Desktop world', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-digital-worlds-wallpaper-pack-details.png', alt: 'Digital Worlds Wallpaper Pack contents', label: 'Package details', fit: 'cover' },
    ],
  },
  {
    id: 'producer-transitions-impacts',
    name: 'Producer Transitions + Impacts Vol. 1',
    category: 'Audio & FX',
    productType: 'Original production sound-effects library',
    description:
      'A focused collection of transitions and impacts for music, trailers, video edits, intros, podcasts, game promos, and live content.',
    price: '$6.99',
    priceNote: 'Proposed launch price',
    status: 'Package verified; checkout pending',
    metrics: [
      { value: '72', label: 'Original effects' },
      { value: '48 kHz', label: 'Sample rate' },
      { value: '6', label: 'Sound categories' },
    ],
    includes: [
      'Impacts, risers, downers, and whooshes',
      'Glitches and pulse transitions',
      '72 individually named WAV masters',
      '48 kHz / 16-bit mono PCM delivery',
      'CSV manifest with type and duration',
      'Interactive audio preview page and documentation',
    ],
    bestFor: ['Music production', 'Trailers and promos', 'Video and podcast editing'],
    format: '72 WAV files, 48 kHz / 16-bit PCM',
    license: 'A commercial-use draft license is included and requires final legal review before live sales.',
    gallery: [
      { src: '/store/listings/XupplyFirstTen-09.01-v2-producer-transitions-impacts-cover.png', alt: 'Xupply Producer Transitions and Impacts cover', label: 'Product cover', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-producer-transitions-impacts-sample.png', alt: 'Producer Transitions impact waveform', label: 'Impact waveform', fit: 'cover' },
      { src: '/store/listings/XupplyFirstTen-09.01-v2-producer-transitions-impacts-details.png', alt: 'Producer Transitions and Impacts contents', label: 'Package details', fit: 'cover' },
    ],
  },
]
