import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DeleteButton } from '@/components/delete-button' 
import { buttonVariants } from '@/components/ui/button'
import { TYPE_LABELS } from '@/lib/constants'

export default async function SessionsPage() {
  const { userId } = await auth()

  if (!userId) return null

    const sessions = await prisma.workSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { project: true },
    })

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Session Log
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-tight">Work Sessions</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Review recent focused work, edit details, and keep momentum from one session to the next.
          </p>
        </div>
        <Link
          href="/sessions/new"
          className={buttonVariants({
            variant: 'default',
            className: 'h-10 rounded-[1rem] bg-cool px-5 text-sm text-cool-foreground shadow-none hover:bg-cool/92',
          })}
        >
          Log Session
        </Link>
      </div>
      {sessions.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed bg-background/70 py-10 text-center text-muted-foreground">
            No sessions yet. Log your first one to build your cadence.
        </div>
      ) : (
        <div>
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="border-t border-border first:border-t-0"
            >
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className={`mt-1 w-1 shrink-0 rounded-full ${index === 0 ? 'bg-cool' : 'bg-border'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {session.project ? (
                        <Link
                          href={`/projects/${session.projectId}`}
                          className="text-[1.05rem] font-semibold leading-tight tracking-tight text-foreground transition-colors hover:text-cool"
                        >
                          {session.project.name}
                        </Link>
                      ) : (
                        <p className="text-[1.05rem] font-semibold leading-tight tracking-tight text-foreground">
                          Untitled Session
                        </p>
                      )}
                      <span className="rounded-full bg-cool-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-cool-muted-foreground">
                        {TYPE_LABELS[session.type]}
                      </span>
                    </div>

                    {session.intention && (
                      <p className="mt-3 border-l-[3px] border-cool pl-3 text-base leading-snug text-foreground">
                        {session.intention}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span>Duration {session.duration}m</span>
                      <span>{new Date(session.date).toLocaleDateString()}</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
