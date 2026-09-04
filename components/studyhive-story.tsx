import Image from 'next/image'
import { Download, Radio } from 'lucide-react'
import { HexMark } from '@/components/hex-mark'
import { MiniAudioPlayer } from '@/components/mini-audio-player'
import { cn } from '@/lib/utils'

function VideoFrame({
  src,
  orientation,
  className,
}: {
  src: string
  orientation: 'landscape' | 'portrait'
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-amber-400/20 bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_20px_60px_-15px_rgba(251,191,36,0.15)]',
        orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video',
        className,
      )}
    >
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <HexMark className="pointer-events-none absolute -right-3 -top-3 size-12 text-amber-400/40" />
    </div>
  )
}

function StoryRow({
  video,
  eyebrow,
  heading,
  body,
  reverse,
}: {
  video: React.ReactNode
  eyebrow: string
  heading: string
  body: string
  reverse?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-8 lg:items-center lg:gap-14',
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="w-full max-w-xs shrink-0 lg:w-72">{video}</div>
      <div className="w-full lg:flex-1">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-amber-400 uppercase">
          <HexMark className="size-5" />
          {eyebrow}
        </div>
        <h3 className="mt-3 text-2xl leading-tight font-bold tracking-tight text-balance uppercase md:text-3xl">
          {heading}
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  )
}

export function StudyHiveStory() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-[oklch(0.13_0.01_60)] to-background">
      {/* subtle hex texture, warm-tinted */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <HexMark className="absolute left-[6%] top-[8%] size-16 text-amber-400/10" />
        <HexMark className="absolute right-[8%] top-[30%] size-24 text-amber-400/[0.07]" />
        <HexMark className="absolute left-[14%] bottom-[20%] size-20 text-amber-400/[0.08]" />
        <HexMark className="absolute right-[16%] bottom-[6%] size-12 text-amber-400/10" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        {/* Hero video + big statement */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="w-full lg:w-3/5">
            <VideoFrame
              src="/studyhive-videos/StudyHive_final-1.mp4"
              orientation="landscape"
            />
          </div>
          <div className="w-full lg:w-2/5">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-amber-400 uppercase">
              <HexMark className="size-5" />
              Watch the full story
            </div>
            <h2 className="mt-4 text-4xl leading-[0.95] font-bold tracking-tight text-balance uppercase md:text-6xl">
              Get to know{' '}
              <span className="text-amber-400">StudyHive</span> now
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Four and a half minutes on what StudyHive actually is, and why
              it exists.
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed radio audio banner */}
      <div className="relative border-y border-amber-400/25 bg-black/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:gap-8 md:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <Radio className="size-10 text-amber-400" aria-hidden="true" />
            <p className="text-lg leading-tight font-bold tracking-tight text-balance uppercase md:text-xl">
              Listen to them discuss{' '}
              <span className="text-amber-400">IN DEPTH</span> on the radio!!
            </p>
          </div>
          <MiniAudioPlayer
            src="/studyhive-media/studyhive-radio-discussion.m4a"
            className="flex-1"
          />
        </div>

        {/* Deck download, directly under the audio banner */}
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-8">
          <a
            href="/studyhive-media/studyhive-deck.pptx"
            download
            className="group inline-flex items-center gap-2 border border-amber-400/30 bg-background/40 px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-amber-400 uppercase transition-colors hover:bg-amber-400/10"
          >
            <Download className="size-5" aria-hidden="true" />
            Download the full presentation deck
          </a>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        <div className="flex flex-col">
          <StoryRow
            video={
              <VideoFrame
                src="/studyhive-videos/How_StudyHive_Engineers_Social_Kindness.mp4"
                orientation="portrait"
              />
            }
            eyebrow="The social shift"
            heading="Helpfulness is the new flex"
            body="StudyHive isn’t built around follower counts or a popularity contest. Its reputation system gives helpfulness real weight — sharing useful notes, answering questions, and showing up for classmates can become the kind of status you earn rather than buy."
          />

          <div className="lg:-mt-32">
            <StoryRow
              video={
                <VideoFrame
                  src="/studyhive-videos/How_StudyHive_Turns_Help_Into_Status.mp4"
                  orientation="portrait"
                />
              }
              eyebrow="The Hunnies economy"
              heading="Kindness, made visible"
              body="Every time someone shows up for a classmate — sharing notes, answering a question, checking in — it earns Hunnies. Spend them on gifts, flair, or just let the reputation speak for itself."
              reverse
            />
          </div>

          <div className="lg:-mt-32">
            <StoryRow
              video={
                <VideoFrame
                  src="/studyhive-videos/How_Buzz_Teaches_Without_Cheating.mp4"
                  orientation="portrait"
                />
              }
              eyebrow="Meet Buzz"
              heading="A tutor that won't just hand you the answer"
              body="Buzz is StudyHive's built-in AI tutor — glasses, grad cap, zero patience for shortcuts. Ask a question and Buzz walks you toward the answer instead of just giving it up, so what you learn actually sticks."
            />
          </div>
        </div>
      </div>

      {/* Infographic, full width at the very bottom */}
      <div className="relative border-t border-amber-400/20 bg-black/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-20">
          <div className="mb-8 flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] text-amber-400 uppercase">
            <HexMark className="size-5" />
            The full picture
          </div>
          <Image
            src="/studyhive-media/studyhive-infographic.png"
            alt="StudyHive: Engineering a Culture of Kindness — infographic covering the social paradigm shift, presence system, Hunnies economy, Buzz the AI tutor, the Feed and Library, and the reputation system"
            width={2752}
            height={1536}
            className="w-full rounded-xl border border-amber-400/20"
          />
        </div>
      </div>
    </section>
  )
}
