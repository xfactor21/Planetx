import { XMark } from '@/components/x-mark'

export function SectionHeading({
  eyebrow,
  title,
  description,
  accent = 'primary',
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  description?: string
  accent?: 'primary' | 'accent'
}) {
  const accentText = accent === 'primary' ? 'text-primary' : 'text-accent'

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div
          className={`flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.28em] uppercase ${accentText}`}
        >
          <XMark className="size-4" />
          {eyebrow}
        </div>
        <h2 className="mt-3 text-3xl leading-none font-bold tracking-tight text-balance uppercase sm:mt-4 sm:text-4xl md:text-6xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
