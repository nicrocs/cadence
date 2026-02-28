import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { Separator } from '@/components/ui/separator'
// import { ProjectTypeahead } from '@/components/project-typeahead'
// import { IntentionMetRadioGroup } from './intention-met-radio-group'
import { TypeSelect } from './type-select'

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
  }
  submitLabel?: string
}

export function SessionForm({ action, defaultValues, submitLabel }: SessionFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
        {defaultValues?.intention && (
          <div className="rounded-lg border p-4 space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Your intention
              </p>
              <p
              className="text-base font-medium text-foreground leading-snug"
              style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '0.75rem' }}
              >
              {defaultValues.intention}
              </p>
              <Separator />
              {/* <IntentionMetRadioGroup defaultValue={defaultValues.intentionMet} /> */}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="intention" className="text-base font-semibold">
              What do you want to accomplish in this session?
          </Label>
          <p className="text-sm text-muted-foreground">
              {'Be specific. "finish testing the function" beats "work"'}
          </p>
        <Textarea
            id="intention"
            name="intention"
            defaultValue={defaultValues?.intention ?? ""}
            placeholder="e.g. Work through each line of code slowly"
            className="min-h-[100px] text-base"
            rows={3}
        />
        </div>

        <Separator />

{/* rest of the form fields below */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          name="date"
          required
          defaultValue={defaultValues?.date ?? new Date().toLocaleDateString('en-CA')}
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          type="number"
          id="duration"
          name="duration"
          required
          min="1"
          defaultValue={defaultValues?.duration}
        />
      </div>
      <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">
            What type of work did you do?
          </span>
          <TypeSelect name="type" />
        </div>
      <div>
        <Label>Project</Label>
        {/* <ProjectTypeahead defaultValue={defaultValues?.projectName} /> */}
      </div>
      <div>
        <Label htmlFor="notes">What did you accomplish?</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaultValues?.accomplished ?? undefined}
        />
      </div>
      <SubmitButton label={submitLabel} />
    </form>
  )
}