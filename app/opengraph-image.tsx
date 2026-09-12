import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'planet.X — independent apps, developer tools and creative software'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#020205',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          padding: '64px 72px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 15% 25%, rgba(255,46,159,.34), transparent 32%), radial-gradient(circle at 85% 75%, rgba(0,245,255,.22), transparent 30%), linear-gradient(135deg, #06030c 0%, #020205 62%, #05020a 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-90px',
            fontSize: 520,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: '-0.09em',
            color: 'transparent',
            backgroundImage: 'linear-gradient(145deg, #ff2e9f 14%, #8b5cf6 48%, #00f5ff 82%)',
            backgroundClip: 'text',
            opacity: 0.93,
          }}
        >
          X
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '0.28em', color: '#00f5ff' }}>
              PLANET.X
            </div>
            <div style={{ maxWidth: 790, fontSize: 62, lineHeight: 1.02, fontWeight: 900, letterSpacing: '-0.04em' }}>
              Independent apps, developer tools & creative software.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 24, letterSpacing: '0.08em', color: '#d8d8e8' }}>
            <span>Apps</span>
            <span style={{ color: '#ff2e9f' }}>×</span>
            <span>Chrome extensions</span>
            <span style={{ color: '#8b5cf6' }}>×</span>
            <span>Creative systems</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
