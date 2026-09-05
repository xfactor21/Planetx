import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-start justify-center px-4 py-20 md:px-8">
        <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">404 / signal lost</p>
        <h1 className="mt-4 text-5xl font-medium tracking-tight sm:text-6xl">This part of planet.X drifted off course.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          The page may have moved, been retired, or never made it out of the lab.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="bg-primary px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase hover:bg-accent">
            Back home
          </Link>
          <Link href="/store" className="border border-border px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] uppercase hover:border-primary hover:text-primary">
            Visit Xupply
          </Link>
          <Link href="/beta" className="border border-border px-5 py-3 font-mono text-xs font-bold tracking-[0.14em] uppercase hover:border-accent hover:text-accent">
            Join beta
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
