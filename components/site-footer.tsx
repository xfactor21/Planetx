import Image from 'next/image'
import { XMark } from '@/components/x-mark'
import { XLetter, withXGlyph } from '@/components/x-glyph'
const columns = [
  {
    title: 'Apps',
    links: [
      { label: 'Join Beta Test', href: '/beta' },
      { label: 'Coming Soon', href: '/coming-soon' },
      { label: 'StudyHive', href: '/studyhive' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Listen',
    links: [{ label: 'xFactor Music', href: '/music' }],
  },
  {
    title: 'Studio',
    links: [
      { label: 'The Studio', href: '/#studio' },
      { label: 'Contact', href: 'mailto:xFactor@planet-x.co' },
    ],
  },
]
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Image
              src="/brand/planet-x-wordmark-transparent.png"
              alt="planet.X"
              width={802}
              height={298}
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">
              Apps, sound and signal. Built somewhere dark, released everywhere.
            </p>
            <a
              href="mailto:xFactor@planet-x.co"
              className="mt-6 inline-block border-b border-accent pb-0.5 font-mono text-xs tracking-[0.16em] text-accent uppercase"
            >
              xFactor@planet-x.co
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase">
                  {col.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-foreground/80 transition-colors hover:text-primary"
                      >
                        {withXGlyph(link.label, true)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Planet-<XLetter /> Development</p>
          <p className="flex items-center gap-2">
            <XMark className="size-4 text-primary" />
            Built in the dark
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden opacity-10"
      >
        <Image
          src="/brand/x-mark-grunge.png"
          alt=""
          width={1024}
          height={1024}
          className="-mb-24 h-[16rem] w-[16rem] translate-y-1/3 object-contain md:h-[28rem] md:w-[28rem]"
        />
      </div>
    </footer>
  )
}
