import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { validateCluster } from '@/lib/validators'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  const mine = request.nextUrl.searchParams.get('mine') === 'true'

  const problems = await prisma.problem.findMany({
    where: mine ? { createdById: user.id } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      cluster: true,
      status: true,
      severity: true,
      frequency: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return jsonOk({ problems })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  const body = (await request.json()) as {
    title?: string
    description?: string
    cluster?: string
    severity?: number
    frequency?: number
    estimatedDataVolume?: string
    analyticalComplexity?: number
  }

  const title = body.title?.trim() || ''
  const description = body.description?.trim() || ''
  const cluster = body.cluster || ''

  if (!title || !description || !cluster) {
    return jsonError('Titre, description et cluster sont requis.', 400)
  }

  if (!validateCluster(cluster)) {
    return jsonError('Cluster invalide.', 400)
  }

  const problem = await prisma.problem.create({
    data: {
      title,
      description,
      cluster,
      createdById: user.id,
      severity: Math.min(5, Math.max(1, Number(body.severity || 3))),
      frequency: Math.min(5, Math.max(1, Number(body.frequency || 3))),
      estimatedDataVolume: body.estimatedDataVolume?.trim() || null,
      analyticalComplexity: Math.min(5, Math.max(1, Number(body.analyticalComplexity || 3))),
    },
    select: {
      id: true,
      title: true,
      cluster: true,
      status: true,
      createdAt: true,
    },
  })

  return jsonOk({ problem }, { status: 201 })
}
