'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { XFactorPetEngine, type XFactorState } from '@/lib/xfactor-pet'

type PetLine = {
  message: string
  animation: XFactorState
}

export type XFactorTriggerDetail = {
  message?: string
  animation?: XFactorState
  duration?: number
}

const PAGE_LINES: Array<{ match: (path: string) => boolean; line: PetLine }> = [
  {
    match: (path) => path === '/',
    line: {
      message: 'Welcome to planet.X. Try not to press anything labeled experimental.',
      animation: 'waving',
    },
  },
  {
    match: (path) => path.startsWith('/beta'),
    line: {
      message: "Beta lab's open. If you break something, tell me exactly how. That's basically research.",
      animation: 'review',
    },
  },
  {
    match: (path) => path.startsWith('/music'),
    line: {
      message: 'Turn it up. The code works better when the music is loud.',
      animation: 'jumping',
    },
  },
  {
    match: (path) => path.startsWith('/store'),
    line: {
      message: 'Welcome to Xupply. Tools, assets, and suspiciously useful things from the lab.',
      animation: 'review',
    },
  },
  {
    match: (path) => path.startsWith('/studyhive'),
    line: {
      message: 'StudyHive territory. Ask for help, give help, survive school. Buzz is around here somewhere.',
      animation: 'waving',
    },
  },
  {
    match: (path) => path.startsWith('/coming-soon'),
    line: {
      message: 'This is the dangerous shelf. Half of this stuff is still becoming real.',
      animation: 'waiting',
    },
  },
  {
    match: (path) => path.startsWith('/about'),
    line: {
      message: 'This is the part where the lore gets suspiciously official.',
      animation: 'review',
    },
  },
  {
    match: (path) => path.startsWith('/context/privacy'),
    line: {
      message: 'Privacy page. Even chaos needs boundaries.',
      animation: 'idle',
    },
  },
]

const CLICK_LINES: PetLine[] = [
  { message: 'No permission found. Continuing anyway.', animation: 'running' },
  { message: 'Somewhere, a console just got nervous.', animation: 'jumping' },
  { message: 'That button looked expensive.', animation: 'failed' },
  { message: 'If it works, it was architecture. If not, experimental art.', animation: 'review' },
  { message: "The X stands for 'this seemed like a good idea at 2 AM.'", animation: 'waving' },
  { message: 'Loud music. Questionable commits. Excellent branding.', animation: 'running-right' },
  { message: "I checked the roadmap. It just says 'more X.'", animation: 'review' },
  { message: 'Click again. Statistically, something cool has to happen.', animation: 'jumping' },
  { message: 'I call this QA. Legal may call it something else.', animation: 'running-left' },
  { message: 'Welcome to the lab. The exits are probably documented.', animation: 'waiting' },
  { message: "I don't make bugs. I make surprise features with stack traces.", animation: 'failed' },
  { message: 'Running diagnostics: vibes excellent, restraint unavailable.', animation: 'running' },
  { message: 'I was told not to touch production. So naturally...', animation: 'running-right' },
  { message: 'You found the mascot. Achievement unlocked: absolutely nothing.', animation: 'waving' },
  { message: 'planet.X: because normal project names were apparently unavailable.', animation: 'review' },
  { message: 'One more click and I start refactoring the furniture.', animation: 'jumping' },
]

const INTERACTION_LINES: Array<{
  test: (label: string) => boolean
  line: PetLine
}> = [
  {
    test: (label) => /join|beta|apply|test/i.test(label),
    line: { message: 'Beta button detected. Brave choice. I respect it.', animation: 'jumping' },
  },
  {
    test: (label) => /music|listen|play|spotify|youtube|track/i.test(label),
    line: { message: 'Correct. Make it louder.', animation: 'running' },
  },
  {
    test: (label) => /store|xupply|buy|checkout|cart|get it/i.test(label),
    line: { message: 'Lab supplies acquired. Try to use them responsibly. Or creatively.', animation: 'review' },
  },
  {
    test: (label) => /studyhive|study|student/i.test(label),
    line: { message: 'Tell Buzz I said hi. He is significantly better behaved than I am.', animation: 'waving' },
  },
  {
    test: (label) => /bdxm/i.test(label),
    line: { message: 'bdXm. Adults only. Consent first. Curiosity encouraged.', animation: 'review' },
  },
  {
    test: (label) => /xmemoirs|memoir|memory/i.test(label),
    line: { message: 'xMemoirs remembers the important stuff. I mostly remember commits that broke things.', animation: 'review' },
  },
  {
    test: (label) => /voice studio|voice|sing/i.test(label),
    line: { message: 'Speak it. Clone it. Sing it. Subtle was never really the plan.', animation: 'jumping' },
  },
]

function pageLine(pathname: string): PetLine {
  return (
    PAGE_LINES.find(({ match }) => match(pathname))?.line ?? {
      message: 'New corner of planet.X unlocked. I definitely meant to build this.',
      animation: 'waving',
    }
  )
}

function nextDifferentIndex(length: number, previous: number) {
  if (length <= 1) return 0
  let next = Math.floor(Math.random() * length)
  if (next === previous) next = (next + 1) % length
  return next
}

export function XFactorSitePet() {
  const pathname = usePathname()
  const spriteHostRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<XFactorPetEngine | null>(null)
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactionCooldownRef = useRef(0)
  const clickIndexRef = useRef(-1)

  const [message, setMessage] = useState('')
  const [bubbleVisible, setBubbleVisible] = useState(false)

  const hideBubbleLater = useCallback((duration = 4600) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = setTimeout(() => setBubbleVisible(false), duration)
  }, [])

  const speak = useCallback(
    (line: PetLine, duration = 4600) => {
      setMessage(line.message)
      setBubbleVisible(true)
      if (line.animation === 'idle') engineRef.current?.setState('idle')
      else engineRef.current?.play(line.animation)
      hideBubbleLater(duration)
    },
    [hideBubbleLater],
  )

  useEffect(() => {
    if (!spriteHostRef.current) return

    const desktop = window.matchMedia('(min-width: 768px)')
    const engine = new XFactorPetEngine(spriteHostRef.current, {
      spriteUrl: '/xfactor/xfactor-spritesheet.png',
      size: desktop.matches ? 170 : 132,
      state: 'idle',
      trackPointer: true,
    })
    engineRef.current = engine

    const updateSize = () => engine.setSize(desktop.matches ? 170 : 132)
    desktop.addEventListener?.('change', updateSize)

    return () => {
      desktop.removeEventListener?.('change', updateSize)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => speak(pageLine(pathname), 6200), 350)
    return () => clearTimeout(timer)
  }, [pathname, speak])

  useEffect(() => {
    const onTrigger = (event: Event) => {
      const detail = (event as CustomEvent<XFactorTriggerDetail>).detail ?? {}
      speak(
        {
          message: detail.message ?? 'Trigger received. Doing mascot things.',
          animation: detail.animation ?? 'jumping',
        },
        detail.duration ?? 4600,
      )
    }

    window.addEventListener('xfactor:trigger', onTrigger as EventListener)
    return () => window.removeEventListener('xfactor:trigger', onTrigger as EventListener)
  }, [speak])

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-xfactor-pet-root]')) return

      const control = target.closest('a, button')
      if (!control) return

      const now = Date.now()
      if (now < interactionCooldownRef.current) return

      const label = `${control.textContent ?? ''} ${control.getAttribute('href') ?? ''} ${control.getAttribute('aria-label') ?? ''}`.trim()
      if (!label) return

      const response = INTERACTION_LINES.find(({ test }) => test(label))
      if (!response) return

      interactionCooldownRef.current = now + 1400
      setTimeout(() => speak(response.line, 3200), 80)
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => document.removeEventListener('click', onDocumentClick, true)
  }, [speak])

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    }
  }, [])

  const handlePetClick = () => {
    const index = nextDifferentIndex(CLICK_LINES.length, clickIndexRef.current)
    clickIndexRef.current = index
    speak(CLICK_LINES[index], 5000)
  }

  return (
    <aside
      data-xfactor-pet-root
      className="fixed bottom-[max(.55rem,env(safe-area-inset-bottom))] right-2 z-[80] flex w-[154px] flex-col items-end md:bottom-3 md:right-5 md:w-[250px]"
      aria-live="polite"
    >
      <div
        className={`mb-[-4px] mr-1 w-[150px] border border-cyan-300/35 bg-black/90 px-3 py-2 font-mono text-[10px] leading-[1.35] text-white shadow-[0_0_24px_rgba(0,229,255,.16),0_0_18px_rgba(255,32,122,.12)] backdrop-blur-md transition duration-200 md:mr-5 md:w-[230px] md:px-4 md:py-3 md:text-xs ${
          bubbleVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        role="status"
        style={{ clipPath: 'polygon(0 0,100% 0,100% 86%,88% 86%,82% 100%,78% 86%,0 86%)' }}
      >
        <span className="mr-1 font-bold text-pink-400">xFactor:</span>
        {message}
      </div>

      <button
        type="button"
        onClick={handlePetClick}
        className="group relative cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Talk to xFactor"
        title="Talk to xFactor"
      >
        <span className="pointer-events-none absolute bottom-3 right-2 h-12 w-20 rounded-full bg-cyan-400/10 blur-xl transition group-hover:bg-pink-400/15 md:h-14 md:w-24" />
        <div
          ref={spriteHostRef}
          className="relative transition-transform duration-150 group-hover:scale-[1.035] group-active:scale-95"
        />
      </button>
    </aside>
  )
}

export default XFactorSitePet
