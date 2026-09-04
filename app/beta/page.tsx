import { SiteHeader } from '@/components/site-header'
import { SectionHeading } from '@/components/section-heading'
import { BetaAppCard } from '@/components/beta-app-card'
import { SiteFooter } from '@/components/site-footer'
import { BDXMPresentation } from '@/components/bdxm-presentation'
import { releasedApps } from '@/lib/data'
import { BDXM_BETA, CORTEX_BETA, VOICE_STUDIO_X_BETA } from '@/lib/beta-questions'

export default function BetaPage() {
  const bdxm = releasedApps.find((a) => a.id === 'bdxm')
  const xmemoirs = releasedApps.find((a) => a.id === 'xmemoirs')
  const studyhive = releasedApps.find((a) => a.id === 'studyhive')
  const voiceStudioX = releasedApps.find((a) => a.id === 'voice-studio-x')

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
          <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-20">
            <div className="relative grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
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
              {xmemoirs ? (
                <BetaAppCard
                  id="xmemoirs"
                  name={xmemoirs.name}
                  tagline={xmemoirs.tagline}
                  description={xmemoirs.description}
                  icon={xmemoirs.icon}
                  tags={xmemoirs.tags}
                  screenshots={xmemoirs.screenshots}
                  config={CORTEX_BETA}
                />
              ) : null}
              {voiceStudioX ? (
                <BetaAppCard
                  id="voice-studio-x"
                  name={voiceStudioX.name}
                  tagline={voiceStudioX.tagline}
                  description={voiceStudioX.description}
                  icon={voiceStudioX.icon}
                  tags={voiceStudioX.tags}
                  screenshots={voiceStudioX.screenshots}
                  config={VOICE_STUDIO_X_BETA}
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
                  detailsHref="https://bdxm-beta.vercel.app/beta"
                  detailsLabel="Tester brief"
                />
              ) : null}
            </div>
          </div>
        </section>

        <BDXMPresentation />
      </main>
      <SiteFooter />
    </div>
  )
}
