'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { withXGlyph } from '@/components/x-glyph'

export type PlayerTrack = {
  id: string
  title: string
  artist: string
  src: string
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Compact glow-styled player. Visually matches the planet.X player widget
 * (pink/cyan gradient glow card) but is our own lightweight component —
 * download-via-checkbox instead of upload, no Spotify-connect button.
 */
export function GlowPlayer({
  tracks,
  compact = false,
}: {
  tracks: PlayerTrack[]
  compact?: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const track = tracks[trackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => {
      if (trackIndex < tracks.length - 1) {
        setTrackIndex((i) => i + 1)
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(0)
    if (isPlaying) audio.play().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  function goNext() {
    setTrackIndex((i) => (i + 1) % tracks.length)
  }

  function goPrev() {
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const value = Number(e.target.value)
    audio.currentTime = value
    setCurrentTime(value)
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function downloadSelected() {
    const toDownload = tracks.filter((t) => selected.has(t.id))
    for (const t of toDownload) {
      const a = document.createElement('a')
      a.href = t.src
      a.download = `${t.title}.${t.src.split('.').pop()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="pxp-glow-card relative overflow-hidden rounded-2xl border p-4"
      style={{
        background: '#07020a',
        borderColor: 'rgba(255, 46, 159, 0.25)',
        boxShadow:
          '0 0 40px -18px rgba(255, 46, 159, 0.5), 0 0 28px -18px rgba(0, 245, 255, 0.4)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        style={{
          background:
            'linear-gradient(120deg, rgba(255,46,159,.25), transparent 45%, rgba(0,245,255,.2))',
        }}
      />
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-bold"
            style={{
              background: 'linear-gradient(90deg, #ff2e9f, #00f5ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {track.title}
          </p>
          <p className="truncate text-xs" style={{ color: '#b8a8b5' }}>
            {withXGlyph(track.artist, true)}
          </p>
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous track"
          className="flex size-7 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white"
        >
          <SkipBack className="size-4" fill="currentColor" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-black transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ff2e9f, #00f5ff)',
            boxShadow: '0 0 20px -4px #ff2e9f',
          }}
        >
          {isPlaying ? (
            <Pause className="size-4" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 size-4" fill="currentColor" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next track"
          className="flex size-7 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white"
        >
          <SkipForward className="size-4" fill="currentColor" aria-hidden="true" />
        </button>
      </div>

      <div className="relative mt-3 flex items-center gap-2">
        <span className="w-8 shrink-0 font-mono text-[0.65rem] tabular-nums" style={{ color: '#b8a8b5' }}>
          {formatTime(currentTime)}
        </span>
        <div className="relative h-[5px] flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.12)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff2e9f, #00f5ff)',
              boxShadow: '0 0 10px -2px #ff2e9f',
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
          className="sr-only"
        />
        <span className="w-8 shrink-0 font-mono text-[0.65rem] tabular-nums" style={{ color: '#b8a8b5' }}>
          {formatTime(duration)}
        </span>
      </div>

      {!compact ? (
        <div className="relative mt-4 border-t pt-3" style={{ borderColor: 'rgba(255,46,159,.15)' }}>
          <ul className="flex flex-col gap-1">
            {tracks.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(t.id)}
                  onChange={() => toggleSelected(t.id)}
                  aria-label={`Select ${t.title} for download`}
                  className="size-3.5 shrink-0 accent-[#ff2e9f]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTrackIndex(tracks.indexOf(t))
                    setIsPlaying(true)
                  }}
                  className="min-w-0 flex-1 truncate text-left text-xs text-white/70 hover:text-white"
                >
                  {t.title}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={downloadSelected}
            disabled={selected.size === 0}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide transition-opacity disabled:opacity-40"
            style={{
              borderColor: 'rgba(0,245,255,.4)',
              color: '#00f5ff',
            }}
          >
            <Download className="size-3.5" aria-hidden="true" />
            Download {selected.size > 0 ? `(${selected.size})` : ''}
          </button>
        </div>
      ) : null}
    </div>
  )
}
