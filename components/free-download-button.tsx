'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { planetXTrack } from '@/lib/client-analytics'

const FILE_PATH = '/store/free/indie-extension-release-checklist.md'

export function FreeDownloadButton() {
  const [busy, setBusy] = useState(false)

  const download = async () => {
    if (busy) return
    setBusy(true)
    planetXTrack('free_download_started', { resource_id: 'indie-extension-release-checklist', format: 'markdown' }, { sourceSurface: 'store_free_resource' })
    try {
      const response = await fetch(FILE_PATH)
      if (!response.ok) throw new Error(`Download failed with ${response.status}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'Indie-Extension-Release-Checklist.md'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      planetXTrack('free_download_completed', { resource_id: 'indie-extension-release-checklist', format: 'markdown' }, { sourceSurface: 'store_free_resource' })
    } catch {
      window.location.assign(FILE_PATH)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" onClick={download} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-mono text-[11px] font-bold tracking-[.12em] text-white uppercase shadow-[0_8px_30px_rgba(255,43,138,.24)] transition hover:bg-accent disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
      <Download className="size-4" aria-hidden="true" />
      {busy ? 'Preparing…' : 'Download free checklist'}
    </button>
  )
}
