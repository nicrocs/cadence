'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { ProjectTypeahead } from '@/components/project-typeahead'
import { IntentionMetRadioGroup } from './intention-met-radio-group'
import { TypeSelect } from './type-select'

const fieldClassName =
  'min-h-0 rounded-none border-0 border-b border-border bg-transparent px-0 py-3 shadow-none focus-visible:border-ring focus-visible:ring-0 md:text-base'

type SessionFormProps = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    date?: string
    duration?: number
    type?: string
    projectName?: string
    accomplished?: string | null
    intention?: string | null
    intentionMet?: boolean | null
    pickup?: string | null
  }
  submitLabel?: string
}

export function SessionForm({ action, defaultValues, submitLabel }: SessionFormProps) {
  return (
    <form action={action} className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {defaultValues?.intention && (
        <div className="space-y-4 border-b border-border/80 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Intention outcome
          </p>
          <IntentionMetRadioGroup defaultValue={defaultValues.intentionMet} onChange={() => {}} />
        </div>
      )}

      <div className="space-y-2 border-b border-border/80 pb-6">
        <Label htmlFor="intention" className="text-base font-semibold">
          What do you want to accomplish in this session?
        </Label>
        <p className="text-sm text-muted-foreground">
          {'Be specific. "finish testing the function" beats "work".'}
        </p>
        <Textarea
          id="intention"
          name="intention"
          defaultValue={defaultValues?.intention ?? ''}
          placeholder="e.g. Work through each line of code slowly"
          className={`${fieldClassName} min-h-[100px]`}
          rows={3}
        />
      </div>

      <div className="space-y-2 border-b border-border/80 pb-6">
        <Label htmlFor="pickup" className="text-base font-semibold">
          Where to pick up next time
        </Label>
        <Textarea
          id="pickup"
          name="pickup"
          rows={3}
          defaultValue={defaultValues?.pickup ?? ''}
          placeholder="e.g. Start with the failing test in the edit session form"
          className={fieldClassName}
        />
      </div>

      <div className="space-y-2 border-b border-border/80 pb-6">
        <Label htmlFor="accomplished" className="text-base font-semibold">
          What did you accomplish?
        </Label>
        <Textarea
          id="accomplished"
          name="accomplished"
          rows={4}
          defaultValue={defaultValues?.accomplished ?? ''}
          className={fieldClassName}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="space-y-2 border-b border-border/80 pb-6">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            required
            defaultValue={defaultValues?.date ?? new Date().toLocaleDateString('en-CA')}
            className={fieldClassName}
          />
        </div>

        <div className="space-y-2 border-b border-border/80 pb-6">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            required
            min="1"
            defaultValue={defaultValues?.duration}
            className={fieldClassName}
          />
        </div>
      </div>

      <div className="space-y-2 border-b border-border/80 pb-6">
        <span className="text-sm text-muted-foreground">
          What type of work did you do?
        </span>
        <TypeSelect
          defaultValue={defaultValues?.type}
          triggerClassName="h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2 border-b border-border/80 pb-6">
        <Label htmlFor="projectName" className="text-base font-semibold">
          Project
        </Label>
        <ProjectTypeahead
          defaultValue={defaultValues?.projectName}
          onSelect={() => {}}
          onChange={() => {}}
          inputClassName={fieldClassName}
        />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  )
}
