'use client'

/**
 * The "Navigate, yo!" prompt with a hand-drawn gradient arrow pointing at
 * the mobile nav trigger. When the menu opens, it cross-fades into a
 * "Let's f**king go!" state with small arrows pointing down at the dropdown.
 */
export function NavPrompt({ open }: { open: boolean }) {
  return (
    <div className="relative flex h-10 flex-1 items-center justify-end overflow-hidden pr-2">
      {/* Closed state: squiggly arrow + "Navigate, yo!" */}
      <div
        className={`absolute inset-0 flex items-center justify-end gap-2 transition-all duration-300 ${
          open
            ? 'pointer-events-none -translate-y-2 opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <span className="font-mono text-[0.7rem] tracking-[0.14em] text-primary uppercase">
          Navigate, yo!
        </span>
        <svg
          width="52"
          height="28"
          viewBox="0 0 52 28"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="nav-arrow-grad" x1="0" y1="0" x2="52" y2="28">
              <stop offset="0%" stopColor="#ff2e9f" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>
          </defs>
          <path
            d="M2 6c8 2 14 -2 18 2s-4 8 4 8 20-8 24-4"
            stroke="url(#nav-arrow-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 6l8 6-9 4"
            stroke="url(#nav-arrow-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Open state: small down-arrows + "Let's f**king go!" */}
      <div
        className={`absolute inset-0 flex items-center justify-end gap-2 transition-all duration-300 ${
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2l6 9 6-9"
            stroke="url(#nav-arrow-grad-2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <defs>
            <linearGradient id="nav-arrow-grad-2" x1="0" y1="0" x2="16" y2="14">
              <stop offset="0%" stopColor="#ff2e9f" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.1em] text-accent uppercase">
          Let&apos;s f**king go!
        </span>
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2l6 9 6-9"
            stroke="url(#nav-arrow-grad-3)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <defs>
            <linearGradient id="nav-arrow-grad-3" x1="0" y1="0" x2="16" y2="14">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#ff2e9f" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
