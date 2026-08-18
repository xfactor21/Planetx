'use client'

/**
 * Bigger nav trigger icon. Three bars, each a different point along the
 * pink-to-cyan gradient, morphing into an X when open.
 */
export function GradientMenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bar-1" x1="0" y1="0" x2="26" y2="0">
          <stop offset="0%" stopColor="#ff2e9f" />
          <stop offset="100%" stopColor="#ff7fc4" />
        </linearGradient>
        <linearGradient id="bar-2" x1="0" y1="0" x2="26" y2="0">
          <stop offset="0%" stopColor="#c04ecf" />
          <stop offset="100%" stopColor="#5aa8f2" />
        </linearGradient>
        <linearGradient id="bar-3" x1="0" y1="0" x2="26" y2="0">
          <stop offset="0%" stopColor="#00c8f5" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>
      </defs>
      <line
        x1="3"
        y1={open ? 13 : 6}
        x2={open ? 23 : 23}
        y2={open ? 13 : 6}
        stroke="url(#bar-1)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.25s ease, y 0.25s ease',
        }}
      />
      <line
        x1="3"
        y1="13"
        x2="23"
        y2="13"
        stroke="url(#bar-2)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          opacity: open ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      />
      <line
        x1="3"
        y1={open ? 13 : 20}
        x2={open ? 23 : 23}
        y2={open ? 13 : 20}
        stroke="url(#bar-3)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          transformOrigin: 'center',
          transform: open ? 'rotate(-45deg)' : 'none',
          transition: 'transform 0.25s ease, y 0.25s ease',
        }}
      />
    </svg>
  )
}
