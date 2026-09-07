import crypto from 'node:crypto'

type Provider = 'payhip' | 'lemon'

type LicenseRequest = {
  product: string
  licenseKey: string
  deviceId?: string
  token?: string
}

type LicenseResult = {
  ok: boolean
  valid: boolean
  provider?: Provider
  status?: string
  token?: string
  instanceId?: string
  uses?: number
  activationLimit?: number | null
  error?: string
}

const PAYHIP_VERIFY_URL = 'https://payhip.com/api/v2/license/verify'
const PAYHIP_USAGE_URL = 'https://payhip.com/api/v2/license/usage'
const PAYHIP_DECREASE_URL = 'https://payhip.com/api/v2/license/decrease'
const LEMON_BASE = 'https://api.lemonsqueezy.com/v1/licenses'

function productEnvKey(product: string) {
  return product.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

function allowedProduct(product: string) {
  const allowed = (process.env.LICENSE_ALLOWED_PRODUCTS || 'sessiongrid-x')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(product.trim().toLowerCase())
}

function providerFor(product: string): Provider | null {
  const key = productEnvKey(product)
  const explicit = process.env[`LICENSE_${key}_PROVIDER`]?.toLowerCase()
  if (explicit === 'payhip' || explicit === 'lemon') return explicit
  if (process.env[`PAYHIP_${key}_PRODUCT_SECRET`]) return 'payhip'
  if (process.env[`LEMON_${key}_PRODUCT_ID`] || process.env[`LEMON_${key}_VARIANT_ID`]) return 'lemon'
  return null
}

function secret() {
  return process.env.LICENSE_GATEWAY_SECRET || ''
}

function licenseHash(licenseKey: string) {
  return crypto.createHash('sha256').update(licenseKey.trim()).digest('hex')
}

function signToken(payload: Record<string, unknown>) {
  const key = secret()
  if (!key) throw new Error('LICENSE_GATEWAY_SECRET is not configured')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', key).update(body).digest('base64url')
  return `${body}.${sig}`
}

function verifyToken(token: string | undefined, expected: { product: string; licenseKey: string; deviceId?: string }) {
  if (!token || !secret()) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expectedSig = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>
    if (payload.product !== expected.product) return null
    if (payload.licenseHash !== licenseHash(expected.licenseKey)) return null
    if (expected.deviceId && payload.deviceId !== expected.deviceId) return null
    return payload
  } catch {
    return null
  }
}

async function payhipVerify(product: string, licenseKey: string) {
  const key = productEnvKey(product)
  const productSecret = process.env[`PAYHIP_${key}_PRODUCT_SECRET`]
  if (!productSecret) throw new Error(`Payhip secret is not configured for ${product}`)
  const url = new URL(PAYHIP_VERIFY_URL)
  url.searchParams.set('license_key', licenseKey)
  const response = await fetch(url, { headers: { 'product-secret-key': productSecret }, cache: 'no-store' })
  const json = await response.json().catch(() => null) as any
  const data = json?.data
  if (!response.ok || !data) return { valid: false, data: null }
  const expectedLink = process.env[`PAYHIP_${key}_PRODUCT_LINK`]
  const matchesProduct = !expectedLink || data.product_link === expectedLink
  return { valid: Boolean(data.enabled && matchesProduct), data }
}

async function payhipUsage(product: string, licenseKey: string, decrease = false) {
  const key = productEnvKey(product)
  const productSecret = process.env[`PAYHIP_${key}_PRODUCT_SECRET`]
  if (!productSecret) throw new Error(`Payhip secret is not configured for ${product}`)
  const body = new URLSearchParams({ license_key: licenseKey })
  const response = await fetch(decrease ? PAYHIP_DECREASE_URL : PAYHIP_USAGE_URL, {
    method: 'PUT',
    headers: { 'product-secret-key': productSecret, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })
  const json = await response.json().catch(() => null) as any
  return { ok: response.ok && Boolean(json?.data), data: json?.data ?? null }
}

async function lemonCall(action: 'activate' | 'validate' | 'deactivate', fields: Record<string, string>) {
  const response = await fetch(`${LEMON_BASE}/${action}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
    cache: 'no-store',
  })
  const json = await response.json().catch(() => null) as any
  return { response, json }
}

function lemonMatchesProduct(product: string, json: any) {
  const key = productEnvKey(product)
  const expectedProduct = process.env[`LEMON_${key}_PRODUCT_ID`]
  const expectedVariant = process.env[`LEMON_${key}_VARIANT_ID`]
  const productMatches = !expectedProduct || String(json?.meta?.product_id ?? '') === String(expectedProduct)
  const variantMatches = !expectedVariant || String(json?.meta?.variant_id ?? '') === String(expectedVariant)
  return productMatches && variantMatches
}

export async function verifyLicense(input: LicenseRequest): Promise<LicenseResult> {
  const product = input.product.trim().toLowerCase()
  const licenseKey = input.licenseKey.trim()
  if (!allowedProduct(product)) return { ok: false, valid: false, error: 'Unsupported product' }
  if (!licenseKey) return { ok: false, valid: false, error: 'License key is required' }
  const provider = providerFor(product)
  if (!provider) return { ok: false, valid: false, error: 'License provider is not configured' }

  try {
    if (provider === 'payhip') {
      const result = await payhipVerify(product, licenseKey)
      if (!result.valid) return { ok: true, valid: false, provider, status: result.data?.enabled === false ? 'disabled' : 'invalid' }
      const tokenPayload = verifyToken(input.token, { product, licenseKey, deviceId: input.deviceId })
      return {
        ok: true,
        valid: Boolean(tokenPayload),
        provider,
        status: tokenPayload ? 'active' : 'needs_activation',
        uses: Number(result.data?.uses ?? 0),
      }
    }

    const tokenPayload = verifyToken(input.token, { product, licenseKey, deviceId: input.deviceId })
    const instanceId = typeof tokenPayload?.instanceId === 'string' ? tokenPayload.instanceId : undefined
    const fields: Record<string, string> = { license_key: licenseKey }
    if (instanceId) fields.instance_id = instanceId
    const { response, json } = await lemonCall('validate', fields)
    const valid = Boolean(response.ok && json?.valid && lemonMatchesProduct(product, json) && instanceId)
    return {
      ok: true,
      valid,
      provider,
      status: valid ? 'active' : json?.license_key?.status ?? 'needs_activation',
      instanceId,
      activationLimit: json?.license_key?.activation_limit ?? null,
      uses: Number(json?.license_key?.activation_usage ?? 0),
    }
  } catch {
    return { ok: false, valid: false, provider, error: 'License provider request failed' }
  }
}

export async function activateLicense(input: LicenseRequest): Promise<LicenseResult> {
  const product = input.product.trim().toLowerCase()
  const licenseKey = input.licenseKey.trim()
  const deviceId = (input.deviceId || '').trim()
  if (!allowedProduct(product)) return { ok: false, valid: false, error: 'Unsupported product' }
  if (!licenseKey || !deviceId) return { ok: false, valid: false, error: 'License key and device ID are required' }
  const provider = providerFor(product)
  if (!provider) return { ok: false, valid: false, error: 'License provider is not configured' }

  try {
    const existing = verifyToken(input.token, { product, licenseKey, deviceId })
    if (existing) return verifyLicense(input)

    if (provider === 'payhip') {
      const checked = await payhipVerify(product, licenseKey)
      if (!checked.valid) return { ok: true, valid: false, provider, status: 'invalid' }
      const maxUses = Number(process.env[`PAYHIP_${productEnvKey(product)}_MAX_USES`] || '3')
      const currentUses = Number(checked.data?.uses ?? 0)
      if (Number.isFinite(maxUses) && maxUses > 0 && currentUses >= maxUses) {
        return { ok: true, valid: false, provider, status: 'activation_limit_reached', uses: currentUses, activationLimit: maxUses }
      }
      const usage = await payhipUsage(product, licenseKey)
      if (!usage.ok) return { ok: false, valid: false, provider, error: 'Could not register activation' }
      const token = signToken({ product, licenseHash: licenseHash(licenseKey), deviceId, provider, issuedAt: Date.now() })
      return { ok: true, valid: true, provider, status: 'active', token, uses: Number(usage.data?.uses ?? currentUses + 1), activationLimit: maxUses }
    }

    const { response, json } = await lemonCall('activate', { license_key: licenseKey, instance_name: deviceId.slice(0, 120) })
    const valid = Boolean(response.ok && json?.activated && json?.instance?.id && lemonMatchesProduct(product, json))
    if (!valid) return { ok: true, valid: false, provider, status: json?.license_key?.status ?? 'invalid', error: json?.error ?? undefined }
    const instanceId = String(json.instance.id)
    const token = signToken({ product, licenseHash: licenseHash(licenseKey), deviceId, provider, instanceId, issuedAt: Date.now() })
    return { ok: true, valid: true, provider, status: 'active', token, instanceId, uses: Number(json?.license_key?.activation_usage ?? 0), activationLimit: json?.license_key?.activation_limit ?? null }
  } catch {
    return { ok: false, valid: false, provider, error: 'License activation failed' }
  }
}

export async function deactivateLicense(input: LicenseRequest): Promise<LicenseResult> {
  const product = input.product.trim().toLowerCase()
  const licenseKey = input.licenseKey.trim()
  const deviceId = (input.deviceId || '').trim()
  if (!allowedProduct(product)) return { ok: false, valid: false, error: 'Unsupported product' }
  if (!licenseKey || !deviceId) return { ok: false, valid: false, error: 'License key and device ID are required' }
  const provider = providerFor(product)
  if (!provider) return { ok: false, valid: false, error: 'License provider is not configured' }
  const tokenPayload = verifyToken(input.token, { product, licenseKey, deviceId })
  if (!tokenPayload) return { ok: true, valid: false, provider, status: 'not_activated' }

  try {
    if (provider === 'payhip') {
      const result = await payhipUsage(product, licenseKey, true)
      return { ok: result.ok, valid: false, provider, status: result.ok ? 'deactivated' : 'deactivation_failed', uses: Number(result.data?.uses ?? 0) }
    }
    const instanceId = typeof tokenPayload.instanceId === 'string' ? tokenPayload.instanceId : ''
    if (!instanceId) return { ok: true, valid: false, provider, status: 'not_activated' }
    const { response, json } = await lemonCall('deactivate', { license_key: licenseKey, instance_id: instanceId })
    const ok = Boolean(response.ok && json?.deactivated && lemonMatchesProduct(product, json))
    return { ok, valid: false, provider, status: ok ? 'deactivated' : 'deactivation_failed', uses: Number(json?.license_key?.activation_usage ?? 0), activationLimit: json?.license_key?.activation_limit ?? null }
  } catch {
    return { ok: false, valid: false, provider, error: 'License deactivation failed' }
  }
}
