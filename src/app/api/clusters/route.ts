import { NextRequest } from 'next/server'
import { ClusterType } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { clusterDescriptions, getDefaultDatasetsForCluster } from '@/lib/problem-clusters'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const clusters = await prisma.clusterCatalog.findMany({
    orderBy: { code: 'asc' },
  })

  if (clusters.length) {
    return jsonOk({ clusters })
  }

  const entries = Object.entries(clusterDescriptions) as Array<
    [ClusterType, (typeof clusterDescriptions)[ClusterType]]
  >

  const fallback = entries.map(([code, data]) => ({
    code,
    title: data.title,
    description: data.overview,
    defaultDatasets: getDefaultDatasetsForCluster(code),
  }))

  return jsonOk({ clusters: fallback })
}
