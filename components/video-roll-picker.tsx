import Image from 'next/image'
import { Play } from 'lucide-react'

export type ChannelVideo = {
  id: string
  title: string
  description: string
  thumbnail: string
}

// TODO: replace with real videos from the channel (same one the featured
// video lives on). Each id is a YouTube video ID.
const PLACEHOLDER_VIDEOS: ChannelVideo[] = [
  {
    id: 'placeholder-1',
    title: 'Track name here',
    description: 'One-line description of the video.',
    thumbnail: '',
  },
  {
    id: 'placeholder-2',
    title: 'Track name here',
    description: 'One-line description of the video.',
    thumbnail: '',
  },
  {
    id: 'placeholder-3',
    title: 'Track name here',
    description: 'One-line description of the video.',
    thumbnail: '',
  },
  {
    id: 'placeholder-4',
    title: 'Track name here',
    description: 'One-line description of the video.',
    thumbnail: '',
  },
]

export function VideoRollPicker({
  videos = PLACEHOLDER_VIDEOS,
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
              className="flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/5"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-black/60">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                ) : (
                  <Play
                    className="size-4 text-muted-foreground"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                )}
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
