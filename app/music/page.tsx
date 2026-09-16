import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SectionHeading } from '@/components/section-heading'
import { SpotifyEmbed } from '@/components/spotify-embed'
import { YouTubeEmbed } from '@/components/youtube-embed'
import { VideoRollPicker } from '@/components/video-roll-picker'
import { StreamingCarousel } from '@/components/streaming-carousel'
import { GlowPlayer } from '@/components/glow-player'
import type { PlayerTrack } from '@/components/glow-player'
import { SiteFooter } from '@/components/site-footer'
import { XGlyph, XLetter } from '@/components/x-glyph'

const siteUrl = 'https://www.planet-x.co'
const musicUrl = `${siteUrl}/music`

const tracks: PlayerTrack[] = [
  {
    id: 'last-resort-cover',
    title: 'Last Resort (Papa Roach Cover)',
    artist: 'xFactor',
    src: '/music-tracks/covers/last-resort.mp3',
  },
  {
    id: 'sid-and-nancy-cover',
    title: 'Sid & Nancy',
    artist: 'xFactor',
    src: '/music-tracks/covers/sid-and-nancy.mp3',
  },
  {
    id: 'emptiness-machine-cover',
    title: 'The Emptiness Machine',
    artist: 'xFactor',
    src: '/music-tracks/covers/the-emptiness-machine.mp3',
  },
  {
    id: 'butterfly-cover',
    title: 'Butterfly (Crazy Town Cover)',
    artist: 'xFactor',
    src: '/music-tracks/covers/butterfly.m4a',
  },
]

const artistSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'xFactor',
  alternateName: 'X-Factor',
  url: musicUrl,
  description: 'xFactor is the music identity behind the loud-music side of planet.X.',
  sameAs: ['https://music.apple.com/us/artist/x-factor/1067023409'],
}

const albumSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicAlbum',
  name: 'eXperiments',
  url: musicUrl,
  byArtist: {
    '@type': 'Person',
    name: 'xFactor',
    alternateName: 'X-Factor',
    url: musicUrl,
    sameAs: ['https://music.apple.com/us/artist/x-factor/1067023409'],
  },
  sameAs: [
    'https://open.spotify.com/album/31KoC0LRVGDfHMFFLWfrqo',
    'https://music.apple.com/au/album/experiments/1813787168',
    'https://music.amazon.com/albums/B0F88RG79F?marketplaceId=ATVPDKIKX0DER&musicTerritory=US',
    'https://www.pandora.com/artist/xfactor/experiments/ALk9nf69chl2gz6',
    'https://music.youtube.com/playlist?list=OLAK5uy_nf4CT2njycLaS6bKfKMxVP1sKie9v9k9U&si=GZwc4M6rV-fvdmGr',
    'https://soundcloud.com/x-factor-554429885/sets/experiments',
  ],
}

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(albumSchema) }} />
      <SiteHeader />
      <main>
        {/* Title, offset by the quick-listen player */}
        <section className="border-b border-border pt-14 md:pt-16">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-8 md:pb-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-[0.7rem] tracking-[0.28em] text-accent uppercase">
                  Out on every platform
                </p>
                <h1 className="mt-2 text-3xl leading-none font-bold tracking-tight text-balance uppercase sm:text-4xl md:text-6xl">
                  <XGlyph variant="grunge" />Factor Music
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Late-night loud music written in the same room as the code.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  xFactor is the music side of planet.X: original releases, the <strong className="font-semibold text-foreground">eXperiments</strong> album, music videos, and a rotating set of cover recordings. The same creative system also feeds experiments like Visual.X, where songs become interactive audio-reactive worlds instead of stopping at the player.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase">
                  <a href="#streaming" className="rounded-lg border border-border px-4 py-3 text-accent transition-colors hover:border-primary hover:text-primary">Stream xFactor</a>
                  <Link href="/visual-x" className="rounded-lg border border-border px-4 py-3 text-muted-foreground transition-colors hover:border-cyan-300/50 hover:text-foreground">Open Visual.X</Link>
                </div>
              </div>

              <div className="w-full max-w-xs lg:mt-2 lg:shrink-0">
                <p className="mb-2 font-mono text-[0.65rem] tracking-[0.16em] text-accent uppercase">
                  Just some <XLetter />Factor cover songs, check &apos;em out
                </p>
                <GlowPlayer tracks={tracks} compact />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="lg:mt-10">
                <SectionHeading
                  eyebrow="Stream it everywhere"
                  title={
                    <>
                      Experience the{' '}
                      <span className="inline-block whitespace-nowrap">
                        e<XGlyph />periments
                      </span>{' '}
                      Album
                    </>
                  }
                  description="Stream the xFactor eXperiments album from planet.X and jump to the major listening platforms below."
                />
                <div className="mt-6 max-w-2xl">
                  <SpotifyEmbed />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <SectionHeading
              eyebrow="Watch"
              title="xFactor Music Videos"
              description="Watch an xFactor music video here, then use the video roll to move through more releases."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
              <YouTubeEmbed />
              <VideoRollPicker />
            </div>
          </div>
        </section>

        <section id="streaming" className="scroll-mt-32">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <SectionHeading
              eyebrow={
                <>
                  Find <XLetter />Factor
                </>
              }
              title="Everywhere You Listen"
              description="Find the xFactor eXperiments album across Spotify, Apple Music, Amazon Music, Pandora, YouTube Music, and SoundCloud."
            />
            <div className="mt-6">
              <StreamingCarousel />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
