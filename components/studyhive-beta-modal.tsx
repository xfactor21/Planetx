'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { BetaApplicationModal } from '@/components/beta-application-modal'
import { useLockBodyScroll } from '@/lib/use-lock-body-scroll'
import {
  STUDYHIVE_STUDENT_BETA,
  STUDYHIVE_TEACHER_BETA,
  STUDYHIVE_TESTER_BETA,
} from '@/lib/beta-questions'

type Role = 'student' | 'teacher' | 'tester'

const ROLE_CONFIG = {
  student: STUDYHIVE_STUDENT_BETA,
  teacher: STUDYHIVE_TEACHER_BETA,
  tester: STUDYHIVE_TESTER_BETA,
}

export function StudyHiveBetaModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<Role | null>(null)

  useLockBodyScroll(true)

  if (role) {
    return (
      <BetaApplicationModal config={ROLE_CONFIG[role]} onClose={onClose} />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="StudyHive beta application"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md border border-amber-400 bg-background p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-amber-400 uppercase">
              Beta application
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight uppercase">
              StudyHive
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Tell me who you are?
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setRole('student')}
            className="border border-amber-400/30 px-5 py-3 text-left font-mono text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:bg-amber-400/10"
          >
            Registered Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className="border border-amber-400/30 px-5 py-3 text-left font-mono text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:bg-amber-400/10"
          >
            Registered Teacher
          </button>
          <button
            type="button"
            onClick={() => setRole('tester')}
            className="border border-amber-400 bg-amber-400 px-5 py-3 text-left font-mono text-xs font-bold tracking-[0.16em] text-black uppercase transition-colors hover:bg-amber-300"
          >
            Curious Tester
          </button>
        </div>
      </div>
    </div>
  )
}
