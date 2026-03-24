const STORAGE_KEY = 'cadence_active_session'
import { BreakSuggestion } from "./break-suggestions"

export type ActiveSession = {
  startedAt: number
  intention: string
  projectId?: string
  projectName?: string
  phase: 'work' | 'break'
  breakStartedAt?: number
  breakSuggestion?: BreakSuggestion
  prepConversation?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export function saveActiveSession(session: ActiveSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function getActiveSession(): ActiveSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ActiveSession
  } catch {
    return null
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasActiveSession(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}

export function startBreak(suggestion: BreakSuggestion): void {
  const session = getActiveSession()
  if (!session) return
  saveActiveSession({
    ...session,
    phase: 'break',
    breakStartedAt: Date.now(),
    breakSuggestion: suggestion,
  })
}