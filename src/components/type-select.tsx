'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TYPES = [
  { value: 'DEEP_WORK', label: 'Deep work' },
  { value: 'PLANNING', label: 'Planning' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COLLABORATION', label: 'Collaboration' },
]

export function TypeSelect({ name = 'type' }: { name?: string }) {
  const [value, setValue] = useState('DEEP_WORK')

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Type (optional)" />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}