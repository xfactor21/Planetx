import Image from 'next/image'
import { Fragment } from 'react'

const VARIANTS = {
  clean: '/brand/x-glyph.png',
  grunge: '/brand/x-mark-grunge.png',
} as const

type Variant = keyof typeof VARIANTS

/**
 * Renders the brand X glyph inline with text, sized ~55% larger than the
 * surrounding font size and nudged to sit on the baseline. Use in place of
 * a literal "X" character in headings/wordmarks (e.g. "planet.X", "xFactor",
 * "CorteX") — not for ordinary words that happen to contain an x.
 */
export function XGlyph({
  className = '',
  variant = 'clean',
}: {
  className?: string
  variant?: Variant
}) {
  return (
    <Image
      src={VARIANTS[variant]}
      alt="X"
      width={1600}
      height={1600}
      className={`relative inline-block h-[1.55em] w-[1.55em] -translate-y-[0.1em] align-middle object-contain ${className}`}
    />
  )
}

/**
 * Plain-text fallback for small sizes where the detailed image glyph would
 * render too small to read cleanly (nav labels, footer, eyebrow text).
 * Same font, ~45% bigger, pink — no gradient image.
 */
export function XLetter({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block text-[1.45em] leading-none font-bold text-[#ff2e9f] ${className}`}
    >
      X
    </span>
  )
}

/**
 * Takes a brand string (e.g. "xOS", "CorteX", "xFactor Music") and returns
 * JSX with every standalone "X"/"x" swapped for the styled glyph — image by
 * default, or plain XLetter when `small` is set for tight text sizes.
 * Splits on capital or lowercase X only; safe for names like "Voice Studio X".
 * Pass `variant` to pick which image glyph is used (ignored when small).
 * Each X + the word-fragment right after it is wrapped so the line can't
 * break between the glyph and its letters.
 */
export function withXGlyph(
  text: string,
  small = false,
  variant: Variant = 'clean',
): React.ReactNode {
  // Split into whitespace-separated chunks first, so nowrap wrapping never
  // spans an actual space (which would prevent the text from wrapping at all).
  const words = text.split(/(\s+)/)
  return words.map((word, wi) => {
    if (/^\s+$/.test(word)) return word
    const parts = word.split(/([Xx])/)
    if (parts.length === 1) return <Fragment key={wi}>{word}</Fragment>
    return (
      <span key={wi} className="inline-block whitespace-nowrap">
        {parts.map((part, i) =>
          part === 'X' || part === 'x' ? (
            small ? (
              <XLetter key={i} />
            ) : (
              <XGlyph key={i} variant={variant} />
            )
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
      </span>
    )
  })
}
