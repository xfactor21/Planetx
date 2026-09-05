export const XFACTOR_STATES = {
  idle: { row: 0, frames: 6, durations: [280, 110, 110, 140, 140, 320] },
  'running-right': { row: 1, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  'running-left': { row: 2, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  waving: { row: 3, frames: 4, durations: [140, 140, 140, 280] },
  jumping: { row: 4, frames: 5, durations: [140, 140, 140, 140, 280] },
  failed: { row: 5, frames: 8, durations: [140, 140, 140, 140, 140, 140, 140, 240] },
  waiting: { row: 6, frames: 6, durations: [150, 150, 150, 150, 150, 260] },
  running: { row: 7, frames: 6, durations: [120, 120, 120, 120, 120, 220] },
  review: { row: 8, frames: 6, durations: [150, 150, 150, 150, 150, 280] },
} as const

export type XFactorState = keyof typeof XFACTOR_STATES

type StateConfig = (typeof XFACTOR_STATES)[XFactorState]

export interface XFactorPetOptions {
  spriteUrl?: string
  size?: number
  state?: XFactorState
  trackPointer?: boolean
  reducedMotion?: boolean
}

const CELL_WIDTH = 48
const CELL_HEIGHT = 52
const SHEET_WIDTH = 384
const SHEET_HEIGHT = 572

export class XFactorPetEngine {
  private target: Element
  private options: Required<XFactorPetOptions>
  private state: XFactorState = 'idle'
  private frame = 0
  private timer: ReturnType<typeof setTimeout> | null = null
  private once = false
  private tracking = false
  private destroyed = false
  private scale = 1
  private element: HTMLDivElement

  constructor(target: Element, options: XFactorPetOptions = {}) {
    this.target = target
    this.options = {
      spriteUrl: '/xfactor/xfactor-spritesheet.png',
      size: 192,
      state: 'idle',
      trackPointer: true,
      reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
      ...options,
    }

    this.element = document.createElement('div')
    this.element.className = 'xfactor-pet-sprite'
    this.element.setAttribute('role', 'img')
    this.element.setAttribute('aria-label', 'Animated xFactor mascot')
    this.element.style.backgroundImage = `url("${this.options.spriteUrl}")`
    this.element.style.backgroundRepeat = 'no-repeat'
    this.element.style.imageRendering = 'auto'
    this.element.style.userSelect = 'none'
    this.element.style.pointerEvents = 'none'
    this.target.appendChild(this.element)

    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerLeave = this.onPointerLeave.bind(this)

    this.setSize(this.options.size)

    if (this.options.trackPointer) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', this.onPointerLeave)
    }

    this.setState(this.options.state)
  }

  setSize(width: number) {
    const safeWidth = Math.max(48, Number(width) || 192)
    this.scale = safeWidth / CELL_WIDTH
    this.element.style.width = `${safeWidth}px`
    this.element.style.height = `${CELL_HEIGHT * this.scale}px`
    this.element.style.backgroundSize = `${SHEET_WIDTH * this.scale}px ${SHEET_HEIGHT * this.scale}px`
    this.showCell(XFACTOR_STATES[this.state].row, this.frame)
    return this
  }

  setState(name: XFactorState, options: { once?: boolean } = {}) {
    const config = XFACTOR_STATES[name] as StateConfig | undefined
    if (!config) throw new RangeError(`Unknown xFactor state: ${name}`)

    this.clearTimer()
    this.state = name
    this.frame = 0
    this.once = options.once ?? false
    this.tracking = false
    this.showCell(config.row, 0)
    this.scheduleFrame()
    return this
  }

  play(name: XFactorState) {
    return this.setState(name, { once: true })
  }

  destroy() {
    this.destroyed = true
    this.clearTimer()
    window.removeEventListener('pointermove', this.onPointerMove)
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave)
    this.element.remove()
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }

  private showCell(row: number, column: number) {
    this.element.style.backgroundPosition = `${-column * CELL_WIDTH * this.scale}px ${-row * CELL_HEIGHT * this.scale}px`
  }

  private scheduleFrame() {
    if (this.destroyed || this.options.reducedMotion || this.tracking) return

    const config = XFACTOR_STATES[this.state]
    const delay = config.durations[this.frame] ?? 140

    this.timer = setTimeout(() => {
      const next = this.frame + 1
      if (next >= config.frames && this.once) {
        this.setState('idle')
        return
      }

      this.frame = next % config.frames
      this.showCell(config.row, this.frame)
      this.scheduleFrame()
    }, delay)
  }

  private onPointerMove(event: PointerEvent) {
    if (this.state !== 'idle' || this.destroyed) return

    const rect = this.element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height * 0.38
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY

    if (Math.hypot(dx, dy) < Math.max(28, rect.width * 0.18)) {
      this.onPointerLeave()
      return
    }

    this.clearTimer()
    this.tracking = true
    const degrees = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360
    const index = Math.round(degrees / 22.5) % 16
    this.showCell(9 + Math.floor(index / 8), index % 8)
  }

  private onPointerLeave() {
    if (!this.tracking || this.destroyed) return
    this.tracking = false
    this.frame = 0
    this.showCell(0, 0)
    this.scheduleFrame()
  }
}
