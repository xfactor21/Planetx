import { NextResponse } from 'next/server'
import { PAYHIP_CHECKOUTS } from '@/lib/store-catalog'

const configuredCheckouts: Record<string, string | undefined> = {
  'essential-ui-sounds': process.env.XUPPLY_CHECKOUT_ESSENTIAL_UI_SOUNDS,
  'digital-glitch-fx': process.env.XUPPLY_CHECKOUT_DIGITAL_GLITCH_FX,
  'indie-launch-kit': process.env.XUPPLY_CHECKOUT_INDIE_LAUNCH_KIT,
  'creator-asset-forge': process.env.XUPPLY_CHECKOUT_CREATOR_ASSET_FORGE,
  'creator-stream-pack': process.env.XUPPLY_CHECKOUT_CREATOR_STREAM_PACK,
  'interface-hud-kit': process.env.XUPPLY_CHECKOUT_INTERFACE_HUD_KIT,
  'website-atmosphere-pack': process.env.XUPPLY_CHECKOUT_WEBSITE_ATMOSPHERE_PACK,
  'creator-editing-overlays': process.env.XUPPLY_CHECKOUT_CREATOR_EDITING_OVERLAYS,
  'digital-worlds-wallpapers': process.env.XUPPLY_CHECKOUT_DIGITAL_WORLDS_WALLPAPERS,
  'producer-transitions-impacts': process.env.XUPPLY_CHECKOUT_PRODUCER_TRANSITIONS_IMPACTS,
  'build-sell-indie-creator-tools': process.env.XUPPLY_CHECKOUT_BUILD_SELL_INDIE_CREATOR_TOOLS,
}

function normalizeCheckout(value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://payhip.com/b/${trimmed.replace(/^\/+|\/+$/g, '')}`
}

export async function GET() {
  const productIds = new Set([
    ...Object.keys(PAYHIP_CHECKOUTS),
    ...Object.keys(configuredCheckouts),
  ])
  const checkouts = Object.fromEntries(
    [...productIds]
      .map((id) => [id, normalizeCheckout(configuredCheckouts[id]) ?? PAYHIP_CHECKOUTS[id]] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
  )

  return NextResponse.json(
    { checkouts, available: Object.keys(checkouts).length > 0 },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  )
}
