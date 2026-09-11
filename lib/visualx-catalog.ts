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

type CatalogRecord = Record<string, unknown>

function asRecord(value: unknown): CatalogRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as CatalogRecord
    : {}
}

function nestedString(record: CatalogRecord, field: string, nestedField = 'name') {
  const value = record[field]
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  const nested = asRecord(value)[nestedField]
  return typeof nested === 'string' || typeof nested === 'number' ? String(nested) : ''
}

export function normalizeTracks(raw: unknown) {
  const root = asRecord(raw)
  const candidate = Array.isArray(raw)
    ? raw
    : root.tracks ?? root.items ?? root.results ?? root.data ?? []
  const list = Array.isArray(candidate) ? candidate : []

  return list
    .map((value) => {
      const track = asRecord(value)
      const artists = Array.isArray(track.artists)
        ? track.artists
            .map((artist) => nestedString(asRecord(artist), 'name') || String(artist ?? ''))
            .filter(Boolean)
            .join(', ')
        : nestedString(track, 'artist') || nestedString(track, 'creator') || 'Epidemic Sound'

      return {
        id: String(track.id ?? track.trackId ?? track.recordingId ?? ''),
        title: String(track.title ?? track.name ?? 'Untitled'),
        artist: artists,
        bpm: Number(track.bpm ?? track.tempo ?? 0) || null,
        duration: Number(track.duration ?? track.durationMs ?? track.length ?? 0) || null,
        isPreviewOnly: Boolean(track.isPreviewOnly),
        image:
          nestedString(track, 'imageUrl') ||
          nestedString(track, 'coverUrl') ||
          nestedString(track, 'cover', 'url') ||
          nestedString(track, 'image', 'url') ||
          null,
      }
    })
    .filter((track) => track.id)
}
