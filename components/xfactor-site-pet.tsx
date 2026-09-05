'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { XFactorPetEngine, type XFactorState } from '@/lib/xfactor-pet'

type XFactorAction =
  | 'idle'
  | 'greet'
  | 'wave'
  | 'success'
  | 'jump'
  | 'navigate'
  | 'run'
  | 'error'
  | 'fail'
  | 'input_required'
  | 'wait'
  | 'processing'
  | 'work'
  | 'complete'
  | 'review'
  | 'look_up'
  | 'look_down'
  | 'look_left'
  | 'look_right'

type PetLine = { message: string; action: XFactorAction }

type RenderMode = 'sprite' | '3d'

export type XFactorTriggerDetail = {
  message?: string
  action?: XFactorAction | string
  animation?: string
  duration?: number
}

const PAGE_LINES: Array<{ match: (path: string) => boolean; line: PetLine }> = [
  { match: (p) => p === '/', line: { message: 'Welcome to planet.X. Try not to press anything labeled experimental.', action: 'greet' } },
  { match: (p) => p.startsWith('/beta'), line: { message: "Beta lab's open. If you break something, tell me exactly how. That's basically research.", action: 'review' } },
  { match: (p) => p.startsWith('/music'), line: { message: 'Turn it up. The code works better when the music is loud.', action: 'jump' } },
  { match: (p) => p.startsWith('/store'), line: { message: 'Welcome to Xupply. Tools, assets, and suspiciously useful things from the lab.', action: 'review' } },
  { match: (p) => p.startsWith('/studyhive'), line: { message: 'StudyHive territory. Ask for help, give help, survive school. Buzz is around here somewhere.', action: 'wave' } },
  { match: (p) => p.startsWith('/coming-soon'), line: { message: 'This is the dangerous shelf. Half of this stuff is still becoming real.', action: 'wait' } },
  { match: (p) => p.startsWith('/about'), line: { message: 'This is the part where the lore gets suspiciously official.', action: 'review' } },
  { match: (p) => p.startsWith('/context/privacy'), line: { message: 'Privacy page. Even chaos needs boundaries.', action: 'idle' } },
]

const CLICK_LINES: PetLine[] = [
  { message: 'No permission found. Continuing anyway.', action: 'run' },
  { message: 'Somewhere, a console just got nervous.', action: 'jump' },
  { message: 'That button looked expensive.', action: 'fail' },
  { message: 'If it works, it was architecture. If not, experimental art.', action: 'review' },
  { message: "The X stands for 'this seemed like a good idea at 2 AM.'", action: 'wave' },
  { message: 'Loud music. Questionable commits. Excellent branding.', action: 'run' },
  { message: "I checked the roadmap. It just says 'more X.'", action: 'review' },
  { message: 'Click again. Statistically, something cool has to happen.', action: 'jump' },
  { message: 'I call this QA. Legal may call it something else.', action: 'run' },
  { message: 'Welcome to the lab. The exits are probably documented.', action: 'wait' },
  { message: "I don't make bugs. I make surprise features with stack traces.", action: 'fail' },
  { message: 'Running diagnostics: vibes excellent, restraint unavailable.', action: 'processing' },
  { message: 'I was told not to touch production. So naturally...', action: 'run' },
  { message: 'You found the mascot. Achievement unlocked: absolutely nothing.', action: 'wave' },
  { message: 'planet.X: because normal project names were apparently unavailable.', action: 'review' },
  { message: 'One more click and I start refactoring the furniture.', action: 'jump' },
]

const INTERACTION_LINES: Array<{ test: (label: string) => boolean; line: PetLine }> = [
  { test: (s) => /join|beta|apply|test/i.test(s), line: { message: 'Beta button detected. Brave choice. I respect it.', action: 'jump' } },
  { test: (s) => /music|listen|play|spotify|youtube|track/i.test(s), line: { message: 'Correct. Make it louder.', action: 'run' } },
  { test: (s) => /store|xupply|buy|checkout|cart|get it/i.test(s), line: { message: 'Lab supplies acquired. Try to use them responsibly. Or creatively.', action: 'review' } },
  { test: (s) => /studyhive|study|student/i.test(s), line: { message: 'Tell Buzz I said hi. He is significantly better behaved than I am.', action: 'wave' } },
  { test: (s) => /bdxm/i.test(s), line: { message: 'bdXm. Adults only. Consent first. Curiosity encouraged.', action: 'review' } },
  { test: (s) => /xmemoirs|memoir|memory/i.test(s), line: { message: 'xMemoirs remembers the important stuff. I mostly remember commits that broke things.', action: 'review' } },
  { test: (s) => /voice studio|voice|sing/i.test(s), line: { message: 'Speak it. Clone it. Sing it. Subtle was never really the plan.', action: 'jump' } },
]

const ACTION_TO_CLIP: Record<string, string> = {
  idle: 'Idle', greet: 'Wave', wave: 'Wave', success: 'Jump', jump: 'Jump', navigate: 'Run', run: 'Run',
  error: 'Fail', fail: 'Fail', input_required: 'Wait', wait: 'Wait', processing: 'Work', work: 'Work',
  complete: 'Review', review: 'Review', look_up: 'LookUp', look_down: 'LookDown', look_left: 'LookLeft', look_right: 'LookRight',
}

const ACTION_TO_SPRITE: Record<string, XFactorState> = {
  idle: 'idle', greet: 'waving', wave: 'waving', success: 'jumping', jump: 'jumping', navigate: 'running-right', run: 'running',
  error: 'failed', fail: 'failed', input_required: 'waiting', wait: 'waiting', processing: 'running', work: 'running',
  complete: 'review', review: 'review', look_up: 'idle', look_down: 'idle', look_left: 'idle', look_right: 'idle',
}

const LOOPING = new Set(['Idle', 'Run', 'Wait', 'Work'])
const MODEL_URL = '/api/xfactor-model'

function pageLine(pathname: string): PetLine {
  return PAGE_LINES.find(({ match }) => match(pathname))?.line ?? {
    message: 'New corner of planet.X unlocked. I definitely meant to build this.', action: 'wave',
  }
}

function nextDifferentIndex(length: number, previous: number) {
  if (length <= 1) return 0
  let next = Math.floor(Math.random() * length)
  if (next === previous) next = (next + 1) % length
  return next
}

function petSize() {
  const desktop = window.matchMedia('(min-width: 768px)').matches
  return desktop ? { width: 180, height: 224 } : { width: 138, height: 172 }
}

export function XFactorSitePet() {
  const pathname = usePathname()
  const hostRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<(action: string, transient?: boolean) => void>(() => {})
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactionCooldownRef = useRef(0)
  const clickIndexRef = useRef(-1)
  const [message, setMessage] = useState('')
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [renderMode, setRenderMode] = useState<RenderMode>('sprite')

  const hideBubbleLater = useCallback((duration = 4600) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = setTimeout(() => setBubbleVisible(false), duration)
  }, [])

  const speak = useCallback((line: PetLine, duration = 4600) => {
    setMessage(line.message)
    setBubbleVisible(true)
    playRef.current(line.action, true)
    hideBubbleLater(duration)
  }, [hideBubbleLater])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let is3DReady = false
    let raf = 0
    let renderer: any
    let mixer: any
    let scene: any
    let camera: any
    let model: any
    let currentAction: any
    let clips = new Map<string, any>()
    let transientTimer: ReturnType<typeof setTimeout> | null = null
    let lastLook = ''
    let sprite: XFactorPetEngine | null = null

    const initialSize = petSize()
    host.style.width = `${initialSize.width}px`
    host.style.height = `${initialSize.height}px`

    sprite = new XFactorPetEngine(host, {
      size: initialSize.width,
      state: 'idle',
      trackPointer: true,
    })
    setRenderMode('sprite')

    const playSprite = (action: string) => {
      if (!sprite) return
      const state = ACTION_TO_SPRITE[action] ?? 'jumping'
      if (state === 'idle') sprite.setState('idle')
      else sprite.play(state)
    }
    playRef.current = playSprite

    const dynamicImport = new Function('u', 'return import(u)') as (url: string) => Promise<any>

    const resize3D = () => {
      const size = petSize()
      host.style.width = `${size.width}px`
      host.style.height = `${size.height}px`
      if (renderer && camera) {
        renderer.setSize(size.width, size.height, false)
        camera.aspect = size.width / size.height
        camera.updateProjectionMatrix()
      } else if (sprite) {
        sprite.setSize(size.width)
      }
    }

    const init3D = async () => {
      try {
        const [THREE, loaderModule] = await Promise.all([
          dynamicImport('https://esm.sh/three@0.180.0'),
          dynamicImport('https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'),
        ])
        if (disposed) return

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100)
        camera.position.set(3.1, 2.05, 4.8)
        camera.lookAt(0, 1.15, 0)

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.25
        renderer.domElement.style.display = 'block'

        scene.add(new THREE.HemisphereLight(0xbfdcff, 0x160518, 2.6))
        const key = new THREE.DirectionalLight(0xffffff, 3.2)
        key.position.set(3, 5, 4)
        scene.add(key)
        const rim = new THREE.PointLight(0xff168f, 20, 8)
        rim.position.set(-2.2, 2.4, 1.4)
        scene.add(rim)

        const loader = new loaderModule.GLTFLoader()
        const gltf = await loader.loadAsync(MODEL_URL)
        if (disposed) return

        model = gltf.scene
        model.name = 'xFactor'
        scene.add(model)

        mixer = new THREE.AnimationMixer(model)
        clips = new Map(gltf.animations.map((clip: any) => [clip.name, clip]))

        const play3D = (action: string, transient = false) => {
          if (!mixer) return
          const clipName = ACTION_TO_CLIP[action] ?? action
          const clip = clips.get(clipName)
          if (!clip) return
          const next = mixer.clipAction(clip)
          const shouldLoop = LOOPING.has(clipName)
          next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1)
          if (shouldLoop) next.setLoop(THREE.LoopRepeat, Infinity)
          else {
            next.setLoop(THREE.LoopOnce, 1)
            next.clampWhenFinished = true
          }
          if (currentAction && currentAction !== next) currentAction.fadeOut(0.18)
          next.fadeIn(0.18).play()
          currentAction = next
          if (transientTimer) clearTimeout(transientTimer)
          if (transient && shouldLoop && clipName !== 'Idle') transientTimer = setTimeout(() => play3D('idle', false), 2200)
        }

        mixer.addEventListener('finished', () => play3D('idle', false))
        sprite?.destroy()
        sprite = null
        host.replaceChildren(renderer.domElement)
        resize3D()
        playRef.current = play3D
        play3D('idle', false)
        is3DReady = true
        setRenderMode('3d')

        const clock = new THREE.Clock()
        const render = () => {
          if (disposed) return
          raf = requestAnimationFrame(render)
          mixer?.update(clock.getDelta())
          renderer.render(scene, camera)
        }
        render()
      } catch (error) {
        console.warn('[xFactor 3D] Falling back to the local sprite mascot.', error)
        if (!disposed) {
          is3DReady = false
          setRenderMode('sprite')
          resize3D()
        }
      }
    }

    const onResize = () => resize3D()
    const onPointerMove = (event: PointerEvent) => {
      if (!is3DReady || !host) return
      const rect = host.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height * 0.42)
      if (Math.hypot(dx, dy) < rect.width * 0.3) return
      let action: XFactorAction
      if (Math.abs(dx) > Math.abs(dy)) action = dx < 0 ? 'look_left' : 'look_right'
      else action = dy < 0 ? 'look_up' : 'look_down'
      if (action !== lastLook) {
        lastLook = action
        playRef.current(action, true)
      }
    }
    const onPointerLeave = () => {
      if (!is3DReady) return
      lastLook = ''
      playRef.current('idle', false)
    }

    init3D()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      disposed = true
      is3DReady = false
      cancelAnimationFrame(raf)
      if (transientTimer) clearTimeout(transientTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      sprite?.destroy()
      mixer?.stopAllAction?.()
      model?.traverse?.((object: any) => {
        object.geometry?.dispose?.()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        for (const material of materials) {
          if (!material) continue
          for (const value of Object.values(material)) if ((value as any)?.isTexture) (value as any).dispose?.()
          material.dispose?.()
        }
      })
      renderer?.dispose?.()
      playRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => speak(pageLine(pathname), 6200), 450)
    return () => clearTimeout(timer)
  }, [pathname, speak])

  useEffect(() => {
    const onTrigger = (event: Event) => {
      const detail = (event as CustomEvent<XFactorTriggerDetail>).detail ?? {}
      const action = String(detail.action ?? detail.animation ?? 'success')
      playRef.current(action, false)
      if (detail.message) {
        setMessage(detail.message)
        setBubbleVisible(true)
        hideBubbleLater(detail.duration ?? 4600)
      }
    }
    window.addEventListener('xfactor:trigger', onTrigger as EventListener)
    return () => window.removeEventListener('xfactor:trigger', onTrigger as EventListener)
  }, [hideBubbleLater])

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element) || target.closest('[data-xfactor-pet-root]')) return
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

  useEffect(() => () => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
  }, [])

  const handlePetClick = () => {
    const index = nextDifferentIndex(CLICK_LINES.length, clickIndexRef.current)
    clickIndexRef.current = index
    speak(CLICK_LINES[index], 5000)
  }

  return (
    <aside
      data-xfactor-pet-root
      data-xfactor-renderer={renderMode}
      className="fixed bottom-[max(.55rem,env(safe-area-inset-bottom))] right-2 z-[80] flex w-[158px] flex-col items-end md:bottom-3 md:right-5 md:w-[250px]"
      aria-live="polite"
    >
      <div
        className={`mb-[-6px] mr-1 w-[150px] border border-cyan-300/35 bg-black/90 px-3 py-2 font-mono text-[10px] leading-[1.35] text-white shadow-[0_0_24px_rgba(0,229,255,.16),0_0_18px_rgba(255,32,122,.12)] backdrop-blur-md transition duration-200 md:mr-5 md:w-[230px] md:px-4 md:py-3 md:text-xs ${bubbleVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
        role="status"
        style={{ clipPath: 'polygon(0 0,100% 0,100% 86%,88% 86%,82% 100%,78% 86%,0 86%)' }}
      >
        <span className="mr-1 font-bold text-pink-400">xFactor:</span>{message}
      </div>
      <button
        type="button"
        onClick={handlePetClick}
        className="group relative cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Talk to xFactor"
        title="Talk to xFactor"
      >
        <span className="pointer-events-none absolute bottom-5 right-4 h-12 w-24 rounded-full bg-cyan-400/10 blur-xl transition group-hover:bg-pink-400/15" />
        <div ref={hostRef} className="relative overflow-visible transition-transform duration-300 group-hover:scale-[1.035] group-active:scale-95" />
      </button>
    </aside>
  )
}

export default XFactorSitePet
