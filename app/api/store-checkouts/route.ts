import { NextResponse } from 'next/server'

const STORE_URL = 'https://payhip.com/planetX'

const aliases: Record<string, string[]> = {
  'essential-ui-sounds': ['Essential UI Sounds Vol. 1', 'Essential UI Sounds'],
  'digital-glitch-fx': ['Digital Glitch + Transition FX Vol. 1', 'Digital Glitch + Transition FX'],
  'indie-launch-kit': ['Indie App Creator Launch Kit'],
  'creator-asset-forge': ['Creator Asset Forge'],
  'creator-stream-pack': ['Creator Stream Pack'],
  'interface-hud-kit': ['Interface HUD Kit'],
  'website-atmosphere-pack': ['Website Atmosphere Pack'],
  'creator-editing-overlays': ['Creator Editing Overlays'],
  'digital-worlds-wallpapers': ['Digital Worlds Wallpaper Pack', 'Digital Worlds Wallpapers'],
  'producer-transitions-impacts': ['Producer Transitions + Impacts Vol. 1', 'Producer Transitions + Impacts'],
}

function decodeMarkup(value: string) {
  return value
    .replace(/\\u002F/gi, '/')
    .replace(/\\u0026/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:x27|39);/gi, "'")
    .replace(/&amp;/gi, '&')
}

function nearestProductUrl(markup: string, names: string[]) {
  const lower = markup.toLowerCase()
  let best: { href: string; distance: number } | null = null

  for (const name of names) {
    const needle = name.toLowerCase()
    let cursor = 0

    while (cursor < lower.length) {
      const index = lower.indexOf(needle, cursor)
      if (index === -1) break

      const start = Math.max(0, index - 6000)
      const end = Math.min(markup.length, index + 6000)
      const window = markup.slice(start, end)
      const pattern = /(?:https?:\/\/payhip\.com)?\/b\/([A-Za-z0-9_-]+)/g
      let match: RegExpExecArray | null

      while ((match = pattern.exec(window))) {
        const href = `https://payhip.com/b/${match[1]}`
        const absolute = start + (match.index ?? 0)
        const distance = Math.abs(absolute - index)
        if (!best || distance < best.distance) best = { href, distance }
      }

      cursor = index + needle.length
    }
  }

  return best?.href ?? null
}

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get('debug') === 'resolver'

  try {
    const response = await fetch(STORE_URL, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; planet.X storefront resolver/1.1)',
      },
      cache: debug ? 'no-store' : undefined,
      next: debug ? undefined : { revalidate: 300 },
      redirect: 'follow',
    })

    if (!response.ok) {
      return NextResponse.json(
        debug
          ? { checkouts: {}, available: false, diagnostic: { status: response.status, finalUrl: response.url } }
          : { checkouts: {}, available: false },
        { status: 200, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const markup = decodeMarkup(await response.text())
    const checkouts = Object.fromEntries(
      Object.entries(aliases)
        .map(([id, names]) => [id, nearestProductUrl(markup, names)] as const)
        .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
    )

    if (debug) {
      const linkMatches = Array.from(markup.matchAll(/(?:https?:\/\/payhip\.com)?\/(?:b|buy)[^\s"'<>]*/gi))
        .slice(0, 30)
        .map((match) => match[0])
      const nameHits = Object.fromEntries(
        Object.entries(aliases).map(([id, names]) => [id, names.some((name) => markup.toLowerCase().includes(name.toLowerCase()))]),
      )

      return NextResponse.json({
        checkouts,
        available: Object.keys(checkouts).length > 0,
        diagnostic: {
          status: response.status,
          finalUrl: response.url,
          length: markup.length,
          title: markup.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] ?? null,
          nameHits,
          linkMatches,
        },
      }, { headers: { 'Cache-Control': 'no-store' } })
    }

    return NextResponse.json(
      { checkouts, available: Object.keys(checkouts).length > 0 },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    return NextResponse.json(
      debug
        ? { checkouts: {}, available: false, diagnostic: { error: error instanceof Error ? error.message : 'unknown' } }
        : { checkouts: {}, available: false },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
