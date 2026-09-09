const BASE = 'https://partner-content-api.epidemicsound.com/v0'

export function isCatalogConfigured() {
  return Boolean(process.env.EPIDEMIC_API_KEY)
}

export async function epidemic(path: string, user?: string) {
  const apiKey = process.env.EPIDEMIC_API_KEY
  if (!apiKey) return { missing: true as const }
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }
  if (user) headers['x-partner-user-id'] = user
  const response = await fetch(`${BASE}${path}`, { headers, cache: 'no-store' })
  const text = await response.text()
  let data: unknown = {}
  try { data = text ? JSON.parse(text) : {} } catch { data = { message: text } }
  return { missing: false as const, ok: response.ok, status: response.status, data }
}

export function normalizeTracks(raw: any) {
  const list = Array.isArray(raw) ? raw : raw?.tracks || raw?.items || raw?.results || raw?.data || []
  return (Array.isArray(list) ? list : []).map((track: any) => ({
    id: String(track.id ?? track.trackId ?? track.recordingId ?? ''),
    title: String(track.title ?? track.name ?? 'Untitled'),
    artist: Array.isArray(track.artists)
      ? track.artists.map((artist: any) => artist?.name || artist).filter(Boolean).join(', ')
      : String(track.artist?.name ?? track.artist ?? track.creator?.name ?? 'Epidemic Sound'),
    bpm: Number(track.bpm ?? track.tempo ?? 0) || null,
    duration: Number(track.duration ?? track.durationMs ?? track.length ?? 0) || null,
    isPreviewOnly: Boolean(track.isPreviewOnly),
    image: track.imageUrl ?? track.coverUrl ?? track.cover?.url ?? track.image?.url ?? null,
  })).filter((track: any) => track.id)
}
