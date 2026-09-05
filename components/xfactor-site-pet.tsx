'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

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

const LOOPING = new Set(['Idle', 'Run', 'Wait', 'Work'])
const MODEL_B64_URL = '/models/xfactor/model.glb.gz.b64'

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

function decodeBase64(text: string) {
  const clean = text.replace(/\s+/g, '')
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function gunzip(bytes: Uint8Array) {
  if (!('DecompressionStream' in window)) throw new Error('This browser does not support DecompressionStream')
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
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
  const [loaded, setLoaded] = useState(false)

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
    let isReady = false
    let raf = 0
    let renderer: any
    let mixer: any
    let scene: any
    let camera: any
    let model: any
    let currentAction: any
    let clips = new Map<string, any>()
    let transientTimer: ReturnType<typeof setTimeout> | null = null
    let objectUrl = ''
    let lastLook = ''

    const dynamicImport = new Function('u', 'return import(u)') as (url: string) => Promise<any>

    const play = (action: string, transient = false) => {
      if (!mixer) return
      const clipName = ACTION_TO_CLIP[action] ?? action
      const clip = clips.get(clipName)
      if (!clip) return
      const next = mixer.clipAction(clip)
      const shouldLoop = LOOPING.has(clipName)
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1)
      if (shouldLoop) next.setLoop(2201, Infinity)
      else {
        next.setLoop(2200, 1)
        next.clampWhenFinished = true
      }
      if (currentAction && currentAction !== next) currentAction.fadeOut(0.18)
      next.fadeIn(0.18).play()
      currentAction = next
      if (transientTimer) clearTimeout(transientTimer)
      if (transient && shouldLoop && clipName !== 'Idle') transientTimer = setTimeout(() => play('idle', false), 2200)
    }
    playRef.current = play

    const resize = () => {
      if (!renderer || !camera) return
      const desktop = window.matchMedia('(min-width: 768px)').matches
      const width = desktop ? 180 : 138
      const height = desktop ? 224 : 172
      host.style.width = `${width}px`
      host.style.height = `${height}px`
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const init = async () => {
      try {
        const [THREE, loaderModule, text] = await Promise.all([
          dynamicImport('https://esm.sh/three@0.180.0'),
          dynamicImport('https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'),
          fetch(MODEL_B64_URL, { cache: 'force-cache' }).then((r) => {
            if (!r.ok) throw new Error(`xFactor model asset returned ${r.status}`)
            return r.text()
          }),
        ])
        if (disposed) return
        const glbBytes = await gunzip(decodeBase64(text))
        if (disposed) return
        objectUrl = URL.createObjectURL(new Blob([glbBytes], { type: 'model/gltf-binary' }))

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
        camera.position.set(0, 0.08, 4.75)
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        host.replaceChildren(renderer.domElement)
        resize()

        scene.add(new THREE.HemisphereLight(0xc9f8ff, 0x24111d, 2.2))
        const key = new THREE.DirectionalLight(0xffffff, 2.4)
        key.position.set(2.5, 4, 4)
        scene.add(key)
        const rim = new THREE.DirectionalLight(0xff2f92, 2.2)
        rim.position.set(-3, 2, -2)
        scene.add(rim)
        const cyan = new THREE.PointLight(0x00e5ff, 12, 5)
        cyan.position.set(2, 1, 2)
        scene.add(cyan)

        const loader = new loaderModule.GLTFLoader()
        const gltf = await loader.loadAsync(objectUrl)
        if (disposed) return
        model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        model.rotation.y = 0.08
        scene.add(model)

        mixer = new THREE.AnimationMixer(model)
        clips = new Map(gltf.animations.map((clip: any) => [clip.name, clip]))
        mixer.addEventListener('finished', () => play('idle', false))
        play('idle', false)
        isReady = true
        setLoaded(true)

        const clock = new THREE.Clock()
        const render = () => {
          if (disposed) return
          raf = requestAnimationFrame(render)
          mixer?.update(clock.getDelta())
          renderer.render(scene, camera)
        }
        render()
      } catch (error) {
        console.error('[xFactor 3D]', error)
        if (!disposed) setLoaded(false)
      }
    }

    const onResize = () => resize()
    const onPointerMove = (event: PointerEvent) => {
      if (!isReady || !host) return
      const rect = host.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height * 0.42)
      if (Math.hypot(dx, dy) < rect.width * 0.3) return
      let action: XFactorAction
      if (Math.abs(dx) > Math.abs(dy)) action = dx < 0 ? 'look_left' : 'look_right'
      else action = dy < 0 ? 'look_up' : 'look_down'
      if (action !== lastLook) {
        lastLook = action
        play(action, true)
      }
    }
    const onPointerLeave = () => { lastLook = ''; play('idle', false) }

    init()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      disposed = true
      isReady = false
      cancelAnimationFrame(raf)
      if (transientTimer) clearTimeout(transientTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
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
      if (objectUrl) URL.revokeObjectURL(objectUrl)
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

  useEffect(() => () => { if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current) }, [])

  const handlePetClick = () => {
    const index = nextDifferentIndex(CLICK_LINES.length, clickIndexRef.current)
    clickIndexRef.current = index
    speak(CLICK_LINES[index], 5000)
  }

  return (
    <aside data-xfactor-pet-root className="fixed bottom-[max(.55rem,env(safe-area-inset-bottom))] right-2 z-[80] flex w-[158px] flex-col items-end md:bottom-3 md:right-5 md:w-[250px]" aria-live="polite">
      <div className={`mb-[-6px] mr-1 w-[150px] border border-cyan-300/35 bg-black/90 px-3 py-2 font-mono text-[10px] leading-[1.35] text-white shadow-[0_0_24px_rgba(0,229,255,.16),0_0_18px_rgba(255,32,122,.12)] backdrop-blur-md transition duration-200 md:mr-5 md:w-[230px] md:px-4 md:py-3 md:text-xs ${bubbleVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`} role="status" style={{ clipPath: 'polygon(0 0,100% 0,100% 86%,88% 86%,82% 100%,78% 86%,0 86%)' }}>
        <span className="mr-1 font-bold text-pink-400">xFactor:</span>{message}
      </div>
      <button type="button" onClick={handlePetClick} className="group relative cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black" aria-label="Talk to xFactor" title="Talk to xFactor">
        <span className="pointer-events-none absolute bottom-5 right-4 h-12 w-24 rounded-full bg-cyan-400/10 blur-xl transition group-hover:bg-pink-400/15" />
        <div ref={hostRef} className={`relative overflow-visible transition-all duration-300 group-hover:scale-[1.035] group-active:scale-95 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      </button>
    </aside>
  )
}

export default XFactorSitePet
