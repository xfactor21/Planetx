const fs = require('fs')
const path = require('path')
const { chromium } = require('C:/Users/17143/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

async function main() {
  const output = __dirname
  const storeUrl = process.env.STORE_URL || 'http://127.0.0.1:4197/store'
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const consoleErrors = []
  const failedRequests = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}`))
  await page.goto(storeUrl, { waitUntil: 'networkidle' })
  const announcement = page.getByRole('dialog', { name: 'MonsterX announcement' })
  if (await announcement.isVisible().catch(() => false)) {
    await announcement.getByRole('button', { name: 'Close', exact: true }).first().click()
    await announcement.waitFor({ state: 'hidden' })
  }

  const failures = []
  const count = async (selector, expected, label) => {
    const actual = await page.locator(selector).count()
    if (actual !== expected) failures.push(`${label}: expected ${expected}, found ${actual}`)
    return actual
  }

  const products = await count('article', 12, 'products')
  const titles = await count('article h2', 12, 'product titles')
  const checkouts = await count('a[href*="lemonsqueezy.com/checkout"]', 6, 'configured checkout links')
  const pending = await count('[aria-label="Checkout is not configured yet"]', 6, 'pending checkout states')
  const galleries = await count('button[aria-label^="Show "]', 36, 'gallery controls')

  for (const article of await page.locator('article').all()) {
    await article.evaluate((node) => node.scrollIntoView({ block: 'center' }))
    for (const button of await article.locator('button[aria-label^="Show "]').all()) await button.click()
  }
  await page.waitForTimeout(500)
  const brokenImages = await page.locator('article img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src')))
  if (brokenImages.length) failures.push(`broken images: ${brokenImages.join(', ')}`)

  const filters = [['Software', 2], ['Audio & FX', 3], ['Creator Resources', 7], ['All', 12]]
  for (const [name, expected] of filters) {
    await page.getByRole('button', { name, exact: true }).click()
    await page.waitForFunction((count) => document.querySelectorAll('article').length === count, expected)
    const actual = await page.locator('article').count()
    if (actual !== expected) failures.push(`${name} filter: expected ${expected}, found ${actual}`)
  }

  const versionVisible = await page.getByText('v10 preview', { exact: true }).isVisible()
  if (!versionVisible) failures.push('visible v10 preview label is missing')
  await page.screenshot({ path: path.join(output, 'MarketingOfficer-09.01-v10-xupply-first-ten-desktop.png'), fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload({ waitUntil: 'networkidle' })
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (mobileOverflow) failures.push('horizontal overflow at 390px')
  await page.screenshot({ path: path.join(output, 'MarketingOfficer-09.01-v10-xupply-first-ten-mobile.png'), fullPage: true })

  if (consoleErrors.length) failures.push(...consoleErrors.map((error) => `console: ${error}`))
  if (failedRequests.length) failures.push(...failedRequests.map((error) => `request: ${error}`))
  const report = { products, titles, checkouts, pending, galleries, brokenImages, filters: Object.fromEntries(filters), versionVisible, mobileOverflow, consoleErrors, failedRequests, failures }
  fs.writeFileSync(path.join(output, 'MarketingOfficer-09.01-v10-xupply-first-ten-report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  await browser.close()
  process.exitCode = failures.length ? 1 : 0
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
