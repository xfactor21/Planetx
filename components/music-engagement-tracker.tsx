'use client'

import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'

const MUSIC_LISTENER_KEY = 'planetx_music_listener'

export function MusicEngagementTracker() {
  const mountedAt = useRef(Date.now())
  const firstPlayTracked = useRef(false)

  useEffect(() => {
    function onPlay(event: Event) {
      const target = event.target
      if (!(target instanceof HTMLAudioElement)) return

      try {
        window.localStorage.setItem(MUSIC_LISTENER_KEY, '1')
      } catch {}

      const src = target.currentSrc || target.src || 'unknown'

      if (!firstPlayTracked.current) {
        firstPlayTracked.current = true
        track('music_first_play', {
          secondsToPlay: Math.max(0, Math.round((Date.now() - mountedAt.current) / 1000)),
          source: src.split('/').pop() || 'unknown',
        })
      } else {
        track('music_play', {
          source: src.split('/').pop() || 'unknown',
        })
      }
    }

    document.addEventListener('play', onPlay, true)
    return () => document.removeEventListener('play', onPlay, true)
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
