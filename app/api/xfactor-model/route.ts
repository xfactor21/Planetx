import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { gunzipSync } from 'node:zlib'

export const runtime = 'nodejs'

let cachedModel: Uint8Array | null = null

async function getModel() {
  if (cachedModel) return cachedModel

  const sourcePath = path.join(
    process.cwd(),
    'public',
    'models',
    'xfactor',
    'model.glb.gz.b64',
  )
  const encoded = await readFile(sourcePath, 'utf8')
  const compressed = Buffer.from(encoded.replace(/\s+/g, ''), 'base64')
  cachedModel = new Uint8Array(gunzipSync(compressed))
  return cachedModel
}

export async function GET() {
  const model = await getModel()
  return new Response(model, {
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'Content-Disposition': 'inline; filename="xfactor-rigged-animated.glb"',
    },
  })
}
