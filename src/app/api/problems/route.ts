import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { validateCluster } from '@/lib/validators'
import { classifyProblemText } from '@/lib/problem-intelligence'

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
    tags?: string[]
  }

  const title = body.title?.trim() || ''
  const description = body.description?.trim() || ''
  const providedCluster = body.cluster || ''

  if (!title || !description) {
    return jsonError('Titre et description sont requis.', 400)
  }

  const classification = classifyProblemText(description)
  const cluster = providedCluster || classification.cluster

  if (!validateCluster(cluster)) {
    return jsonError('Cluster invalide.', 400)
  }

  const mergedTags = Array.from(
    new Set(
      [...(body.tags || []), ...classification.keywords, cluster]
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 10)

  const problem = await prisma.problem.create({
    data: {
      title,
      description,
      cluster,
      createdById: user.id,
      severity: Math.min(5, Math.max(1, Number(body.severity || 3))),
      frequency: Math.min(5, Math.max(1, Number(body.frequency || 3))),
      estimatedDataVolume: body.estimatedDataVolume?.trim() || '3 à 10 millions de lignes',
      analyticalComplexity: Math.min(
        5,
        Math.max(1, Number(body.analyticalComplexity || Math.round(classification.score / 22)))
      ),
      needsVesselData: classification.suggestedDatasets.some(
        (item) => item.toLowerCase().includes('navire') || item.toLowerCase().includes('escale')
      ),
      needsCargoData: classification.suggestedDatasets.some(
        (item) => item.toLowerCase().includes('marchandise') || item.toLowerCase().includes('cargaison')
      ),
      needsTradeData: classification.suggestedDatasets.some(
        (item) => item.toLowerCase().includes('commerce') || item.toLowerCase().includes('import')
      ),
      needsTruckData: classification.suggestedDatasets.some(
        (item) => item.toLowerCase().includes('camion') || item.toLowerCase().includes('transport')
      ),
      tags: {
        createMany: {
          data: mergedTags.map((tag) => ({ tag })),
          skipDuplicates: true,
        },
      },
    },
    select: {
      id: true,
      title: true,
      cluster: true,
      status: true,
      createdAt: true,
    },
  })

  return jsonOk({ problem, classification }, { status: 201 })
}
