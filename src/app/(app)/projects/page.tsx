import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProjectsPage() {
  const { userId } = await auth()
  if (!userId) return null

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
  })

  const sorted = projects.sort((a, b) => {
    const aDate = a.sessions[0]?.date ?? new Date(0)
    const bDate = b.sessions[0]?.date ?? new Date(0)
    return bDate.getTime() - aDate.getTime()
  })

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Project Map
        </p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight">Projects</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Browse the projects your sessions attach to and see where momentum is building or stalling.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed bg-background/70 py-10 text-center text-muted-foreground">
          No projects yet. Log a session with a project to get started.
        </div>
      ) : (
        <ul>
          {sorted.map((project) => {
            const lastSession = project.sessions[0]

            return (
              <li key={project.id} className="border-t border-border first:border-t-0">
                <Link
                  href={`/projects/${project.id}`}
                  className="block py-5 transition-colors hover:text-cool"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-foreground">{project.name}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{project.sessions.length} session{project.sessions.length === 1 ? '' : 's'}</span>
                        {lastSession ? (
                          <span>Last worked on {new Date(lastSession.date).toLocaleDateString()}</span>
                        ) : (
                          <span>No sessions yet</span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">Open</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
