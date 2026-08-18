import { SectionHeading } from '@/components/section-heading'
import { XMark } from '@/components/x-mark'
import { AppCard } from '@/components/app-card'
import { releasedApps } from '@/lib/data'

export function ReleasedApps() {
  const hasApps = releasedApps.length > 0

  return (
    <section id="new-releases" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="Shipped / live now"
          title="New Releases (Beta)"
          description="Click an app below to gain access to the BETA before everyone else."
        />

        {hasApps ? (
          <div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">

            {releasedApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-border bg-background">
            <div className="flex flex-col items-start gap-4 p-8 md:p-12">
              <XMark className="size-8 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-balance uppercase md:text-3xl">
                First release coming soon
              </h3>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                Check back shortly — the first Planet-X app lands here the moment
                it ships.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
