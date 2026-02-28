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

export function TypeSelect({ onChange }: { onChange: (type: string) => void }) {
    const [value, setValue] = useState<string>('DEEP_WORK')

    const onValueChange = (v: string) => {
      setValue(v)
      onChange(v)
    }
  return (
    <>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
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