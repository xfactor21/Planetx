import { SiteHeader } from '@/components/site-header'
import { SectionHeading } from '@/components/section-heading'
import { BetaAppCard } from '@/components/beta-app-card'
import { SiteFooter } from '@/components/site-footer'
import { releasedApps } from '@/lib/data'
import { BDXM_BETA, CORTEX_BETA } from '@/lib/beta-questions'

export default function BetaPage() {
  const bdxm = releasedApps.find((a) => a.id === 'bdxm')
  const cortex = releasedApps.find((a) => a.id === 'cortex')
  const studyhive = releasedApps.find((a) => a.id === 'studyhive')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-4xl px-4 py-14 md:px-8 md:py-16">
            <SectionHeading
              eyebrow="Early access / testers wanted"
              title="Join Beta Test"
              description="Spots are limited and every application is reviewed by hand — pick an app below and apply in a couple minutes."
            />
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {studyhive ? (
                <BetaAppCard
                  id="studyhive"
                  name={studyhive.name}
                  tagline={studyhive.tagline}
                  description={studyhive.description}
                  icon={studyhive.icon}
                  tags={studyhive.tags}
                  screenshots={studyhive.screenshots}
                  linkHref="/studyhive"
                />
              ) : null}
              {bdxm ? (
                <BetaAppCard
                  id="bdxm"
                  name={bdxm.name}
                  tagline={bdxm.tagline}
                  description={bdxm.description}
                  icon={bdxm.icon}
                  tags={bdxm.tags}
                  screenshots={bdxm.screenshots}
                  config={BDXM_BETA}
                />
              ) : null}
              {cortex ? (
                <BetaAppCard
                  id="cortex"
                  name={cortex.name}
                  tagline={cortex.tagline}
                  description={cortex.description}
                  icon={cortex.icon}
                  tags={cortex.tags}
                  screenshots={cortex.screenshots}
                  config={CORTEX_BETA}
                />
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
