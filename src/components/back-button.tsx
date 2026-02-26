'use client'

import { useRouter } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className={buttonVariants({ variant: 'ghost', size: 'sm' })}
    >
      ← Back
    </button>
  )
}