const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = 'C:/Users/17143/Documents/XupplyCatalog-08.31-v2-professional-listings/planetx-premium-digital-goods'
const site = 'C:/Users/17143/Documents/MarketingOfficer-08.31-v6-store-polish'

const products = [
  {
    folder: '01-essential-ui-sounds-vol1',
    title: 'Essential UI Sounds',
    subtitle: 'Vol. 1',
    category: 'AUDIO + FX',
    accent: '#ff2e9f',
    secondary: '#24d7f2',
    categoryLogo: 'XupplyAudioFX-08.31-v1-initial.png',
    metrics: [['144', 'ORIGINAL SOUNDS'], ['48 KHZ', 'MASTER AUDIO'], ['24-BIT', 'PCM WAV']],
    summary: 'CLEAN INTERFACE FEEDBACK FOR APPS, GAMES, DASHBOARDS AND DIGITAL PRODUCTS.',
    proof: 'PREVIEW/waveform-preview.png',
  },
  {
    folder: '02-indie-app-creator-launch-kit',
    title: 'Indie App Creator',
    subtitle: 'Launch Kit',
    category: 'CREATOR',
    accent: '#ff2e9f',
    secondary: '#9b7cff',
    categoryLogo: 'XupplyCreator-08.31-v1-initial.png',
    metrics: [['60', 'EDITABLE SVGS'], ['3', 'VISUAL SYSTEMS'], ['30 DAYS', 'LAUNCH PLAN']],
    summary: 'A COMPLETE VISUAL AND MESSAGING SYSTEM FOR SHIPPING INDIE SOFTWARE.',
    proof: 'MOCKUPS/template-contact-sheet.jpg',
  },
  {
    folder: '03-digital-glitch-transition-fx-vol1',
    title: 'Digital Glitch +',
    subtitle: 'Transition FX Vol. 1',
    category: 'AUDIO + FX',
    accent: '#ff2e9f',
    secondary: '#24d7f2',
    categoryLogo: 'XupplyAudioFX-08.31-v1-initial.png',
    metrics: [['80', 'AUDIO EFFECTS'], ['24', 'MOTION CLIPS'], ['104', 'TOTAL ASSETS']],
    summary: 'MATCHED AUDIO AND MOTION EFFECTS FOR EDITS, GAMES, STREAMS AND DEMOS.',
    proof: null,
  },
  {
    folder: '04-creator-asset-forge',
    title: 'Creator Asset',
    subtitle: 'Forge',
    category: 'CREATOR',
    accent: '#ff2e9f',
    secondary: '#9b7cff',
    categoryLogo: 'XupplyCreator-08.31-v1-initial.png',
    metrics: [['12', 'EXPORT PRESETS'], ['LOCAL', 'BROWSER PROCESSING'], ['0', 'CLOUD UPLOADS']],
    summary: 'TURN ONE SOURCE IMAGE INTO A COMPLETE PLATFORM-READY ASSET SET.',
    proof: 'PREVIEWS/app-preview.png',
  },
]

const escapeXml = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[char]))

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function baseSvg(product, square = false) {
  const width = square ? 1200 : 1600
  const height = square ? 1200 : 1000
  const titleY = square ? 600 : 510
  const subtitleY = titleY + 102
  const metricY = square ? 810 : 745
  const metricWidth = square ? 315 : 390
  const metricGap = square ? 24 : 30
  const metricStart = square ? 64 : 165
  const metrics = product.metrics.map(([value, label], index) => {
    const x = metricStart + index * (metricWidth + metricGap)
    return `<g transform="translate(${x} ${metricY})"><rect width="${metricWidth}" height="126" rx="18" fill="#101726" stroke="#2c3850"/><text x="24" y="50" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">${escapeXml(value)}</text><text x="24" y="88" fill="#9caac1" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">${escapeXml(label)}</text></g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${product.accent}"/><stop offset=".48" stop-color="#8854ff"/><stop offset="1" stop-color="${product.secondary}"/></linearGradient>
      <radialGradient id="pink" cx="0" cy="0" r="1" gradientTransform="translate(250 230) rotate(35) scale(560 430)"><stop stop-color="${product.accent}" stop-opacity=".22"/><stop offset="1" stop-color="${product.accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="cyan" cx="0" cy="0" r="1" gradientTransform="translate(${width - 160} 180) rotate(135) scale(600 450)"><stop stop-color="${product.secondary}" stop-opacity=".2"/><stop offset="1" stop-color="${product.secondary}" stop-opacity="0"/></radialGradient>
      <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#25314a" stroke-opacity=".28"/></pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="#050812"/>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>
    <rect width="${width}" height="${height}" fill="url(#pink)"/>
    <rect width="${width}" height="${height}" fill="url(#cyan)"/>
    <path d="M0 0H${width}V14H0Z" fill="url(#edge)"/>
    <path d="M${width - 430} 0H${width}V430Z" fill="url(#edge)" opacity=".09"/>
    <g transform="translate(${square ? 64 : 88} ${square ? 62 : 64})">
      <rect width="220" height="48" rx="24" fill="#0d1423" stroke="${product.secondary}" stroke-opacity=".65"/>
      <text x="110" y="31" text-anchor="middle" fill="${product.secondary}" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="3">XUPPLY / ${product.category}</text>
    </g>
    <g transform="translate(${square ? 64 : 88} ${titleY})">
      <text fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${square ? 78 : 86}" font-weight="650" letter-spacing="0">${escapeXml(product.title)}</text>
      <text y="${square ? 92 : 102}" fill="url(#edge)" font-family="Arial, Helvetica, sans-serif" font-size="${square ? 72 : 78}" font-weight="650">${escapeXml(product.subtitle)}</text>
    </g>
    ${metrics}
    <text x="${square ? 64 : 88}" y="${height - 66}" fill="#7f8da7" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2.2">${escapeXml(product.summary)}</text>
    <text x="${width - (square ? 64 : 88)}" y="${height - 66}" text-anchor="end" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700">planet<tspan fill="${product.accent}">.</tspan>X</text>
  </svg>`
}

async function createProductArtwork(product) {
  const productDir = path.join(root, product.folder)
  const brandDir = path.join(productDir, 'BRAND')
  const listingDir = path.join(productDir, 'LISTING-ASSETS')
  ensure(brandDir)
  ensure(listingDir)

  const categorySource = path.join(site, 'public', 'store', 'brand', product.categoryLogo)
  const { data, info } = await sharp(categorySource).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let index = 0; index < data.length; index += 4) {
    const brightness = Math.max(data[index], data[index + 1], data[index + 2])
    data[index + 3] = brightness < 12 ? 0 : Math.min(255, Math.round((brightness - 8) * 1.35))
  }
  const transparentCategoryLogo = await sharp(data, { raw: info }).png().toBuffer()
  fs.writeFileSync(path.join(brandDir, 'xupply-category-logo.png'), transparentCategoryLogo)

  const categoryLogo = await sharp(transparentCategoryLogo).resize({ width: 365, height: 365, fit: 'contain' }).png().toBuffer()
  await sharp(Buffer.from(baseSvg(product, false)))
    .composite([{ input: categoryLogo, left: 1125, top: 85 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(listingDir, 'XupplyCatalog-08.31-v2-listing-cover.png'))

  await sharp(Buffer.from(baseSvg(product, true)))
    .composite([{ input: categoryLogo, left: 760, top: 90 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, 'XupplyCatalog-08.31-v2-product-logo.png'))

  fs.copyFileSync(path.join(brandDir, 'XupplyCatalog-08.31-v2-product-logo.png'), path.join(brandDir, 'product-logo.png'))
}

const launchConcepts = {
  Beta: ['BETA OPEN', 'Invite your first users into the build.', 'JOIN THE BETA'],
  ComingSoon: ['COMING SOON', 'A clearer way to do your best work.', 'GET EARLY ACCESS'],
  Countdown: ['3 DAYS', 'Launch week starts now.', 'SET A REMINDER'],
  Feature: ['NEW FEATURE', 'One less thing standing between you and done.', "SEE WHAT'S NEW"],
  Founder: ['BUILT IN PUBLIC', 'Small team. Real product. Shipping openly.', 'FOLLOW THE BUILD'],
  LaunchDay: ["WE'RE LIVE", 'The product is ready for the real world.', 'TRY IT NOW'],
  Offer: ['LAUNCH WEEK', 'Early pricing ends soon.', 'GET LAUNCH PRICE'],
  Review: ['EARLY FEEDBACK', 'This finally made the workflow click.', 'READ THE STORY'],
  Update: ['VERSION 1.1', 'Faster, cleaner, and easier to use.', 'VIEW THE UPDATE'],
  Waitlist: ['EARLY ACCESS', 'Be first in line when the doors open.', 'JOIN WAITLIST'],
}

const launchThemes = {
  DarkTech: { bg: '#070b14', panel: '#101827', text: '#f7fbff', muted: '#95a4ba', accent: '#ff2e9f', accent2: '#24d7f2' },
  LightModern: { bg: '#eef3f9', panel: '#ffffff', text: '#0c1220', muted: '#52627a', accent: '#6856ff', accent2: '#18b9d0' },
  Minimal: { bg: '#f5f1eb', panel: '#fffdfa', text: '#111111', muted: '#5d5b59', accent: '#ff2e9f', accent2: '#111111' },
}

function launchSvg(themeName, conceptName, format) {
  const theme = launchThemes[themeName]
  const [headline, body, cta] = launchConcepts[conceptName]
  const story = format === 'Story'
  const width = 1080
  const height = story ? 1920 : 1080
  const mainY = story ? 620 : 350
  const panelHeight = story ? 1450 : 760
  const marker = String(Object.keys(launchConcepts).indexOf(conceptName) + 1).padStart(2, '0')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${theme.accent}"/><stop offset="1" stop-color="${theme.accent2}"/></linearGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse"><path d="M54 0H0V54" fill="none" stroke="${theme.muted}" stroke-opacity=".11"/></pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>
  <rect width="1080" height="${height}" fill="${theme.bg}"/>
  <rect width="1080" height="${height}" fill="url(#grid)"/>
  <circle cx="920" cy="160" r="150" fill="${theme.accent2}" opacity=".11" filter="url(#glow)"/>
  <circle cx="140" cy="${height - 180}" r="170" fill="${theme.accent}" opacity=".10" filter="url(#glow)"/>
  <rect x="58" y="58" width="964" height="${panelHeight}" rx="32" fill="${theme.panel}" stroke="${theme.muted}" stroke-opacity=".3"/>
  <rect x="58" y="58" width="964" height="10" rx="5" fill="url(#accent)"/>
  <g transform="translate(110 116)">
    <text fill="${theme.text}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3">YOUR BRAND / APP</text>
    <text x="800" text-anchor="end" fill="${theme.muted}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2">LAUNCH SYSTEM ${marker}</text>
  </g>
  <g transform="translate(110 ${mainY})">
    <text fill="${theme.accent}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="4">${themeName.toUpperCase()} / ${format.toUpperCase()}</text>
    <text y="112" fill="${theme.text}" font-family="Arial, Helvetica, sans-serif" font-size="${story ? 104 : 96}" font-weight="700" letter-spacing="0">${escapeXml(headline)}</text>
    <rect y="164" width="210" height="8" rx="4" fill="url(#accent)"/>
    <text y="250" fill="${theme.muted}" font-family="Arial, Helvetica, sans-serif" font-size="36">${escapeXml(body)}</text>
  </g>
  <g transform="translate(110 ${story ? 1310 : 820})">
    <rect width="330" height="82" rx="12" fill="url(#accent)"/>
    <text x="165" y="52" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="1.5">${escapeXml(cta)}</text>
  </g>
  <g transform="translate(110 ${story ? 1692 : 982})">
    <text fill="${theme.muted}" font-family="Arial, Helvetica, sans-serif" font-size="20">yourproduct.com</text>
    <g transform="translate(705 -28)"><path d="M0 0L78 78M78 0L0 78" stroke="url(#accent)" stroke-width="12" stroke-linecap="square"/><text x="98" y="52" fill="${theme.text}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">XUPPLY</text></g>
  </g>
  </svg>`
}

async function rebuildLaunchKit() {
  const productDir = path.join(root, '02-indie-app-creator-launch-kit')
  const svgDir = path.join(productDir, 'EDITABLE-SVG')
  const pngDir = path.join(productDir, 'PNG-PREVIEWS')
  ensure(svgDir)
  ensure(pngDir)
  for (const theme of Object.keys(launchThemes)) {
    for (const concept of Object.keys(launchConcepts)) {
      for (const format of ['Square', 'Story']) {
        const name = `${theme}_${concept}_${format}`
        const svg = launchSvg(theme, concept, format)
        fs.writeFileSync(path.join(svgDir, `${name}.svg`), svg)
        await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(pngDir, `${name}.png`))
      }
    }
  }

  const sampleNames = [
    'DarkTech_Beta_Square.png', 'DarkTech_Feature_Square.png', 'DarkTech_LaunchDay_Square.png', 'DarkTech_Offer_Square.png',
    'LightModern_ComingSoon_Square.png', 'LightModern_Founder_Square.png', 'LightModern_Review_Square.png', 'LightModern_Waitlist_Square.png',
    'Minimal_Countdown_Square.png', 'Minimal_Feature_Square.png', 'Minimal_LaunchDay_Square.png', 'Minimal_Update_Square.png',
  ]
  const tiles = await Promise.all(sampleNames.map((name) => sharp(path.join(pngDir, name)).resize(320, 320, { fit: 'cover' }).png().toBuffer()))
  const contactSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200"><rect width="1600" height="1200" fill="#050812"/><text x="80" y="82" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="700">60 EDITABLE LAUNCH TEMPLATES</text><text x="80" y="120" fill="#91a0b8" font-family="Arial, sans-serif" font-size="18" letter-spacing="2">DARK TECH / LIGHT MODERN / MINIMAL</text></svg>`)
  const composites = tiles.map((input, index) => ({ input, left: 80 + (index % 4) * 370, top: 165 + Math.floor(index / 4) * 340 }))
  await sharp(contactSvg).composite(composites).jpeg({ quality: 92 }).toFile(path.join(productDir, 'MOCKUPS', 'template-contact-sheet.jpg'))
}

async function main() {
  await rebuildLaunchKit()
  for (const product of products) await createProductArtwork(product)
  console.log(`Generated professional Xupply artwork for ${products.length} products and rebuilt 60 launch templates.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
