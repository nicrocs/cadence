import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { DeleteButton } from '@/components/delete-button'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { BackButton } from '@/components/back-button'
import { TYPE_LABELS } from '@/lib/constants'

export default async function ProjectDetailPage({
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Project Detail
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-tight">{project.name}</h1>
        </div>
        <BackButton />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <p>
          {project.sessions.length} {project.sessions.length === 1 ? 'session' : 'sessions'}
        </p>
        {totalMinutes > 0 && (
          <p>
            {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m`} total work time
          </p>
        )}
        {project.sessions.length > 0 && (
          <p>Last worked on {new Date(project.sessions[0].date).toLocaleDateString()}</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Sessions</h2>
      </div>

      {project.sessions.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed bg-background/70 py-10 text-center text-muted-foreground">
          No sessions logged for this project yet.
        </div>
      ) : (
        <ul>
          {project.sessions.map((session, index) => (
            <li key={session.id} className="border-t border-border first:border-t-0">
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className={`mt-1 w-1 shrink-0 rounded-full ${index === 0 ? 'bg-cool' : 'bg-border'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {TYPE_LABELS[session.type] ?? session.type}
                    </p>

                    {session.intention && (
                      <p className="mt-3 border-l-[3px] border-cool pl-3 text-base leading-snug text-foreground">
                        {session.intention}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>Duration {session.duration}m</span>
                    </div>

                    {session.accomplished && (
                      <p className="mt-4 max-w-2xl border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                        {session.accomplished}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-start sm:pt-0.5">
                  <Link
                    href={`/sessions/${session.id}/edit`}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                      className: 'rounded-full text-sm text-foreground hover:bg-accent',
                    })}
                  >
                    Edit
                  </Link>
                  <DeleteButton id={session.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
