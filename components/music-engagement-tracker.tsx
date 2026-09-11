'use client'

import { useEffect, useRef } from 'react'
import { planetXTrack } from '@/lib/client-analytics'

const MUSIC_LISTENER_KEY = 'planetx_music_listener'

export function MusicEngagementTracker() {
  const mountedAt = useRef<number | null>(null)
  const firstPlayTracked = useRef(false)

  useEffect(() => {
    mountedAt.current = Date.now()

    function details(target: HTMLAudioElement) {
      const src = target.currentSrc || target.src || 'unknown'
      return {
        track_id: target.dataset.trackId || src.split('/').pop() || 'unknown',
        track_title: target.dataset.trackTitle || null,
        seconds_elapsed: Math.max(0, Math.round(target.currentTime || 0)),
      }
    }

    function onPlay(event: Event) {
      const target = event.target
      if (!(target instanceof HTMLAudioElement)) return

      try {
        window.localStorage.setItem(MUSIC_LISTENER_KEY, '1')
      } catch {}

      const isFirstPlay = !firstPlayTracked.current
      firstPlayTracked.current = true
      planetXTrack('music_play', {
        ...details(target),
        first_play: isFirstPlay,
        seconds_to_play:
          isFirstPlay && mountedAt.current
            ? Math.max(0, Math.round((Date.now() - mountedAt.current) / 1000))
            : null,
      })
    }

    function onPause(event: Event) {
      const target = event.target
      if (!(target instanceof HTMLAudioElement) || target.ended) return
      planetXTrack('music_pause', details(target))
    }

    function onEnded(event: Event) {
      const target = event.target
      if (!(target instanceof HTMLAudioElement)) return
      planetXTrack('music_track_complete', details(target))
    }

    document.addEventListener('play', onPlay, true)
    document.addEventListener('pause', onPause, true)
    document.addEventListener('ended', onEnded, true)
    return () => {
      document.removeEventListener('play', onPlay, true)
      document.removeEventListener('pause', onPause, true)
      document.removeEventListener('ended', onEnded, true)
    }
  }, [])

  return null
}

export function hasListenedToMusic() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(MUSIC_LISTENER_KEY) === '1'
  } catch {
    return false
  }
}
