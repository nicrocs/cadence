import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { updateSession } from '@/app/actions/sessions'
import { SessionForm } from '@/components/session-form'
import { notFound } from 'next/navigation'

export default async function EditSessionPage({ params } : { params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return null

  const session = await prisma.workSession.findUnique({
    where: { id, userId },
    include: { project: true },
  })

  if (!session) notFound()

  const updateWithId = updateSession.bind(null, session.id)

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Session</h1>
      <SessionForm
        action={updateWithId}
        submitLabel="Update Session"
        defaultValues={{
          date: session.date.toISOString().split('T')[0],
          duration: session.duration,
          type: session.type,
          projectName: session.project?.name,
          accomplished: session.accomplished,
          intention: session.intention,
          intentionMet: session.intentionMet
        }}
      />
    </main>
  )
}