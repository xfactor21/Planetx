import { XMark } from '@/components/x-mark'

const items = [
  'Ships fast',
  'No trackers',
  'Offline first',
  'Made by hand',
  'Sound on',
  'Beta access open',
]

export function XMarquee() {
  const loop = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-b border-border bg-primary text-primary-foreground">
      <div
        className="flex w-max animate-[x-marquee_28s_linear_infinite] items-center gap-6 py-3 motion-reduce:animate-none"
        aria-hidden="true"
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.24em] whitespace-nowrap uppercase"
          >
            {item}
            <XMark className="size-6" />
          </span>
        ))}
      </div>
      <p className="sr-only">
        Planet-X Development ships fast, tracker-free, offline-first software.
        Beta access is open.
      </p>
    </div>
  )
}
