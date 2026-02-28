'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  getActiveSession,
  startBreak,
  clearActiveSession,
  type ActiveSession,
} from '@/lib/active-session'
import { getRandomSuggestion } from '@/lib/break-suggestions'

const WORK_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60 // 5 minutes in seconds

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function ActiveSessionPage() {
  const router = useRouter()
    const [session, setSession] = useState<ActiveSession | null>(() => {
        if (typeof window === 'undefined') return null
        return getActiveSession()
    })
  const [secondsLeft, setSecondsLeft] = useState<number>(WORK_DURATION)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer logic
  useEffect(() => {
    if (!session) {
        router.replace('/sessions/new')
        return
    }

    function tick() {
      setSession(current => {
        if (!current) return current

        if (current.phase === 'work') {
          const elapsed = Math.floor((Date.now() - current.startedAt) / 1000)
          const remaining = Math.max(WORK_DURATION - elapsed, 0)
          setSecondsLeft(remaining)

          if (remaining === 0) {
            const suggestion = getRandomSuggestion()
            startBreak(suggestion)
            return { ...current, phase: 'break', breakStartedAt: Date.now(), breakSuggestion: suggestion }
          }
        }

        if (current.phase === 'break') {
          const elapsed = Math.floor((Date.now() - (current.breakStartedAt ?? Date.now())) / 1000)
          const remaining = Math.max(BREAK_DURATION - elapsed, 0)
          setSecondsLeft(remaining)

          if (remaining === 0) {
            router.push('/sessions/finish')
          }
        }

        return current
      })
    }

    tick() // run immediately
    intervalRef.current = setInterval(tick, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [session, session?.phase, router])

  function handleFinishEarly() {
    router.push('/sessions/finish')
  }

  function handleSkipBreak() {
    router.push('/sessions/finish')
  }

  function handleDoneForNow() {
    router.push('/sessions/finish')
  }

  if (!session) return null

  if (session.phase === 'break') {
    return (
      <main className="max-w-xl mx-auto p-8 flex flex-col items-center gap-8 pt-16">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            Nice work
          </p>
          <h1 className="text-2xl font-bold">Take a break</h1>
        </div>

        {session.breakSuggestion && (
          <div className="rounded-lg border p-6 text-center max-w-sm">
            <p className="text-base leading-relaxed">
              {session.breakSuggestion.text}
            </p>
          </div>
        )}

        <p className="text-2xl font-mono font-light tabular-nums">
          {formatTime(secondsLeft)}
        </p>

        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={handleSkipBreak}>
            Skip Break
          </Button>
          <Button className="flex-1" onClick={handleDoneForNow}>
            {`I'm Done for Now`}
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto p-8 flex flex-col items-center gap-8 pt-16">
      {session.projectName && (
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          {session.projectName}
        </p>
      )}

      <p
        className="text-lg font-medium text-foreground leading-snug text-center max-w-sm"
        style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '0.75rem', textAlign: 'left' }}
      >
        {session.intention}
      </p>

      <p className="text-7xl font-mono font-light tabular-nums">
        {formatTime(secondsLeft)}
      </p>

      <Button variant="outline" onClick={handleFinishEarly}>
        Finish Early
      </Button>
    </main>
  )
}