import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardAction, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { DeleteButton } from '@/components/delete-button' 
import { buttonVariants } from '@/components/ui/button'

export default async function SessionsPage() {
  const { userId } = await auth()

  if (!userId) return null

    const sessions = await prisma.workSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { project: true },
    })

  return (
    <main className="max-w-xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Sessions</h1>
        <Link
          href="/sessions/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Log Session
        </Link>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions yet. Log your first one!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                {session.project && (
                  <CardTitle>
                    <Link href={`/songs/${session.projectId}`}>{session.project.name}</Link>
                  </CardTitle>
                )}
                <span className="text-sm text-muted-foreground">{session.type}</span>
                {session.intention && (
                  <p className="text-base font-medium text-foreground leading-snug mt-1 pl-3 border-l-2 border-primary">
                    {session.intention}
                  </p>
                )}

              </CardHeader>
                <CardContent>
                    <div className="flex gap-4 text-sm">
                        <span><span className="text-gray-400">Duration</span> {session.duration}m</span>
                    </div>
                    {session.accomplished && (
                        <p className="text-sm text-gray-500 mt-2 border-t pt-3">{session.accomplished}</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Link
                        href={`/sessions/${session.id}/edit`}
                        className={`${buttonVariants({ variant: 'link', size: 'sm' })} mr-2`}
                    >
                        Edit
                    </Link>
                    <DeleteButton id={session.id} />
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}