import Image from 'next/image'
import { Fragment } from 'react'

type XCase = 'lower' | 'upper'

export function XGlyph({ className = '', variant = 'clean' }: { className?: string; xCase?: XCase; variant?: 'clean' | 'grunge' }) {
  return (
    <Image
      src="/brand/uppercase_X_transparent.png"
      alt="X"
      width={1600}
      height={1600}
      className={`nx-uppercase ${variant === 'grunge' ? 'grunge-x-glyph' : ''} ${className}`}
    />
  )
}

export function XLetter({ className = '' }: { className?: string; xCase?: XCase }) {
  return <XGlyph className={className} />
}

export function withXGlyph(text: string, _small = false, _variant: 'clean' | 'grunge' = 'clean'): React.ReactNode {
  const words = text.split(/(\s+)/)
  return words.map((word, wi) => {
    if (/^\s+$/.test(word)) return word
    const parts = word.split(/([Xx])/)
    if (parts.length === 1) return <Fragment key={wi}>{word}</Fragment>
    return (
      <span key={wi} className="inline-block whitespace-nowrap">
        {parts.map((part, i) =>
          part === 'X' || part === 'x' ? <XGlyph key={i} /> : <Fragment key={i}>{part}</Fragment>
        )}
      </span>
    )
  })
}
