'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { WorkSessionType } from '../../../prisma/generated/prisma/enums'
import { streamText } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { getModel } from '@/lib/ai'

export async function createSession(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const type = formData.get('type') as WorkSessionType
  const duration = parseInt(formData.get('duration') as string)
  const accomplished = formData.get('accomplished') as string
  const date = new Date(formData.get('date') as string)
  const projectName = formData.get('projectName') as string
  const intention = formData.get('intention') as string
  const pickup = formData.get('pickup') as string

  let projectId = null

  if (projectName) {
  const project = await prisma.project.upsert({
    where: { userId_name: { userId, name: projectName } },
    update: {},
    create: { 
      userId, 
      name: projectName,
    },
  })
  projectId = project.id
}

  await prisma.workSession.create({
    data: {
      userId,
      type,
      duration,
      accomplished,
      date,
      projectId,
      intention,
      pickup
    },
  })

  redirect('/sessions')
}

export async function updateSession(id: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const type = formData.get('type') as WorkSessionType
  const duration = parseInt(formData.get('duration') as string)
  const accomplished = formData.get('accomplished') as string
  const date = new Date(formData.get('date') as string)
  const projectName = formData.get('projectName') as string
    const intention = formData.get('intention') as string
    const intentionMetRaw = formData.get('intentionMet')
    const intentionMet = intentionMetRaw === 'true' ? true : intentionMetRaw === 'false' ? false : null
  const pickup = formData.get('pickup') as string

    let projectId = null

  if (projectName) {
  const project = await prisma.project.upsert({
    where: { userId_name: { userId, name: projectName } },
    update: {},
    create: { 
      userId, 
      name: projectName,
    },
  })
  projectId = project.id
}

  await prisma.workSession.update({
    where: { id, userId },
    data: {
      type,
      duration,
      accomplished,
      date,
      projectId,
      intention,
      intentionMet,
      pickup
    },
  })

  redirect('/sessions')
}

export async function deleteSession(id: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  await prisma.workSession.delete({
    where: { id, userId },
  })

  redirect('/sessions')
}

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

export async function getLastSessionForProject(projectId: string) {
  const { userId } = await auth()
  if (!userId) return null

  return prisma.workSession.findFirst({
    where: { userId, projectId },
    orderBy: { date: 'desc' },
    select: { pickup: true, intention: true }
  })
}

export async function generate(input: string) {
  const stream = createStreamableValue('');
  const model = await getModel();

  (async () => {
    const { textStream } = streamText({
      model,
      prompt: input,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
