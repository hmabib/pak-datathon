import { NextRequest } from 'next/server'
import { ClusterType, Role } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { clusterDescriptions, getDefaultDatasetsForCluster } from '@/lib/problem-clusters'

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)
  if (user.role !== Role.ADMIN && user.role !== Role.MODERATOR) return jsonError('Accès interdit', 403)

  const entries = Object.entries(clusterDescriptions) as Array<
    [ClusterType, (typeof clusterDescriptions)[ClusterType]]
  >

  const values = entries.map(([code, content]) => ({
    code,
    title: content.title,
    description: content.overview,
    operationalStakes: 'Fluidité logistique et réduction des délais de cycle.',
    economicStakes: 'Amélioration de la compétitivité et maîtrise des coûts globaux.',
    technologyStakes: 'Interopérabilité, exploitation Big Data et automatisation pilotée.',
    resilienceStakes: 'Continuité des opérations et robustesse multi-acteurs.',
    defaultDatasets: getDefaultDatasetsForCluster(code),
    indicativeVolume: '1 à 20 millions de lignes selon cas d’usage',
    analyticalComplexity: 3,
  }))

  for (const item of values) {
    await prisma.clusterCatalog.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    })
  }

  return jsonOk({ seeded: values.length })
}
