import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'conteXt Pro License',
  description: 'Private conteXt Pro license purchase page.',
  robots: { index: false, follow: false, nocache: true },
}

const PAYHIP_URL = 'https://payhip.com/b/0Cfj1'

export default async function ContextProLicensePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const source = Array.isArray(params.source) ? params.source[0] : params.source
  if (!['extension', 'pwa'].includes(source || '')) notFound()

  return (
    <main className="min-h-screen bg-background px-4 py-14 text-foreground md:px-8">
      <section className="mx-auto max-w-2xl border border-primary/60 bg-black/35 p-6 sm:p-8">
        <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">conteXt Pro</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Upgrade your encrypted vault.</h1>
        <p className="mt-4 leading-7 text-muted-foreground">Your vault stays local and encrypted. Purchasing Pro only adds a license entitlement; your credentials are never sent to planet.X or Payhip.</p>
        <div className="mt-7 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2">
          <div className="border border-border p-4"><strong className="text-white">Free</strong><p className="mt-2">Up to 3 projects and 25 credentials.</p></div>
          <div className="border border-primary/50 p-4"><strong className="text-primary">Pro</strong><p className="mt-2">Unlimited projects and credentials plus .env import/export.</p></div>
        </div>
        <a href={PAYHIP_URL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 font-mono text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-accent">Purchase conteXt Pro</a>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">After purchase, copy the Payhip license key and paste it into conteXt → Settings → License.</p>
      </section>
    </main>
  )
}
