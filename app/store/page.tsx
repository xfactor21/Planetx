import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StoreCatalog } from '@/components/store-catalog'

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

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b-2 border-primary/80">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
            <div>
              <h1 className="text-4xl font-medium tracking-normal sm:text-5xl">Store</h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                Software, audio, effects, and creator resources from planet.X.
              </p>
            </div>
            <span className="font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
              Xupply catalog
            </span>
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
