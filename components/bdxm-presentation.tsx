'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowDownRight, ChevronLeft, ChevronRight, Download, FileText, Maximize2, Play, ShieldCheck, Sparkles, X } from 'lucide-react'
import { withXGlyph } from '@/components/x-glyph'

type DeckSlide = {
  eyebrow: string
  title: string
  body: string
  proof: string
  accent: 'pink' | 'cyan' | 'violet'
  visual: 'logo' | 'problem' | 'matrix' | 'phone' | 'compass' | 'match' | 'loop' | 'radar' | 'psych' | 'pulse' | 'context' | 'private' | 'cta'
}

const slides: DeckSlide[] = [
  {
    eyebrow: 'The promise',
    title: 'Power. Play. On your terms.',
    body: 'bdXm is the relationship operating layer for the dynamic you actually have: private, intentional, playful, and built around consent, structure, and real compatibility.',
    proof: 'Open with the brand, then let the story unfold like a private invitation.',
    accent: 'pink',
    visual: 'logo',
  },
  {
    eyebrow: 'The problem',
    title: 'Generic apps assume a generic dynamic.',
    body: 'Swipe decks do not understand power exchange. Basic task apps do not understand relationship context. bdXm starts from the relationship itself.',
    proof: 'Use quick glitch cuts and contrast: cold generic apps → warm bdXm world.',
    accent: 'violet',
    visual: 'problem',
  },
  {
    eyebrow: 'The category gap',
    title: 'The missing layer is context.',
    body: 'Dating, daily structure, matching, insight, safety, and private presence usually live in separate tools. bdXm ties them into one continuous system.',
    proof: 'Show feature groups snapping together instead of floating as separate panels.',
    accent: 'cyan',
    visual: 'matrix',
  },
  {
    eyebrow: 'The map',
    title: 'One app. Every part of the dynamic.',
    body: 'Discovery, structure, insight, and support sit around the same relationship identity instead of competing for attention.',
    proof: 'A phone becomes the center of gravity while feature labels orbit around it.',
    accent: 'pink',
    visual: 'phone',
  },
  {
    eyebrow: 'The engine',
    title: 'The Compass powers connection.',
    body: 'The Compass gives bdXm a real relationship profile: attachment style, communication style, relationship structure, love language, and aftercare needs.',
    proof: 'Animate a glowing circle feeding the match algorithm, Psychologist, and radar.',
    accent: 'violet',
    visual: 'compass',
  },
  {
    eyebrow: 'Matching',
    title: 'Matched by compatibility. Not proximity.',
    body: 'The app scores candidates with Compass data and returns a plain-language compatibility summary instead of pretending distance equals fit.',
    proof: 'Compatibility percent, match summary, and an immediate “not a match” undo moment.',
    accent: 'cyan',
    visual: 'match',
  },
  {
    eyebrow: 'Daily structure',
    title: 'Structure without the startup tax.',
    body: 'Tasks, rewards, penalties, points, and a starter-pack import turn agreements into a living rhythm without forcing users to build everything from scratch.',
    proof: 'Loop the system: import → complete → earn → redeem → ledger.',
    accent: 'pink',
    visual: 'loop',
  },
  {
    eyebrow: 'Activities',
    title: 'See your dynamic. Literally.',
    body: 'Quizzes, daily calibration, the roleplay wheel, and the Dynamic Intimacy Radar make alignment visible instead of vague.',
    proof: 'Radar lines animate with two profiles overlapping and separating.',
    accent: 'violet',
    visual: 'radar',
  },
  {
    eyebrow: 'Relationship support',
    title: 'Your relationship has a therapist now.',
    body: 'The Psychologist is an ongoing AI relationship counselor with persistent history and context from the Compass, quiz data, and relationship activity.',
    proof: 'Keep this beat slower and more emotional. It is the hero feature.',
    accent: 'cyan',
    visual: 'psych',
  },
  {
    eyebrow: 'Safety + presence',
    title: 'The foundation is safety and presence.',
    body: 'Pulse check-ins, safeword display, hard-limit tracking, chat, shared media, and alerts keep communication and boundaries visible.',
    proof: 'Make the Pulse feel like a private signal, not medical monitoring.',
    accent: 'pink',
    visual: 'pulse',
  },
  {
    eyebrow: 'Continuity',
    title: 'One continuous context.',
    body: 'The real power is that the app eliminates the need to jump between dating apps, task spreadsheets, chats, notes, and disconnected relationship tools.',
    proof: 'Animate lines converging into a single relationship core.',
    accent: 'violet',
    visual: 'context',
  },
  {
    eyebrow: 'The experience',
    title: 'Private. Discreet. Yours.',
    body: 'bdXm is mobile-first, installable as a PWA, and designed to feel elegant, fast, private, and always within reach.',
    proof: 'Make this cinematic: phone glow, dark room, cyan/pink edges, no explicit visuals.',
    accent: 'cyan',
    visual: 'private',
  },
  {
    eyebrow: 'Beta close',
    title: 'Build the dynamic that fits you.',
    body: 'The beta is open now. bdXm is looking for testers who will actually use it, push it, and help shape the relationship app this space has been missing.',
    proof: 'Close with the logo, URL, and a direct beta CTA.',
    accent: 'pink',
    visual: 'cta',
  },
]

const sourceSlides = Array.from({ length: 13 }, (_, i) => `/decks/bdxm/slide-${String(i + 1).padStart(2, '0')}.webp`)

function accentClass(accent: DeckSlide['accent']) {
  if (accent === 'cyan') return 'from-cyan-300 via-cyan-300 to-pink-500 text-cyan-200 border-cyan-300/40'
  if (accent === 'violet') return 'from-violet-400 via-pink-500 to-cyan-300 text-violet-200 border-violet-400/40'
  return 'from-pink-500 via-fuchsia-400 to-cyan-300 text-pink-200 border-pink-500/40'
}

function Visual({ slide, index }: { slide: DeckSlide; index: number }) {
  const cls = accentClass(slide.accent)
  const nodes = useMemo(() => ['Compass', 'Match', 'Tasks', 'Pulse', 'Psychologist'], [])
  return (
    <div className="relative min-h-[23rem] overflow-hidden border border-white/10 bg-black/60 p-5 shadow-2xl shadow-pink-950/30 md:min-h-[28rem] md:p-8">
      <div className="absolute inset-0 x-grid opacity-30" />
      <div className={`absolute -right-24 -top-24 size-72 rounded-full bg-gradient-to-br ${cls.split(' ').slice(0,3).join(' ')} opacity-25 blur-3xl`} />
      <div className="absolute -bottom-28 -left-20 size-80 rounded-full bg-cyan-500/15 blur-3xl" />

      {slide.visual === 'logo' || slide.visual === 'cta' ? (
        <div className="relative flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
          <div className="deck-logo-pulse text-7xl font-bold tracking-tight md:text-9xl">
            <span className="text-white">bd</span><span className="bg-gradient-to-br from-pink-500 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">X</span><span className="text-white">m</span>
          </div>
          <p className="mt-5 font-mono text-xs tracking-[0.35em] text-white/70 uppercase">Power. Play. On your terms.</p>
          {slide.visual === 'cta' ? (
            <a href="#bdxm" className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-4 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase hover:bg-accent hover:text-accent-foreground">
              Join the beta <ArrowDownRight className="size-5" />
            </a>
          ) : null}
        </div>
      ) : slide.visual === 'compass' || slide.visual === 'context' ? (
        <div className="relative flex min-h-[22rem] items-center justify-center">
          <div className="deck-orbit relative flex size-44 items-center justify-center rounded-full border border-pink-500/60 bg-pink-500/10 text-center font-mono text-xs uppercase tracking-[0.18em] text-white shadow-[0_0_60px_rgba(236,72,153,.25)] md:size-56">
            The<br />Compass
          </div>
          {nodes.map((n, i) => {
            const angle = (i / nodes.length) * Math.PI * 2
            const radius = 180
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <div key={n} className="absolute hidden border border-white/15 bg-black/70 px-4 py-3 font-mono text-[0.65rem] tracking-[0.14em] text-white/80 uppercase md:block" style={{ transform: `translate(${x}px, ${y}px)` }}>
                {n}
              </div>
            )
          })}
        </div>
      ) : slide.visual === 'loop' ? (
        <div className="relative grid min-h-[22rem] place-items-center">
          <div className="relative size-64 rounded-full border border-pink-500/40 md:size-80">
            {['Import', 'Complete', 'Earn', 'Redeem', 'Ledger'].map((n, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
              const radius = 142
              return (
                <div key={n} className="absolute rounded-full border border-cyan-300/30 bg-black px-4 py-2 font-mono text-[0.65rem] uppercase text-white" style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)` }}>
                  {n}
                </div>
              )
            })}
            <div className="absolute inset-16 grid place-items-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-300 p-[1px]">
              <div className="grid size-full place-items-center rounded-full bg-black text-center font-mono text-xs uppercase tracking-[0.18em]">One-tap<br />starter set</div>
            </div>
          </div>
        </div>
      ) : slide.visual === 'radar' ? (
        <div className="relative grid min-h-[22rem] place-items-center">
          <div className="relative size-72">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="deck-radar absolute inset-10 rounded-[35%_65%_45%_55%] border-2 border-pink-500/80 bg-pink-500/15" />
            <div className="deck-radar-b absolute inset-14 rounded-[55%_45%_65%_35%] border-2 border-cyan-300/80 bg-cyan-300/10" />
            <div className="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-[0.2em] text-white">Dynamic<br />Radar</div>
          </div>
        </div>
      ) : slide.visual === 'match' || slide.visual === 'private' || slide.visual === 'psych' ? (
        <div className="relative grid min-h-[22rem] place-items-center">
          <div className="absolute inset-x-8 top-8 h-40 bg-gradient-to-r from-pink-500/20 via-transparent to-cyan-300/20 blur-2xl" />
          <div className="deck-phone relative h-[24rem] w-44 rounded-[2rem] border border-white/20 bg-zinc-950 p-3 shadow-[0_0_80px_rgba(34,211,238,.18)]">
            <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />
            <div className="text-center text-xl font-bold"><span className="text-white">bd</span><span className="text-primary">X</span><span>m</span></div>
            <div className="mt-8 rounded-2xl border border-pink-500/40 bg-pink-500/10 p-4 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full border border-cyan-300/50 bg-black text-2xl font-bold text-pink-300">{slide.visual === 'match' ? '95%' : slide.visual === 'psych' ? 'AI' : '18+'}</div>
              <p className="mt-4 text-sm font-bold">{slide.visual === 'match' ? 'Exceptional Connection' : slide.visual === 'psych' ? 'Steady support' : 'Private Access'}</p>
              <p className="mt-2 text-xs text-white/60">{slide.visual === 'match' ? 'Matched by real compatibility.' : slide.visual === 'psych' ? 'Context-aware guidance.' : 'Installable. Discreet. Yours.'}</p>
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-full bg-primary py-3 text-center text-xs font-bold text-black">{slide.visual === 'psych' ? 'Ask Psychologist' : 'Start'}</div>
          </div>
        </div>
      ) : slide.visual === 'pulse' ? (
        <div className="relative grid min-h-[22rem] place-items-center">
          <div className="deck-pulse-line h-24 w-full max-w-lg" />
          <div className="absolute flex gap-12">
            <ShieldCheck className="size-14 text-pink-400" />
            <Sparkles className="size-14 text-cyan-300" />
          </div>
        </div>
      ) : (
        <div className="relative grid min-h-[22rem] place-items-center">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {['Swipe deck', 'Task app', 'Chat', 'Checklist', 'Rules', 'Notes'].map((n, i) => (
              <div key={n} className={`deck-shard border border-white/10 bg-white/[0.03] px-5 py-8 text-center font-mono text-xs uppercase tracking-[0.14em] text-white/55`} style={{ animationDelay: `${i * 120}ms` }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 font-mono text-[0.62rem] tracking-[0.18em] text-white/35 uppercase">Slide {index + 1}/13</div>
    </div>
  )
}

export function BDXMPresentation() {
  const [mode, setMode] = useState<'interactive' | 'source' | 'media'>('interactive')
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const active = slides[current]
  const cls = accentClass(active.accent)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(null)
        return
      }
      if (e.key === 'ArrowRight') setCurrent((v) => (v + 1) % slides.length)
      if (e.key === 'ArrowLeft') setCurrent((v) => (v - 1 + slides.length) % slides.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="bdxm-deck" className="relative overflow-hidden border-y border-border bg-[#07070a]">
      <div className="absolute inset-0 x-grid opacity-30" />
      <div className="absolute left-[-10rem] top-16 size-[24rem] rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-[-10rem] size-[30rem] rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.7rem] tracking-[0.28em] text-primary uppercase">bdXm beta media lab</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight uppercase md:text-6xl">
              {withXGlyph('Power Play Redefined')}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              The original deck is here, but the page turns it into a web-native presentation with motion, source-slide fallback, and a clean media area so screenshots and videos do not crowd the beta cards.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['interactive', 'Interactive deck'],
              ['source', 'Original slides'],
              ['media', 'Media vault'],
            ].map(([key, label]) => (
              <button key={key} type="button" onClick={() => setMode(key as typeof mode)} className={`border px-4 py-3 font-mono text-[0.7rem] font-bold tracking-[0.16em] uppercase transition ${mode === key ? 'border-primary bg-primary text-black' : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-cyan-300 hover:text-cyan-200'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'interactive' ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
            <div>
              <Visual slide={active} index={current} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/80 hover:border-primary hover:text-primary">
                  <ChevronLeft className="size-4" /> Prev
                </button>
                <div className="flex max-w-full gap-1 overflow-x-auto scrollbar-none">
                  {slides.map((_, i) => (
                    <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => setCurrent(i)} className={`h-2.5 shrink-0 rounded-full transition ${i === current ? 'w-10 bg-primary' : 'w-2.5 bg-white/25 hover:bg-cyan-300'}`} />
                  ))}
                </div>
                <button type="button" onClick={() => setCurrent((current + 1) % slides.length)} className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/80 hover:border-accent hover:text-accent">
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <aside className={`border bg-black/50 p-6 ${cls.split(' ').slice(3).join(' ')}`}>
              <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase">{active.eyebrow}</p>
              <h3 className="mt-3 text-3xl font-bold leading-tight text-white">{active.title}</h3>
              <p className="mt-5 leading-relaxed text-white/72">{active.body}</p>
              <div className="mt-7 border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-[0.6rem] tracking-[0.18em] text-white/40 uppercase">Video note</p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{active.proof}</p>
              </div>
              <div className="mt-7 flex flex-col gap-3">
                <a href="/decks/bdxm/Power_Play_Redefined.pdf" target="_blank" className="inline-flex items-center justify-center gap-2 border border-white/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/80 hover:border-accent hover:text-accent">
                  <FileText className="size-4" /> Open PDF
                </a>
                <a href="/decks/bdxm/Power_Play_Redefined.pptx" className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-black hover:bg-accent">
                  <Download className="size-4" /> Download PPTX
                </a>
              </div>
            </aside>
          </div>
        ) : null}

        {mode === 'source' ? (
          <div className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sourceSlides.map((src, i) => (
                <button key={src} type="button" onClick={() => setLightbox(src)} className="group overflow-hidden border border-white/10 bg-black/70 p-2 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_40px_rgba(236,72,153,.18)]">
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <Image src={src} alt={`bdXm source deck slide ${i + 1}`} fill className="object-contain transition duration-300 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-mono text-[0.65rem] text-white/70">{String(i + 1).padStart(2, '0')}</span>
                    <Maximize2 className="absolute bottom-3 right-3 size-5 text-white/70 opacity-0 transition group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {mode === 'media' ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-white/10 bg-black/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">Visual references</p>
                  <h3 className="mt-2 text-2xl font-bold">Screenshots open big, not buried.</h3>
                </div>
                <Maximize2 className="size-6 text-cyan-300" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {['/screenshots/bdxm/bdxm-1.webp', '/screenshots/bdxm/bdxm-2.webp', '/screenshots/bdxm/bdxm-3.webp'].map((src, i) => (
                  <button key={src} type="button" onClick={() => setLightbox(src)} className="group relative aspect-[9/16] overflow-hidden border border-white/10 bg-white/[0.03] transition hover:z-20 hover:scale-[1.08] hover:border-primary hover:shadow-[0_0_40px_rgba(236,72,153,.22)]">
                    <Image src={src} alt={`bdXm screenshot ${i + 1}`} fill className="object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-white/10 bg-black/60 p-5">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-cyan-300 uppercase">Video slot</p>
              <div className="mt-4 grid aspect-video place-items-center border border-dashed border-white/15 bg-white/[0.03] text-center">
                <div>
                  <Play className="mx-auto size-12 text-primary" />
                  <p className="mt-4 text-lg font-bold">Drop the finished bdXm ad here</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">The beta page is ready for a hero video, deck, and screenshots without stacking everything into one crowded wall.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="Close image" className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/60 p-3 text-white hover:border-primary hover:text-primary" onClick={() => setLightbox(null)}>
            <X className="size-6" />
          </button>
          <div className="relative max-h-[92vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <div className={lightbox.includes('/screenshots/') ? 'relative mx-auto h-[88vh] max-w-[42rem]' : 'relative aspect-video w-full'}>
              <Image src={lightbox} alt="Expanded bdXm media" fill className="object-contain" sizes="100vw" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
