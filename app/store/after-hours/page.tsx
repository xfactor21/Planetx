import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StorePageTracker } from '@/components/store-page-tracker'
import { AfterHoursStoreShell } from '@/components/after-hours-store-shell'

const afterHoursDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-after-hours-display',
  display: 'swap',
})

const afterHoursUi = Montserrat({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600'],
  variable: '--font-after-hours-ui',
  display: 'swap',
})

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
    <div className={`${afterHoursDisplay.variable} ${afterHoursUi.variable} min-h-screen bg-[#050505] text-[#f2efe9]`}>
      <StorePageTracker event="store_view" properties={{ surface: 'after_hours_store', catalog: 'after_hours' }} />
      <SiteHeader />
      <main>
        <AfterHoursStoreShell />
      </main>
      <SiteFooter />
    </div>
  )
}
