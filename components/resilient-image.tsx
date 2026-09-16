'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ResilientImageProps = {
  src: string
  alt: string
  className?: string
  fallbackLabel?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  unoptimized?: boolean
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'planet.X',
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  unoptimized = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [src])

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} unavailable`}
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,43,138,.18),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,.13),transparent_42%),#07070b]"
      >
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative text-center">
          <div className="text-5xl font-black leading-none tracking-[-.08em] text-primary/90">X</div>
          <div className="mt-2 max-w-48 truncate px-4 font-mono text-[9px] font-bold tracking-[.16em] text-white/55 uppercase">{fallbackLabel}</div>
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span className="relative inline-block shrink-0" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 64}
        height={height ?? 64}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={className}
        onError={() => setFailed(true)}
      />
    </span>
  )
}
