import { cn } from '@/lib/utils'

export function XMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn('size-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="square"
    >
      <path d="M12 12 L88 88" />
      <path d="M88 12 L12 88" />
    </svg>
  )
}

export function XField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden overflow-hidden sm:block',
        className,
      )}
    >
      <XMark className="absolute left-[6%] top-[14%] size-6 text-primary/30" />
      <XMark className="absolute right-[9%] top-[22%] size-10 text-accent/25" />
      <XMark className="absolute left-[18%] bottom-[16%] size-8 text-primary/20" />
      <XMark className="absolute right-[22%] bottom-[10%] size-5 text-accent/30" />
      <XMark className="absolute left-[46%] top-[6%] size-4 text-primary/25" />
    </div>
  )
}
