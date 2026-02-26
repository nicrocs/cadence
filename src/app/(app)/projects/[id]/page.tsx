import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { DeleteButton } from '@/components/delete-button'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/back-button'

export default async function SongDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return null

  const project = await prisma.project.findUnique({
    where: { id, userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!project) notFound()

    const totalMinutes = project.sessions.reduce((sum, s) => sum + s.duration, 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

  return (
    <main className="max-w-xl mx-auto p-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <BackButton />
        </div>
        <div className="flex gap-2 mt-4">
            <p>
                {project.sessions.length} {project.sessions.length === 1 ? 'session' : 'sessions'}
            </p>
            {totalMinutes > 0 && (
                <>
                <span>·</span>
                <p>
                    {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m`} total practice time
                </p>
                </>
            )}
            {project.sessions.length > 0 && (
                <>
                <span>·</span>
                <p>Last worked on {new Date(project.sessions[0].date).toLocaleDateString()}</p>
                </>
            )}
        </div>
      </div>

      {/* Sessions */}
      <h2 className="text-lg font-semibold mb-3">Sessions</h2>
      {project.sessions.length === 0 ? (
        <p className="text-gray-500">No sessions logged for this song yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {project.sessions.map((session) => (
            <li key={session.id}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">
                      {session.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>
                      <span className="text-gray-400">Duration</span>{' '}
                      {session.duration}m
                    </span>
                  </div>
                  {session.accomplished && (
                    <p className="text-sm text-gray-500 mt-3 border-t pt-3">
                      {session.accomplished}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/sessions/${session.id}/edit`}
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      Edit
                    </Link>
                    <DeleteButton id={session.id} />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}