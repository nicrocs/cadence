'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getActiveSession, clearActiveSession, type ActiveSession } from '@/lib/active-session'
import { IntentionMetRadioGroup } from '@/components/intention-met-radio-group'
import { createSession } from '@/app/actions/sessions'
import { TypeSelect, SESSION_TYPES } from '@/components/type-select'

const WORK_DURATION_MS = 25 * 60 * 1000

export default function FinishSessionPage() {
  const router = useRouter()
  const [session, setSession] = useState<ActiveSession | null>(() => {
    if (typeof window === 'undefined') return null
    return getActiveSession()
  })
  const [accomplished, setAccomplished] = useState('')
  const [pickup, setPickup] = useState('')
  const [intentionMet, setIntentionMet] = useState<boolean | null>(null)
  const [duration, setDuration] = useState<number>(() => {
    if (typeof window === 'undefined') return 25
    const active = getActiveSession()
    if (!active) return 25
    return Math.max(1, Math.round((Date.now() - active.startedAt) / 60000))
  })
  const [type, setType] = useState(SESSION_TYPES[0].value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) router.replace('/sessions/new')
  }, [session, router])

  async function handleSave() {
    if (!session) return
    setSaving(true)

    const formData = new FormData()
    formData.set('intention', session.intention)
    formData.set('accomplished', accomplished)
    formData.set('pickup', pickup)
    formData.set('intentionMet', intentionMet === null ? '' : String(intentionMet))
    formData.set('duration', String(duration))
    formData.set('date', new Date(session.startedAt).toISOString())
    formData.set('type', type)
    if (session.projectId) formData.set('projectId', session.projectId)
    if (session.projectName) formData.set('projectName', session.projectName)

    await createSession(formData)
    clearActiveSession()
    router.push('/sessions')
  }

  if (!session) return null

  return (
    <main className="max-w-xl mx-auto p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Session Complete</h1>
        {session.projectName && (
          <p className="text-sm text-muted-foreground mt-1">{session.projectName}</p>
        )}
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Your intention
        </p>
        <p
          className="text-base font-medium text-foreground leading-snug"
          style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '0.75rem' }}
        >
          {session.intention}
        </p>
        <Separator />
        <div className="space-y-2">
          <Label className="text-sm">Did this happen?</Label>
          <IntentionMetRadioGroup
            defaultValue={null}
            onChange={setIntentionMet}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accomplished" className="text-base font-semibold">
          What did you accomplish?
        </Label>
        <Textarea
          id="accomplished"
          value={accomplished}
          onChange={e => setAccomplished(e.target.value)}
          placeholder="e.g. Got the timer working, fixed the cascading render warning"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickup" className="text-base font-semibold">
          Where to pick up next time
        </Label>
        <p className="text-sm text-muted-foreground">
          {`Write this while it's fresh. Your future self will thank you.`}
        </p>
        <Textarea
          id="pickup"
          value={pickup}
          onChange={e => setPickup(e.target.value)}
          placeholder="e.g. Start with the finish screen — session action needs accomplished and pickup fields wired in"
          rows={3}
          className="border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-24"
        />
      </div>
        <div className='space-y-2'>
            <span className="text-sm text-gray-500">
              What type of work did you do?
            </span>
            <TypeSelect onChange={setType} />
        </div>
            

      <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
        {saving ? 'Saving...' : 'Save Session'}
      </Button>
    </main>
  )
}