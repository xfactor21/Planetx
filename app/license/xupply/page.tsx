import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const siteUrl = 'https://www.planet-x.co'

export const metadata: Metadata = {
  title: 'Xupply License Terms | planet.X',
  description:
    'Official license terms for Xupply digital assets and the Creator Asset Forge utility sold through planet.X.',
  alternates: { canonical: `${siteUrl}/license/xupply` },
  openGraph: {
    title: 'Xupply License Terms | planet.X',
    description:
      'Official license terms for Xupply digital assets and the Creator Asset Forge utility.',
    url: `${siteUrl}/license/xupply`,
    siteName: 'planet.X',
    type: 'website',
  },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-white/10 py-8 first:border-t-0 first:pt-0">
    <h2 className="text-2xl font-bold tracking-[-.03em] text-white">{title}</h2>
    <div className="mt-4 space-y-4 text-sm leading-7 text-white/62">{children}</div>
  </section>
)

export default function XupplyLicensePage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <SiteHeader />
      <main>
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,43,138,.10),transparent_36%),radial-gradient(circle_at_top_right,rgba(0,240,255,.08),transparent_34%)]">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-18">
            <p className="font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300 uppercase">
              Xupply by planet.X / Official terms
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-.045em] sm:text-5xl">
              Xupply License Terms
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/62">
              These are the current official Xupply terms adopted by planet.X for covered purchases. They explain what you may do with Xupply digital assets and the Creator Asset Forge utility, and what remains restricted.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] tracking-[.12em] text-white/38 uppercase">
              <span>Effective: September 15, 2026</span>
              <span>Contact: chris@planet-x.co</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6 sm:p-8">
            <Section title="1. Scope and acceptance">
              <p>
                These terms apply to Xupply products that identify the Xupply Asset License or Xupply utility license on their planet.X product page, download, documentation, or purchase record. By purchasing, downloading, installing, or using a covered product, you agree to these terms.
              </p>
              <p>
                If a specific product includes written product-specific license terms that conflict with this page, the product-specific terms control for that product.
              </p>
            </Section>

            <Section title="2. Xupply digital asset license">
              <p>
                For covered audio, graphics, templates, overlays, interface components, wallpapers, effects, and other downloadable asset packs, planet.X grants the purchaser a non-exclusive, worldwide, perpetual license to use and modify the purchased assets in personal and commercial end products, subject to the restrictions below.
              </p>
              <p>
                You may use covered assets in websites, apps, games, videos, music and audio productions, streams, social content, marketing materials, prototypes, presentations, and client projects. You may create multiple end products and may modify the assets to fit those projects.
              </p>
              <p>
                Client work is allowed when the Xupply assets are incorporated, rendered, flattened, compiled, or otherwise integrated into the delivered end product. A client does not receive an independent right to redistribute the original Xupply source assets unless that client separately obtains the applicable license.
              </p>
            </Section>

            <Section title="3. Asset restrictions">
              <p>You may not:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Resell, share, upload, redistribute, sublicense, gift, or give away the original source assets or substantially equivalent source files.</li>
                <li>Repackage covered assets into a competing stock library, template pack, sound library, asset marketplace product, resource bundle, or other product whose primary value is the Xupply source material itself.</li>
                <li>Make the source assets separately extractable or downloadable from an end product when doing so would effectively distribute the original files.</li>
                <li>Claim ownership or authorship of the unmodified Xupply source assets themselves.</li>
                <li>Register an unmodified supplied asset as a trademark, service mark, or exclusive brand identity in a way that would prevent planet.X or other licensees from using the licensed source asset.</li>
                <li>Use the source assets to train, fine-tune, benchmark, seed, or build an AI/ML model or dataset for redistribution or model development without separate written permission from planet.X.</li>
              </ul>
            </Section>

            <Section title="4. Creator Asset Forge utility license">
              <p>
                Creator Asset Forge is licensed to one purchaser for personal and commercial use. The purchaser may run the utility, use it for their own projects, use it while performing client work, and commercially use the exported results they create from content they are authorized to process.
              </p>
              <p>
                You may not resell, redistribute, sublicense, share, host for third-party access, or republish Creator Asset Forge itself or its source as a standalone or competing utility. Your rights in source material you provide to the utility remain your responsibility; the license does not grant rights in third-party content you do not own or have permission to use.
              </p>
            </Section>

            <Section title="5. Ownership">
              <p>
                Purchasing a Xupply product grants usage rights under this license; it does not transfer copyright or ownership of the Xupply source product. Except for rights expressly granted here, planet.X retains all rights in the original Xupply product, source files, branding, documentation, and software.
              </p>
              <p>
                You retain rights you already hold in your own original material and in the original portions of end products you create, subject to the continuing license restrictions on the embedded Xupply source assets.
              </p>
            </Section>

            <Section title="6. Payment, delivery, refunds, and consumer rights">
              <p>
                Payment and digital delivery may be processed by a third-party checkout provider. Refund handling may also be subject to the checkout terms shown at purchase, product-specific terms, and applicable law. Nothing in this license waives consumer rights that cannot legally be waived.
              </p>
            </Section>

            <Section title="7. Warranty and liability">
              <p>
                To the maximum extent permitted by applicable law, covered products are provided “as is” without warranties beyond any written product-specific commitment. planet.X does not guarantee that a product will satisfy every third-party platform, software, or compatibility requirement.
              </p>
              <p>
                To the maximum extent permitted by applicable law, planet.X will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of a covered product. Aggregate liability relating to a covered purchase is limited to the amount paid for that product, except where applicable law does not permit that limitation.
              </p>
            </Section>

            <Section title="8. Breach and termination">
              <p>
                The license may terminate if you materially breach these terms. If that occurs, you must stop the prohibited use and stop distributing any material that unlawfully exposes or redistributes the covered source product. Rights may be restored when a curable breach is fully corrected and planet.X confirms restoration where confirmation is reasonably required.
              </p>
            </Section>

            <Section title="9. Updates and support">
              <p>
                planet.X may update these terms prospectively as products or distribution methods change. A material license change will not retroactively remove usage rights already granted for a completed purchase unless required by law or agreed with the purchaser. The effective date at the top of this page identifies the current version.
              </p>
              <p>
                For licensing, compatibility, or purchase questions, email{' '}
                <a className="text-cyan-300 hover:text-white" href="mailto:chris@planet-x.co">
                  chris@planet-x.co
                </a>
                .
              </p>
            </Section>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="max-w-2xl text-xs leading-6 text-white/40">
              This page records the official business license terms adopted by planet.X. Product pages may include shorter summaries; this page controls where those summaries differ.
            </p>
            <Link href="/store" className="font-mono text-[10px] font-bold tracking-[.14em] text-primary uppercase hover:text-white">
              Return to store →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
