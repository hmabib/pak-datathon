import { NextRequest } from 'next/server'
import { Role } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  if (user.role !== Role.ADMIN && user.role !== Role.MODERATOR) {
    return jsonError('Accès interdit', 403)
  }

  const [users, teams, problems, dataRequests, solutions, simulations, topClusters, requestHeatmap, topTags] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.problem.count(),
    prisma.dataRequest.count(),
    prisma.solution.count(),
    prisma.simulation.count(),
    prisma.problem.groupBy({
      by: ['cluster'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          cluster: 'desc',
        },
      },
      take: 5,
    }),
    prisma.dataRequest.groupBy({
      by: ['cluster', 'status'],
      _count: {
        _all: true,
      },
      orderBy: [{ cluster: 'asc' }, { status: 'asc' }],
    }),
    prisma.problemTag.groupBy({
      by: ['tag'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          tag: 'desc',
        },
      },
      take: 12,
    }),
  ])

  return jsonOk({
    stats: {
      users,
      teams,
      problems,
      dataRequests,
      solutions,
      simulations,
      topClusters,
      requestHeatmap,
      topTags,
    },
  })
}
