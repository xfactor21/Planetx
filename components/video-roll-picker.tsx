import { Play } from 'lucide-react'

export type ChannelVideo = {
  id: string
  title: string
  description: string
  thumbnail: string
}

const CHANNEL_VIDEOS: ChannelVideo[] = [
  {
    id: 'yMucMkai5r8',
    title: 'Watch on YouTube',
    description: 'xFactor video',
    thumbnail: '',
  },
  {
    id: 'bfvcdi6TejI',
    title: 'Watch on YouTube',
    description: 'xFactor video',
    thumbnail: '',
  },
  {
    id: '9OuzuzKyoLg',
    title: 'Watch on YouTube',
    description: 'xFactor video',
    thumbnail: '',
  },
  {
    id: 'rIcOPyc4080',
    title: 'Watch on YouTube',
    description: 'xFactor video',
    thumbnail: '',
  },
]

export function VideoRollPicker({
  videos = CHANNEL_VIDEOS,
}: {
  videos?: ChannelVideo[]
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card/40">
      <div className="border-b border-border px-3 py-2">
        <p className="font-mono text-[0.6rem] tracking-[0.18em] text-accent uppercase">
          More on the channel
        </p>
      </div>
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {videos.map((video) => (
          <li key={video.id}>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/5"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-black/60">
                <img
                  src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Play className="size-4 text-white" fill="currentColor" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-tight text-foreground/90">
                  {video.title}
                </p>
                <p className="truncate text-[0.7rem] text-muted-foreground">
                  {video.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
