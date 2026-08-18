import { Video } from 'lucide-react'

const PLACEHOLDER = false
const YOUTUBE_VIDEO_ID = 'qTb5iv7Z824'

export function YouTubeEmbed() {
  if (PLACEHOLDER) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 text-center">
        <Video className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Music video goes here — send the YouTube link and it'll drop
          right in.
        </p>
      </div>
    )
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
      <iframe
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
        title="xFactor music video"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
