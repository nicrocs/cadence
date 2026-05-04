'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  getActiveSession,
  startBreak,
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
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 pt-8">
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Nice work
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Take a break</h1>
        </div>

        {session.breakSuggestion && (
          <div className="max-w-xl rounded-[2rem] border bg-card/95 p-8 text-center shadow-sm">
            <p className="text-base leading-relaxed text-foreground">
              {session.breakSuggestion.text}
            </p>
          </div>
        )}

        <div className="rounded-full border border-cool/20 bg-cool-muted/70 px-8 py-4">
          <p className="text-3xl font-mono font-light tabular-nums text-cool-muted-foreground">
            {formatTime(secondsLeft)}
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1 rounded-full" onClick={handleSkipBreak}>
            Skip Break
          </Button>
          <Button className="flex-1 rounded-full" onClick={handleDoneForNow}>
            {`I'm Done for Now`}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 pt-8">
      <div className="w-full rounded-[2rem] border bg-card/95 px-6 py-8 text-center shadow-sm sm:px-10 sm:py-10">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          In Session
        </p>
        {session.projectName && (
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {session.projectName}
          </p>
        )}

        <p
          className="mx-auto mt-4 max-w-xl border-l-2 border-cool pl-3 text-left text-lg font-medium leading-snug text-foreground"
        >
          {session.intention}
        </p>

        <p className="mt-10 text-7xl font-mono font-light tabular-nums text-foreground sm:text-8xl">
          {formatTime(secondsLeft)}
        </p>
      </div>

      <Button variant="outline" className="rounded-full" onClick={handleFinishEarly}>
        Finish Early
      </Button>
    </div>
  )
}
