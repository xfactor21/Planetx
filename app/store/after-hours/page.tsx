import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { AfterHoursStoreShell } from '@/components/after-hours-store-shell'

export const metadata: Metadata = {
  title: { absolute: 'After Hours — 18+ Store | planet.X' },
  description: 'After Hours is a separate adults-only novelty store from planet.X.',
  alternates: { canonical: '/store/after-hours' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function AfterHoursStorePage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <StorePageTracker event="store_view" properties={{ surface: 'after_hours_store', catalog: 'after_hours' }} />
      <SiteHeader />
      <main>
        <AfterHoursStoreShell />
      </main>
      <SiteFooter />
    </div>
  )
}
