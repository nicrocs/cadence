'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getProjects(query: string) {
  const { userId } = await auth()
  if (!userId) return []

  return prisma.project.findMany({
    where: {
      userId,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 5,
    orderBy: { name: 'asc' },
  })
}

export async function getProjectsWithRecentSession() {
  const { userId } = await auth()
  if (!userId) return []

  const songs = await prisma.project.findMany({
    where: { userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
  })

  // sort by most recently practiced
  return songs.sort((a, b) => {
    const aDate = a.sessions[0]?.date ?? new Date(0)
    const bDate = b.sessions[0]?.date ?? new Date(0)
    return bDate.getTime() - aDate.getTime()
  })
}