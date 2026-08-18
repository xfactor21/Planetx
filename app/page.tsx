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
