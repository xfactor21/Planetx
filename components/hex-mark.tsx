import { cn } from '@/lib/utils'

export function HexMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn('size-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
      strokeLinejoin="round"
    >
      <path d="M50 4 L92 27 L92 73 L50 96 L8 73 L8 27 Z" />
    </svg>
  )
}

export function HexField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden overflow-hidden sm:block',
        className,
      )}
    >
      <HexMark className="absolute left-[8%] top-[12%] size-10 text-amber-400/15" />
      <HexMark className="absolute right-[10%] top-[26%] size-16 text-amber-400/10" />
      <HexMark className="absolute left-[20%] bottom-[14%] size-12 text-amber-400/10" />
      <HexMark className="absolute right-[20%] bottom-[8%] size-8 text-amber-400/15" />
      <HexMark className="absolute left-[45%] top-[4%] size-6 text-amber-400/15" />
    </div>
  )
}
