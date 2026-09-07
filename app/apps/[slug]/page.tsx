import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { withXGlyph } from '@/components/x-glyph'
import { releasedApps, upcomingApps } from '@/lib/data'

const siteUrl = 'https://www.planet-x.co'
const publicReleased = releasedApps.filter((app) => !app.mature && app.id !== 'studyhive')
const publicUpcoming = upcomingApps.filter((app) => !app.companionSlot)

function getProduct(slug: string) {
  const released = publicReleased.find((app) => app.id === slug)
  if (released) return { kind: 'released' as const, product: released }

  const upcoming = publicUpcoming.find((app) => app.id === slug)
  if (upcoming) return { kind: 'upcoming' as const, product: upcoming }

  return null
}

export function generateStaticParams() {
  return [...publicReleased, ...publicUpcoming].map((product) => ({ slug: product.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getProduct(slug)
  if (!entry) return {}

  const { product } = entry
  const description = product.description
  const canonical = `${siteUrl}/apps/${product.id}`

  return {
    title: `${product.name} | planet.X`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} | planet.X`,
      description,
      url: canonical,
      siteName: 'planet.X',
      type: 'website',
      images: [{ url: product.icon, alt: `${product.name} icon` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | planet.X`,
      description,
      images: [product.icon],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getProduct(slug)
  if (!entry) notFound()

  const { kind, product } = entry
  const isUpcoming = kind === 'upcoming'
  const screenshots = product.screenshots || []
  const longDescription =
    isUpcoming && 'longDescription' in product
      ? product.longDescription || product.description
      : product.description

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.description,
    url: `${siteUrl}/apps/${product.id}`,
    image: `${siteUrl}${product.icon}`,
    applicationCategory: product.tags.join(', '),
    operatingSystem: kind === 'released' ? product.platforms.join(', ') : 'In development',
    author: {
      '@type': 'Organization',
      name: 'planet.X',
      url: siteUrl,
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-card">
          <div aria-hidden="true" className="absolute inset-0 x-grid opacity-40" />
          <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
            <Link
              href={isUpcoming ? '/coming-soon' : '/'}
              className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase hover:underline"
            >
              ← {isUpcoming ? 'Back to the lab' : 'Back to planet.X'}
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <div className="flex items-start gap-5">
                  <Image
                    src={product.icon}
                    alt={`${product.name} app icon`}
                    width={96}
                    height={96}
                    priority
                    className="size-20 shrink-0 rounded-2xl border border-border bg-background object-contain md:size-24"
                  />
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-[0.18em] text-primary uppercase">
                      {isUpcoming ? product.status : 'Available / beta'}
                    </p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight uppercase md:text-6xl">
                      {withXGlyph(product.name)}
                    </h1>
                    <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                      {product.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-10 max-w-4xl space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
                  {longDescription.split('\n\n').map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="border border-border bg-background p-6">
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                  {isUpcoming ? 'Development status' : 'Try it'}
                </p>
                {isUpcoming ? (
                  <>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span>{product.status}</span>
                      <span className="font-mono text-accent">{product.progress}%</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden bg-border" role="progressbar" aria-valuenow={product.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${product.name} development progress`}>
                      <div className="h-full bg-accent" style={{ width: `${product.progress}%` }} />
                    </div>
                    <Link
                      href="/beta"
                      className="group mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Join beta list
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {product.betaHref ? (
                      <Link href={product.betaHref} className="group inline-flex items-center gap-2 bg-primary px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-primary-foreground uppercase transition-colors hover:bg-accent hover:text-accent-foreground">
                        Join beta
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : null}
                    {product.downloads.map((download) => (
                      <a key={download.href} href={download.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 border border-accent px-4 py-2.5 font-mono text-xs font-bold tracking-[0.16em] text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground">
                        {download.label}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {screenshots.length > 0 ? (
          <section className="border-b border-border bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
              <h2 className="text-2xl font-bold tracking-tight uppercase md:text-3xl">Inside {withXGlyph(product.name, true)}</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {screenshots.slice(0, 6).map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${product.name} screenshot ${index + 1}`}
                    width={640}
                    height={960}
                    className="h-auto w-full rounded-lg border border-border bg-card object-contain"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  )
}
