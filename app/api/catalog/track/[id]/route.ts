import { NextResponse } from 'next/server'
import { epidemic } from '@/lib/visualx-catalog'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const user = searchParams.get('user') || undefined
  const result = await epidemic(`/tracks/${encodeURIComponent(id)}/download?format=mp3&quality=normal`, user)
  if (result.missing) return NextResponse.json({ error: 'Epidemic Sound is not configured.' }, { status: 503 })
  if (!result.ok) return NextResponse.json({ error: `Track access failed (${result.status}).` }, { status: result.status })
  const data = result.data as { url?: string; expires?: string }
  return NextResponse.json({ url: data.url, expires: data.expires })
}
