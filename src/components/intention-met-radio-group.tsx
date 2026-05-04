'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Props = {
  defaultValue?: boolean | null
  onChange?: (value: boolean | null) => void
}

export function IntentionMetRadioGroup({ defaultValue, onChange }: Props) {
  const toStringValue = (v: boolean | null | undefined) =>
    v === true ? 'true' : v === false ? 'false' : ''

  const [value, setValue] = useState(toStringValue(defaultValue))

  const onValueChange = (v: string) => {
    setValue(v)
    onChange?.(v === 'true' ? true : v === 'false' ? false : null)
  }

  return (
    <>
      <RadioGroup value={value} onValueChange={onValueChange} className="flex gap-6">
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
