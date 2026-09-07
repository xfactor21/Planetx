type RateBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return req.headers.get('x-real-ip') || 'unknown'
}

export function rejectOversizedBody(req: Request, maxBytes: number) {
  const contentLength = Number(req.headers.get('content-length') || '0')
  return Number.isFinite(contentLength) && contentLength > maxBytes
}

export function consumeRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now()
  const key = `${scope}:${clientIp(req)}`
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) }
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  buckets.set(key, current)
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  }
}

export function looksAutomated(startedAt: unknown, honeypot: unknown) {
  if (typeof honeypot === 'string' && honeypot.trim()) return true
  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt)) return true

  const elapsed = Date.now() - startedAt
  return elapsed < 700 || elapsed > 2 * 60 * 60 * 1000
}
