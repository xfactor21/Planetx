'use client'

import { useRef } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  AmazonMusicIcon,
  AppleMusicIcon,
  PandoraIcon,
  SoundCloudIcon,
  SpotifyIcon,
  YouTubeMusicIcon,
} from '@/components/streaming-icons'

type Platform = {
  name: string
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  href: string
}

const PLATFORMS: Platform[] = [
  {
    name: 'Spotify',
    Icon: SpotifyIcon,
    color: '#1DB954',
    href: 'https://open.spotify.com/album/31KoC0LRVGDfHMFFLWfrqo',
  },
  {
    name: 'Apple Music',
    Icon: AppleMusicIcon,
    color: '#FA2D6E',
    href: 'https://music.apple.com/au/album/experiments/1813787168',
  },
  {
    name: 'Amazon Music',
    Icon: AmazonMusicIcon,
    color: '#00A8E1',
    href: 'https://music.amazon.com/albums/B0F88RG79F?marketplaceId=ATVPDKIKX0DER&musicTerritory=US',
  },
  {
    name: 'Pandora',
    Icon: PandoraIcon,
    color: '#3668FF',
    href: 'https://www.pandora.com/artist/xfactor/experiments/ALk9nf69chl2gz6',
  },
  {
    name: 'YouTube Music',
    Icon: YouTubeMusicIcon,
    color: '#FF0000',
    href: 'https://music.youtube.com/playlist?list=OLAK5uy_nf4CT2njycLaS6bKfKMxVP1sKie9v9k9U&si=GZwc4M6rV-fvdmGr',
  },
  {
    name: 'SoundCloud',
    Icon: SoundCloudIcon,
    color: '#FF7700',
    href: 'https://soundcloud.com/x-factor-554429885/sets/experiments',
  },
]

export function StreamingCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollByAmount(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {PLATFORMS.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-56 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-35"
              style={{ background: platform.color }}
            />
            <platform.Icon className="relative size-10" style={{ color: platform.color }} />
            <div className="relative mt-8">
              <p className="text-lg font-bold tracking-tight uppercase">{platform.name}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
                Listen now
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
