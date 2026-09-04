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

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* Title, offset by the quick-listen player */}
        <section className="border-b border-border pt-14 md:pt-16">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-8 md:pb-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <p className="font-mono text-[0.7rem] tracking-[0.28em] text-accent uppercase">
                  Out on every platform
                </p>
                <h1 className="mt-2 text-3xl leading-none font-bold tracking-tight text-balance uppercase sm:text-4xl md:text-6xl">
                  <XGlyph variant="grunge" />Factor Music
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Late-night loud music written in the same room as
                  the code.
                </p>
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
              title="Music Video"
              description="Here's one music video, but there's plenty more where that came from."
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
              description="Every major platform, one tap away."
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
