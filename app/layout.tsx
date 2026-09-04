import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, Poppins } from 'next/font/google'
import { MonsterXAnnouncement } from '@/components/monsterx-announcement'
import './globals.css'

const _spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const _jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })
const _poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planet-X Development — Apps, Sound, Signal',
  description:
    'Planet-X Development builds edgy, independent apps and releases music on every major streaming service. Download shipped apps, track upcoming drops, and tune in.',
  generator: 'v0.app',
  keywords: [
    'Planet-X Development',
    'indie apps',
    'app downloads',
    'upcoming apps',
    'loud music',
    'developer studio',
  ],
  openGraph: {
    title: 'Planet-X Development — Apps, Sound, Signal',
    description:
      'Independent apps and music from the Planet-X Development studio.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased font-sans">
        <MonsterXAnnouncement />
        {children}
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
