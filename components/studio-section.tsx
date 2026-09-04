import { SectionHeading } from '@/components/section-heading'
import { XMark } from '@/components/x-mark'

const principles = [
  {
    title: 'No dark patterns',
    body: 'No forced accounts, no upsell walls, no data brokers. If it feels gross, it does not ship.',
  },
  {
    title: 'Small on purpose',
    body: 'One person, one release cadence. Every feature has to earn its place in the binary.',
  },
  {
    title: 'Ship in public',
    body: 'Betas, changelogs and post-mortems go out raw. You see the work, not the marketing.',
  },
]

export function StudioSection() {
  return (
    <section id="studio" className="relative overflow-hidden border-b border-border bg-card">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="Who we are"
          title="The studio"
          description="Planet-X Development is an independent one-man operation making software and records under the same roof. (Okay, sometimes my daughters help too.)"
          accent="accent"
        />

        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="bg-background p-6 md:p-8">
              <XMark className="size-7 text-primary" />
              <h3 className="mt-5 text-xl font-bold tracking-tight uppercase">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
