import { NextRequest } from 'next/server'
import { ClusterType } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { validateCluster } from '@/lib/validators'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const openOnly = request.nextUrl.searchParams.get('open') === 'true'

  const teams = await prisma.team.findMany({
    where: openOnly ? { isOpen: true } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 40,
    include: {
      members: {
        select: {
          userId: true,
          role: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
      _count: {
        select: {
          members: true,
          problems: true,
          solutions: true,
        },
      },
    },
  })

  return jsonOk({ teams })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const body = (await request.json()) as {
    name?: string
    description?: string
    objective?: string
    cluster?: string
    maxMembers?: number
  }

  const name = body.name?.trim() || ''
  const description = body.description?.trim() || ''
  const objective = body.objective?.trim() || ''
  const cluster = body.cluster?.trim() || ''

  if (!name) return jsonError('Le nom de l’équipe est requis.', 400)

  let parsedCluster: ClusterType | null = null
  if (cluster) {
    if (!validateCluster(cluster)) return jsonError('Cluster invalide.', 400)
    parsedCluster = cluster
  }

  const maxMembers = Math.min(12, Math.max(3, Number(body.maxMembers || 6)))

  const created = await prisma.team.create({
    data: {
      name,
      description: description || null,
      objective: objective || null,
      cluster: parsedCluster,
      maxMembers,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
    },
    include: {
      members: {
        select: {
          userId: true,
          role: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  })

  return jsonOk({ team: created }, { status: 201 })
}
