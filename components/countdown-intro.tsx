'use client'

import { useEffect, useMemo, useState } from 'react'

const STEPS = [
  { count: 3, line: 'Looking for permission...', sub: 'Probably not gonna find it.' },
  { count: 2, line: 'Waiting for approval...', sub: 'Still feels like a bad plan.' },
  { count: 1, line: 'Forget it.', sub: 'Launching planet.X anyway.' },
]

function signalMusic(eventName: 'planetx:arm-music' | 'planetx:start-music') {
  window.dispatchEvent(new Event(eventName))
}

export function CountdownIntro() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!started) return

    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setStep(index)
        }, index * 1100),
      )
    })

    timers.push(
      setTimeout(() => {
        signalMusic('planetx:start-music')
        setVisible(false)
      }, STEPS.length * 1100 + 600),
    )

    return () => timers.forEach(clearTimeout)
  }, [started])

  const current = useMemo(() => STEPS[Math.min(step, STEPS.length - 1)], [step])

  function beginIntro() {
    // Start the first track silently inside the user's click gesture. At the end
    // of the countdown the player rewinds and unmutes it, which is much more
    // reliable across Chrome/Safari/mobile autoplay policies.
    signalMusic('planetx:arm-music')
    setStep(0)
    setStarted(true)
  }

  function skipIntro() {
    signalMusic('planetx:arm-music')
    signalMusic('planetx:start-music')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-[0.7rem] tracking-[0.28em] text-accent uppercase">
          planet.X boot sequence
        </p>

        {!started ? (
          <>
            <div className="mt-8 text-5xl font-black tracking-tight text-primary drop-shadow-[0_0_24px_rgba(255,0,170,0.35)] sm:text-7xl">
              X
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight uppercase sm:text-3xl md:text-4xl">
              This could still work out.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              No promises. One button. Three seconds. Then we launch it anyway.
            </p>
            <button
              type="button"
              onClick={beginIntro}
              className="mt-8 border border-primary bg-primary px-7 py-3 font-mono text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter planet.X
            </button>
          </>
        ) : (
          <>
            <div className="mt-6 text-[7rem] leading-none font-black tracking-tight text-primary drop-shadow-[0_0_24px_rgba(255,0,170,0.35)] sm:text-[9rem] md:text-[11rem]">
              {current.count}
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight uppercase sm:text-3xl md:text-4xl">
              {current.line}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {current.sub}
            </p>
            <button
              type="button"
              onClick={skipIntro}
              className="mt-8 border border-border px-4 py-2 font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
            >
              Skip intro
            </button>
          </>
        )}
      </div>
    </div>
  )
}
