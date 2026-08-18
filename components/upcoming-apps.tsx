import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ImageIcon } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { XMark } from '@/components/x-mark'
import { withXGlyph } from '@/components/x-glyph'
import { upcomingApps } from '@/lib/data'

export function UpcomingApps({
  variant = 'compact',
}: {
  variant?: 'compact' | 'full'
}) {
  const hasApps = upcomingApps.length > 0
  const isFull = variant === 'full'

  return (
    <section id="coming-soon" className="relative border-b border-border bg-card">
      <div aria-hidden="true" className="absolute inset-0 x-grid opacity-40" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="In the lab / unreleased"
          title="Coming Soon"
          description="Apps in active development. Not downloadable yet — timelines land here as they firm up."
          accent="accent"
        />

        {hasApps ? (
          <div className={isFull ? '' : 'relative'}>
            <div
              className={
                isFull
                  ? 'mt-12 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3'
                  : 'mt-12 grid max-h-[640px] grid-cols-1 gap-px overflow-y-auto border border-border bg-border sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {upcomingApps
              .filter((app) => !app.companionSlot)
              .map((app) => {
                const companion = upcomingApps.find(
                  (a) => a.companionSlot && a.id === `${app.id}-jr`,
                )
                return (
                  <article
                    key={app.id}
                    className="flex flex-col gap-4 sm:gap-6 bg-background p-5 sm:p-8 md:p-10"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[0.65rem] tracking-[0.16em] text-accent uppercase">
                        {app.status}
                      </span>
                      <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                        {app.eta}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <Image
                        src={app.icon || '/placeholder.svg'}
                        alt={`${app.name} icon`}
                        width={64}
                        height={64}
                        className="size-14 shrink-0 rounded-xl border border-border object-cover"
                      />
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight uppercase">
                          {withXGlyph(app.name)}
                        </h3>
                        <p className="mt-2 leading-relaxed text-foreground/90">
                          {app.tagline}
                        </p>
                      </div>
                    </div>

                    {isFull ? (
                      <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                        {app.longDescription || app.description}
                      </p>
                    ) : null}

                    {isFull ? (
                      <div>
                        <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                          Screenshots
                        </span>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(app.screenshots && app.screenshots.length > 0
                            ? app.screenshots
                            : [null, null, null]
                          )
                            .slice(0, 3)
                            .map((src, i) =>
                              src ? (
                                <Image
                                  key={src}
                                  src={src}
                                  alt={`${app.name} screenshot ${i + 1}`}
                                  width={200}
                                  height={360}
                                  className="aspect-[9/16] w-full rounded-md border border-border object-cover"
                                />
                              ) : (
                                <div
                                  key={i}
                                  className="flex aspect-[9/16] w-full items-center justify-center rounded-md border border-dashed border-border bg-card/50"
                                >
                                  <ImageIcon
                                    className="size-6 text-muted-foreground"
                                    aria-hidden="true"
                                  />
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                    ) : null}

                    {companion ? (
                      <div className="flex items-center gap-3 border border-dashed border-border p-3">
                        <Image
                          src={companion.icon || '/placeholder.svg'}
                          alt={`${companion.name} icon`}
                          width={36}
                          height={36}
                          className="size-9 shrink-0 rounded-lg border border-border object-cover opacity-70"
                        />
                        <div>
                          <p className="text-xs font-bold tracking-tight uppercase text-foreground/80">
                            {withXGlyph(companion.name, true)}
                          </p>
                          <p className="text-[0.65rem] text-muted-foreground">
                            {companion.tagline}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                        <span>Progress</span>
                        <span>{app.progress}%</span>
                      </div>
                      <div
                        className="h-1.5 w-full overflow-hidden bg-border"
                        role="progressbar"
                        aria-valuenow={app.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${app.name} development progress`}
                      >
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${app.progress}%` }}
                        />
                      </div>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {app.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      {!isFull ? (
                        <Link
                          href="/coming-soon"
                          className="group mt-2 inline-flex w-fit items-center gap-2 font-mono text-xs font-bold tracking-[0.16em] text-accent uppercase hover:underline"
                        >
                          Learn more
                          <ArrowUpRight
                            className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>

            {!isFull ? (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
                />
                <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[0.65rem] tracking-[0.16em] text-accent uppercase">
                  <span className="animate-bounce">↓</span>
                  Scroll for more
                  <span className="animate-bounce">↓</span>
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="mt-12 border border-border bg-background">
            <div className="flex flex-col items-start gap-4 p-8 md:p-12">
              <XMark className="size-8 text-accent" />
              <h3 className="text-2xl font-bold tracking-tight text-balance uppercase md:text-3xl">
                Nothing to preview yet
              </h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                More soon. In-development apps will show up here with a short
                description and a rough timeline.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
