import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ solutionId: string }> }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const { solutionId } = await context.params

  const versions = await prisma.solutionVersion.findMany({
    where: { solutionId },
    orderBy: { version: 'desc' },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return jsonOk({ versions })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ solutionId: string }> }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const { solutionId } = await context.params
  const body = (await request.json()) as {
    title?: string
    description?: string
    impact?: string
    status?: string
  }

  const title = body.title?.trim() || ''
  const description = body.description?.trim() || ''

  if (!title || !description) {
    return jsonError('Titre et description requis.', 400)
  }

  const latest = await prisma.solutionVersion.findFirst({
    where: { solutionId },
    orderBy: { version: 'desc' },
  })

  const nextVersion = (latest?.version || 0) + 1

  const result = await prisma.$transaction(async (tx) => {
    const version = await tx.solutionVersion.create({
      data: {
        solutionId,
        createdById: user.id,
        version: nextVersion,
        title,
        description,
        impact: body.impact?.trim() || null,
      },
    })

    await tx.solution.update({
      where: { id: solutionId },
      data: {
        title,
        description,
        impact: body.impact?.trim() || null,
        version: nextVersion,
        status: body.status?.trim() || 'en_revision',
      },
    })

    return version
  })

  return jsonOk({ version: result }, { status: 201 })
}
