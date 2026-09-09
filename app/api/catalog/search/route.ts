import { NextResponse } from 'next/server'
import { epidemic, normalizeTracks } from '@/lib/visualx-catalog'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = (searchParams.get('q') || '').trim()
  const user = searchParams.get('user') || undefined
  if (term.length < 2) return NextResponse.json({ error: 'Enter at least 2 characters.' }, { status: 400 })
  const result = await epidemic(`/tracks/search?limit=12&term=${encodeURIComponent(term)}`, user)
  if (result.missing) return NextResponse.json({ configured: false, tracks: [] })
  if (!result.ok) return NextResponse.json({ error: `Epidemic Sound search failed (${result.status}).` }, { status: result.status })
  return NextResponse.json({ configured: true, tracks: normalizeTracks(result.data) })
}
