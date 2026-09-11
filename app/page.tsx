import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { XMarquee } from '@/components/x-marquee'
import { ReleasedApps } from '@/components/released-apps'
import { UpcomingApps } from '@/components/upcoming-apps'
import { JoinBeta } from '@/components/join-beta'
import { StudioSection } from '@/components/studio-section'
import { SiteFooter } from '@/components/site-footer'
import { AnalyticsLink } from '@/components/analytics-link'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <section aria-label="planet.X banner" className="border-b border-border bg-black">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <div className="overflow-hidden border border-border bg-card shadow-[0_0_30px_-18px_rgba(0,245,255,.45)]">
              <Image
                src="/brand/planet-x-blinking-banner.gif"
                width={1600}
                height={400}
                unoptimized
                alt="planet.X — music and development"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </section>
        <XMarquee />
        <section aria-labelledby="visual-x-heading" className="relative overflow-hidden border-b border-border bg-black">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-40" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.25fr_.75fr] md:items-center md:px-8 md:py-16">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cyan-300">Now live / free web experience</p>
              <h2 id="visual-x-heading" className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-white md:text-6xl">
                Visual<span className="bg-gradient-to-r from-pink-500 via-violet-400 to-cyan-300 bg-clip-text text-transparent">.X</span>
              </h2>
              <p className="mt-3 text-lg font-semibold text-white/90">Your song becomes a world.</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
                Visual.X is a deterministic 360° music engine that turns rhythm, structure, texture, and dynamics into a reactive visual experience. The current web demo is live while the engine keeps expanding.
              </p>
              <AnalyticsLink
                href="/visual-x"
                event="visual_x_interest_click"
                properties={{ placement: 'homepage_feature' }}
                className="group mt-6 inline-flex items-center gap-2 border border-cyan-300/50 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
              >
                Enter Visual.X
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </AnalyticsLink>
            </div>
            <div className="relative aspect-square overflow-hidden border border-white/10 bg-white/[0.025] p-6 shadow-[0_0_55px_-28px_rgba(0,245,255,.7)]">
              <div aria-hidden="true" className="absolute inset-6 rounded-full border border-fuchsia-400/25" />
              <div aria-hidden="true" className="absolute inset-12 rounded-full border border-cyan-300/20" />
              <div aria-hidden="true" className="absolute inset-[28%] rotate-45 border border-violet-400/35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gradient-to-br from-pink-500 via-violet-400 to-cyan-300 bg-clip-text text-[8rem] font-black leading-none text-transparent md:text-[10rem]">X</span>
              </div>
              <div className="absolute inset-x-6 bottom-6 border-t border-white/10 pt-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/45">
                360° music engine / reactive world generation
              </div>
            </div>
          </div>
        </section>
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
