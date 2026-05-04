'use client'

import { Trash2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { deleteSession } from '@/app/actions/sessions'

function DeleteButtonInner() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      aria-label={pending ? 'Deleting session' : 'Delete session'}
      className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}

export function DeleteButton({ id }: { id: string }) {
  const deleteWithId = deleteSession.bind(null, id)

  return (
    <form action={deleteWithId}>
      <DeleteButtonInner />
    </form>
  )
}
