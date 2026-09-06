import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SessionGrid X Privacy Policy | planet.X',
  description: 'Privacy policy for the SessionGrid X Chrome extension by planet.X.',
}

const sectionClass = 'space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7'

export default function SessionGridPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 border-b border-cyan-400/20 pb-7">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">planet.X software</div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">SessionGrid X Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
            This policy explains how SessionGrid X handles data when you use the Chrome extension.
          </p>
          <p className="mt-3 text-sm text-white/50">Effective date: September 6, 2026</p>
        </header>

        <div className="space-y-5 text-[15px] leading-7 text-white/80">
          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">1. What SessionGrid X does</h2>
            <p>
              SessionGrid X is a local-first Chrome extension for saving, organizing, restoring, and recovering browser tab sessions and workspaces.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">2. Data stored locally</h2>
            <p>To provide its core functionality, SessionGrid X may store the following information in Chrome extension storage on your device:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Tab titles and URLs</li>
              <li>Window structure and active-tab state</li>
              <li>Pinned-tab state</li>
              <li>Chrome tab-group names, colors, collapsed state, and related metadata</li>
              <li>Workspace names, tags, and notes that you create</li>
              <li>Recovery snapshots</li>
              <li>Extension preferences and settings</li>
              <li>Local license state needed to remember whether Pro is active</li>
            </ul>
            <p>
              In the current version, planet.X does not receive or remotely store your saved browsing sessions, workspace contents, or recovery snapshots.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">3. Analytics, advertising, and sale of data</h2>
            <p>
              SessionGrid X does not include advertising SDKs or browsing analytics/telemetry SDKs. planet.X does not sell SessionGrid X user data.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">4. Pro license activation</h2>
            <p>
              If you choose to activate SessionGrid X Pro, the license key you enter and an extension/device instance identifier may be sent to Lemon Squeezy solely to activate, validate, or deactivate your purchased license.
            </p>
            <p>
              SessionGrid X does not send your saved tab URLs, workspace contents, notes, tags, or recovery snapshots to Lemon Squeezy for license verification.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">5. Chrome permissions</h2>
            <p>SessionGrid X requests only permissions needed for its features:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li><strong className="text-white">tabs</strong> — read and restore tab/session information.</li>
              <li><strong className="text-white">tabGroups</strong> — preserve and recreate Chrome tab groups.</li>
              <li><strong className="text-white">storage</strong> — save local workspaces, snapshots, settings, and license state.</li>
              <li><strong className="text-white">commands</strong> — support extension keyboard shortcuts.</li>
              <li><strong className="text-white">sidePanel</strong> — provide the primary SessionGrid X interface.</li>
              <li><strong className="text-white">alarms</strong> — create scheduled local recovery snapshots.</li>
            </ul>
            <p>
              The extension may also connect to Lemon Squeezy&apos;s license API only for optional Pro entitlement verification.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">6. Data retention and deletion</h2>
            <p>
              Workspace data remains in Chrome extension storage until you delete it, clear extension data, or uninstall the extension. SessionGrid X includes controls to delete saved workspaces and recovery snapshots and to export supported data for your own backup.
            </p>
            <p>
              Uninstalling SessionGrid X generally removes the extension&apos;s locally stored data from that Chrome profile, subject to Chrome&apos;s own storage behavior.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">7. Third-party service</h2>
            <p>
              Lemon Squeezy is used only for optional paid-license entitlement verification. Its handling of information sent to its service is governed by its own privacy terms.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">8. Children&apos;s privacy</h2>
            <p>
              SessionGrid X is a general productivity tool and is not designed to collect personal information from children.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">9. Changes to this policy</h2>
            <p>
              If SessionGrid X materially changes how it handles data, this policy will be updated and the effective date above will be revised.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-xl font-bold text-white">10. Contact</h2>
            <p>
              Questions about SessionGrid X privacy can be directed through the planet.X website.
            </p>
            <Link
              href="/"
              className="inline-flex rounded-lg border border-fuchsia-400/40 bg-fuchsia-500/10 px-4 py-2 font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/20"
            >
              Visit planet.X
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
