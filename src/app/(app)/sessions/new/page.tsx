'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ProjectTypeahead, Project } from '@/components/project-typeahead'
import { saveActiveSession } from '@/lib/active-session'
import { getLastSessionForProject } from '@/app/actions/sessions'

export default function NewSessionPage() {
  const router = useRouter()
  const [intention, setIntention] = useState('')
  const [projectId, setProjectId] = useState<string | undefined>()
  const [projectName, setProjectName] = useState<string | undefined>()
  const [lastPickup, setLastPickup] = useState<string | null>(null)

  async function handleProjectInput(projectName: string) {
    setProjectName(projectName)
  }

  async function handleProjectSelect(project: Project | null) {
    if (project) {
      setProjectId(project.id)
      setProjectName(project.name)
      setLastPickup(null)

      const last = await getLastSessionForProject(project.id)
      if (last?.pickup) setLastPickup(last.pickup)
    } 
  }

  function handleStart() {
    if (!intention.trim()) return

    console.log({ projectName })

    saveActiveSession({
      startedAt: Date.now(),
      intention: intention.trim(),
      projectId,
      projectName,
      phase: 'work',
    })

    router.push('/sessions/prepare')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Session Setup
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Start a Session</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {`25 minutes. One thing. Let's go.`}
        </p>
      </div>

      <div className="space-y-2 rounded-[1.5rem] border bg-card/90 p-5 shadow-sm">
        <Label className="text-base font-semibold">
          What are you working on?
        </Label>
        <ProjectTypeahead
          onSelect={handleProjectSelect}
          onChange={handleProjectInput}
        />
      </div>
      {lastPickup && (
        <div className="space-y-3 rounded-[1.5rem] border border-cool/20 bg-cool-muted/70 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Where you left off
          </p>
          <p
            className="text-sm text-foreground leading-snug"
            style={{ borderLeft: '2px solid var(--cool)', paddingLeft: '0.75rem' }}
          >
            {lastPickup}
          </p>
          <Button
            type="button"
            onClick={() => setIntention(lastPickup)}
          >
            Use as intention →
          </Button>
        </div>
      )}

      <div className="space-y-2 rounded-[1.5rem] border bg-card/90 p-5 shadow-sm">
        <Label htmlFor="intention" className="text-base font-semibold">
          What do you want to accomplish?
        </Label>
        <p className="text-sm text-muted-foreground">
          {`Be specific. "finish the auth flow" beats "work on the app."`}
        </p>
        <Textarea
          id="intention"
          value={intention}
          onChange={e => setIntention(e.target.value)}
          placeholder="e.g. Write the finish screen component and wire it to the session action"
          className="min-h-[100px] text-base"
          rows={3}
          autoFocus
        />
      </div>

      <Button
        onClick={handleStart}
        disabled={!intention.trim()}
        size="lg"
        className="w-full rounded-full"
      >
        Start Session
      </Button>
    </div>
  )
}
