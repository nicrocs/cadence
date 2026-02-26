'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Props = {
  defaultValue?: boolean | null
}

export function IntentionMetRadioGroup({ defaultValue }: Props) {
  const toStringValue = (v: boolean | null | undefined) =>
    v === true ? 'true' : v === false ? 'false' : ''

  const [value, setValue] = useState(toStringValue(defaultValue))

  return (
    <>
      <RadioGroup value={value} onValueChange={setValue} className="flex gap-6">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="true" id="met-yes" />
          <Label htmlFor="met-yes">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="false" id="met-no" />
          <Label htmlFor="met-no">No</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="" id="met-unsure" />
          <Label htmlFor="met-unsure">Not sure</Label>
        </div>
      </RadioGroup>
      <input type="hidden" name="intentionMet" value={value} />
    </>
  )
}