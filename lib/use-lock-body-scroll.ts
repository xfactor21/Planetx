'use client'

import { useEffect } from 'react'

/**
 * Locks page scroll while `active` is true — used by full-screen modals and
 * overlays so the page behind them doesn't scroll while they're open.
 * Restores the previous overflow value on cleanup/unmount.
 */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [active])
}
