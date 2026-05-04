'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const SESSION_TYPES = [
  { value: 'DEEP_WORK', label: 'Deep work' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COLLABORATION', label: 'Collaboration' },
]

type TypeSelectProps = {
  defaultValue?: string
  name?: string
  onChange?: (type: string) => void
  triggerClassName?: string
}

export function TypeSelect({
  defaultValue = 'DEEP_WORK',
  name = 'type',
  onChange,
  triggerClassName,
}: TypeSelectProps) {
  const [value, setValue] = useState<string>(defaultValue)

  const onValueChange = (v: string) => {
    setValue(v)
    onChange?.(v)
  }

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="Type (optional)" />
        </SelectTrigger>
        <SelectContent>
          {SESSION_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
