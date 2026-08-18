import { GlowPlayer } from '@/components/glow-player'
import type { PlayerTrack } from '@/components/glow-player'

const tracks: PlayerTrack[] = [
  { id: 'glitch-god', title: 'Glitch God', artist: 'xFactor', src: '/music-tracks/glitch-god.mp3' },
  {
    id: 'letters-to-myself',
    title: 'Letters to Myself',
    artist: 'xFactor',
    src: '/music-tracks/letters-to-myself.m4a',
  },
  {
    id: 'digital-decay',
    title: 'Digital Decay',
    artist: 'xFactor',
    src: '/music-tracks/digital-decay.mp3',
  },
  {
    id: 'ghost-in-the-machine',
    title: 'Ghost in the Machine',
    artist: 'xFactor',
    src: '/music-tracks/ghost-in-the-machine.mp3',
  },
]

/**
 * Small glow-styled player embedded in the Hero. No autoplay.
 */
export function MusicPlayerEmbed() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <GlowPlayer tracks={tracks} compact />
    </div>
  )
}
