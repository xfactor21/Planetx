import { NextResponse } from 'next/server'
import { isCatalogConfigured } from '@/lib/visualx-catalog'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ provider: 'Epidemic Sound', configured: isCatalogConfigured() })
}
