import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'SessionGrid X Pro License',
  description: 'Private SessionGrid X Pro license purchase page.',
  robots: { index: false, follow: false, nocache: true },
}

function payhipUrl() {
  const value = (process.env.PAYHIP_SESSIONGRID_X_PRODUCT_LINK || '').trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://payhip.com/b/${value}`
}

export default async function SessionGridLicensePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const source = Array.isArray(params.source) ? params.source[0] : params.source
  if (source !== 'extension') notFound()
  const checkout = payhipUrl()

  return (
    <main className="min-h-screen bg-background px-4 py-14 text-foreground md:px-8">
      <section className="mx-auto max-w-2xl border border-accent/60 bg-black/35 p-6 sm:p-8">
        <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">SessionGrid X Pro</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Remove the workspace limits.</h1>
        <p className="mt-4 leading-7 text-muted-foreground">SessionGrid X stays local-first. Purchasing Pro adds a license entitlement; your tabs, URLs, workspace data, notes, and browsing content are not sent to planet.X or Payhip.</p>
        <div className="mt-7 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2">
          <div className="border border-border p-4"><strong className="text-white">Free</strong><p className="mt-2">5 saved workspaces and 10 recovery snapshots after the 7-day Pro trial.</p></div>
          <div className="border border-accent/50 p-4"><strong className="text-accent">Pro</strong><p className="mt-2">Unlimited workspaces, up to 100 snapshots, notes/tags, Archive + Close, Markdown export, and configurable recovery intervals.</p></div>
        </div>
        {checkout ? (
          <a href={checkout} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center bg-accent px-6 py-3 font-mono text-xs font-bold tracking-[0.14em] text-black uppercase transition-opacity hover:opacity-90">Purchase SessionGrid X Pro</a>
        ) : (
          <div className="mt-8 border border-amber-400/40 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200">Pro checkout is being finalized. The extension remains fully usable during its trial and on the Free tier.</div>
        )}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">After purchase, copy the Payhip license key and paste it into SessionGrid X → License.</p>
      </section>
    </main>
  )
}
