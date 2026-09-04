import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { XMarquee } from '@/components/x-marquee'
import { ReleasedApps } from '@/components/released-apps'
import { UpcomingApps } from '@/components/upcoming-apps'
import { JoinBeta } from '@/components/join-beta'
import { StudioSection } from '@/components/studio-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <section aria-label="planet.X banner" className="border-b border-border bg-black">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <div className="overflow-hidden border border-border bg-card shadow-[0_0_30px_-18px_rgba(0,245,255,.45)]">
              <img
                src="/brand/planet-x-blinking-banner.gif"
                alt="planet.X — music and development"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </section>
        <XMarquee />
        <ReleasedApps />
        <UpcomingApps />
        <div className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
          <Link href="/coming-soon" className="font-mono text-xs uppercase tracking-[0.16em] text-primary hover:underline">
            See all in development →
          </Link>
        </div>
        <JoinBeta />
        <StudioSection />
      </main>
      <SiteFooter />
    </div>
  )
}
