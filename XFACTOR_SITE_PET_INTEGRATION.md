# xFactor site pet integration

Integrated globally into the current `xfactor21/Planetx` site without replacing current SEO, Xupply, email-routing, bdXm, StudyHive, music, privacy, or other production work.

## Files
- `components/xfactor-site-pet.tsx` — global mascot UI, page-aware speech bubbles, click lines, semantic button/link reactions, and custom trigger listener.
- `lib/xfactor-pet.ts` — sprite animation engine with all nine states and 16-direction cursor tracking.
- `public/xfactor/xfactor-spritesheet.png` — optimized transparent web sprite sheet preserving the original animation grid at 384×572 for faster loading.
- `app/layout.tsx` — mounts `<XFactorSitePet />` globally while preserving current metadata, structured data, announcement, and Vercel Analytics behavior.

## Animation states
`idle`, `running-right`, `running-left`, `waving`, `jumping`, `failed`, `waiting`, `running`, `review`.

## Trigger API
```ts
window.dispatchEvent(
  new CustomEvent('xfactor:trigger', {
    detail: {
      message: 'Build finished. Somehow.',
      animation: 'jumping',
      duration: 4500,
    },
  }),
)
```
All detail fields are optional.

Production integration committed on the canonical `main` branch.
