'use client'

/** High-contrast mobile menu trigger: hamburger when closed, X when open. */
export function GradientMenuIcon({ open }: { open: boolean }) {
  const bar =
    'absolute left-1/2 block h-[3px] w-7 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff2e9f] via-[#b44de0] to-[#00eaff] transition-all duration-200'

  return (
    <span className="relative block h-7 w-8" aria-hidden="true">
      <span className={`${bar} ${open ? 'top-3 rotate-45' : 'top-1'}`} />
      <span className={`${bar} top-3 ${open ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`${bar} ${open ? 'top-3 -rotate-45' : 'top-5'}`} />
    </span>
  )
}
