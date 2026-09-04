import Image from 'next/image'
import { Fragment } from 'react'

type XCase = 'lower' | 'upper'

export function XGlyph({ className = '', xCase = 'upper', variant = 'clean' }: { className?: string; xCase?: XCase; variant?: 'clean' | 'grunge' }) {
  const lower = xCase === 'lower'
  return (
    <Image
      src={lower ? '/brand/lowercase_x_transparent.png' : '/brand/uppercase_X_transparent.png'}
      alt={lower ? 'x' : 'X'}
      width={1600}
      height={1600}
      className={`${lower ? 'nx-lowercase' : 'nx-uppercase'} ${variant === 'grunge' && !lower ? 'grunge-x-glyph' : ''} ${className}`}
    />
  )
}

export function XLetter({ className = '', xCase = 'upper' }: { className?: string; xCase?: XCase }) {
  return <XGlyph className={className} xCase={xCase} />
}

export function withXGlyph(text: string, _small = false, _variant: 'clean' | 'grunge' = 'clean'): React.ReactNode {
  const words = text.split(/(\s+)/)
  return words.map((word, wi) => {
    if (/^\s+$/.test(word)) return word
    const parts = word.split(/([Xx])/)
    if (parts.length === 1) return <Fragment key={wi}>{word}</Fragment>
    return (
      <span key={wi} className="inline-block whitespace-nowrap">
        {parts.map((part, i) => {
          if (part !== 'X' && part !== 'x') return <Fragment key={i}>{part}</Fragment>
          // Brand rule: an X that starts a word is always the small/lowercase master
          // (xFactor, xMemoirs, xIDE, xConnect). Elsewhere preserve the written case.
          const startsWord = i === 0
          return <XGlyph key={i} xCase={startsWord || part === 'x' ? 'lower' : 'upper'} />
        })}
      </span>
    )
  })
}
