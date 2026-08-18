import { SectionHeading } from '@/components/section-heading'
import { WaitlistForm } from '@/components/waitlist-form'

export function JoinBeta() {
  return (
    <section id="join-beta" className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="Early access / testers wanted"
          title="Join Beta Test"
          description="Drop your email and you'll get the beta before anybody else. One email per drop, nothing else."
        />

        <WaitlistForm />
      </div>
    </section>
  )
}
