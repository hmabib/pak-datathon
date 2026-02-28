import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  const [problemsCount, requestsCount, teamsCount, notificationsCount, onboardingScore] = await Promise.all([
    prisma.problem.count({ where: { createdById: user.id } }),
    prisma.dataRequest.count({ where: { requesterId: user.id } }),
    prisma.teamMember.count({ where: { userId: user.id } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    prisma.onboardingScore.findUnique({
      where: { userId: user.id },
      select: {
        compatibilityScore: true,
        dataReadiness: true,
        teamFitScore: true,
      },
    }),
  ])

  return jsonOk({
    summary: {
      problemsCount,
      requestsCount,
      teamsCount,
      notificationsCount,
      onboardingScore,
    },
  })
}
