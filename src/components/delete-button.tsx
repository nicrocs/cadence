'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { deleteSession } from '@/app/actions/sessions'

function DeleteButtonInner() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      disabled={pending}
    >
      {pending ? 'Deleting...' : 'Delete'}
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