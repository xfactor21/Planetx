import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StoreCatalog } from '@/components/store-catalog'

const siteUrl = 'https://www.planet-x.co'

export const metadata: Metadata = {
  title: 'Xupply Store — Software, Audio, FX & Creator Assets',
  description:
    'Shop original planet.X software, audio packs, transition effects, creator resources, and development tools from the Xupply catalog.',
  alternates: {
    canonical: '/store',
  },
  openGraph: {
    title: 'Xupply Store — Software, Audio, FX & Creator Assets',
    description:
      'Original software, audio packs, effects, and creator resources from planet.X.',
    url: '/store',
    images: ['/store/project-x.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xupply Store — Software, Audio, FX & Creator Assets',
    description:
      'Original software, audio packs, effects, and creator resources from planet.X.',
    images: ['/store/project-x.png'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'planet.X',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Store',
      item: `${siteUrl}/store`,
    },
  ],
}

const startHere = [
  {
    eyebrow: 'Chrome extension',
    name: 'SessionGrid X',
    description: 'Save and recover Chrome workspaces. Starts with a 7-day Pro trial and keeps a permanent Free tier.',
    href: '#sessiongrid-x',
  },
  {
    eyebrow: 'Chrome extension',
    name: 'conteXt',
    description: 'Keep project credentials and environment context organized in a local-first encrypted Chrome workspace.',
    href: '#context-pro',
  },
  {
    eyebrow: 'Sound design',
    name: 'Essential UI Sounds Vol. 1',
    description: 'A 144-sound original interface library for apps, games, dashboards, and prototypes.',
    href: '#essential-ui-sounds',
  },
]

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main>
        <section className="border-b-2 border-primary/80">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
            <div>
              <h1 className="text-4xl font-medium tracking-normal sm:text-5xl">Store</h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                Software, audio, effects, and creator resources from planet.X.
              </p>
            </div>
            <div className="md:text-right">
              <p className="font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
                Xupply catalog
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/65">
                Product checkout opens here on planet.X. Chrome extensions install through the Chrome Web Store.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[linear-gradient(90deg,rgba(255,46,159,.045),transparent_45%,rgba(0,245,255,.04))]">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.16em] text-primary uppercase">Start here</p>
                <h2 className="mt-1 text-2xl font-medium sm:text-3xl">Three useful ways into Xupply.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">Not sure what to open first? Pick the problem you want to solve.</p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {startHere.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group border border-border bg-black/30 p-5 transition-colors hover:border-primary/80"
                >
                  <p className="font-mono text-[0.58rem] tracking-[0.14em] text-accent uppercase">{item.eyebrow}</p>
                  <h3 className="mt-2 text-lg font-medium text-white group-hover:text-primary">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div id="catalog">
          <StoreCatalog />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
