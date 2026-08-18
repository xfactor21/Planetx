import { SiteHeader } from '@/components/site-header'
import { UpcomingApps } from '@/components/upcoming-apps'
import { SiteFooter } from '@/components/site-footer'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <UpcomingApps variant="full" />
      </main>
      <SiteFooter />
    </div>
  )
}
