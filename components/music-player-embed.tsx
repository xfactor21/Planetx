import { GlowPlayer } from '@/components/glow-player'
import type { PlayerTrack } from '@/components/glow-player'

const tracks: PlayerTrack[] = [
  {
    id: 'digital-decay',
    title: 'Digital Decay',
    artist: 'xFactor',
    src: '/music-tracks/digital-decay.mp3',
  },
  {
    id: 'coming-down-that-hill',
    title: 'Coming Down That Hill',
    artist: 'xFactor',
    src: 'https://visual-x-g9w4nz.v2.appdeploy.ai/resources/coming-down-that-hill.mp3',
  },
  {
    id: 'glitch-god',
    title: 'Glitch God',
    artist: 'xFactor',
    src: '/music-tracks/glitch-god.mp3',
    cover: '/music-tracks/glitch-god-cover.png',
  },
  {
    id: 'ghost-in-the-machine',
    title: 'Ghost in the Machine',
    artist: 'xFactor',
    src: '/music-tracks/ghost-in-the-machine.mp3',
  },
  {
    id: 'xs-in-my-head',
    title: 'Xs in My Head',
    artist: 'xFactor',
    src: 'https://visual-x-g9w4nz.v2.appdeploy.ai/resources/xs-in-my-head.mp3',
  },
  {
    id: 'letters-to-myself',
    title: 'Letters to Myself',
    artist: 'xFactor',
    src: '/music-tracks/letters-to-myself.m4a',
  },
]

/**
 * Square glow-styled player, featured on the main page hero. Shows large
 * cover art per track. No autoplay.
 */
export function MusicPlayerEmbed() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <GlowPlayer tracks={tracks} square />
    </div>
  )
}
