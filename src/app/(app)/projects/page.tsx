import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TUNING_LABELS } from '@/lib/constants'

export default async function SongsPage() {
  const { userId } = await auth()
  if (!userId) return null

  const songs = await prisma.song.findMany({
    where: { userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
  })

  const sorted = songs.sort((a, b) => {
    const aDate = a.sessions[0]?.date ?? new Date(0)
    const bDate = b.sessions[0]?.date ?? new Date(0)
    return bDate.getTime() - aDate.getTime()
  })

  return (
    <main className="max-w-xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Songs</h1>
      </div>
      {sorted.length === 0 ? (
        <p className="text-gray-500">No songs yet. Log a session with a song to get started.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((song) => {
            const lastSession = song.sessions[0]
            return (
              <li key={song.id}>
                <Link href={`/songs/${song.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{song.title}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {TUNING_LABELS[song.tuning]}
                            </span>
                            {song.key && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {song.key.replace('_', ' ')}
                              </span>
                            )}
                            {song.capo && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Capo {song.capo}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {lastSession ? (
                            <>
                              <p className="text-sm text-gray-400">Last practiced</p>
                              <p className="text-sm text-gray-600">
                                {new Date(lastSession.date).toLocaleDateString()}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400">No sessions yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}