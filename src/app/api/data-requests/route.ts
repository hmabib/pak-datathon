import { NextRequest } from 'next/server'
import { RequestStatus } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { validateCluster } from '@/lib/validators'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  const all = request.nextUrl.searchParams.get('all') === 'true'

  const requests = await prisma.dataRequest.findMany({
    where: all ? undefined : { requesterId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      cluster: true,
      datasetType: true,
      status: true,
      objective: true,
      justification: true,
      createdAt: true,
      requester: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return jsonOk({ requests })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  const body = (await request.json()) as {
    cluster?: string
    datasetType?: string
    objective?: string
    justification?: string
    estimatedImpact?: string
    duration?: string
    sensitivityLevel?: number
    problemId?: string
  }

  const cluster = body.cluster || ''
  const datasetType = body.datasetType?.trim() || ''
  const objective = body.objective?.trim() || ''
  const justification = body.justification?.trim() || ''

  if (!validateCluster(cluster)) {
    return jsonError('Cluster invalide.', 400)
  }

  if (!datasetType || !objective || !justification) {
    return jsonError('Dataset, objectif et justification sont requis.', 400)
  }

  const requestRecord = await prisma.dataRequest.create({
    data: {
      requesterId: user.id,
      cluster,
      datasetType,
      objective,
      justification,
      estimatedImpact: body.estimatedImpact?.trim() || null,
      duration: body.duration?.trim() || null,
      sensitivityLevel: Math.min(5, Math.max(1, Number(body.sensitivityLevel || 1))),
      status: RequestStatus.SOUMISE,
      problemId: body.problemId || null,
    },
    select: {
      id: true,
      cluster: true,
      datasetType: true,
      status: true,
      createdAt: true,
    },
  })

  return jsonOk({ request: requestRecord }, { status: 201 })
}
