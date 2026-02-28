import { ClusterType } from '@prisma/client'
import { clusterProblemTypes, getDefaultDatasetsForCluster } from '@/lib/problem-clusters'

const clusterKeywords: Record<ClusterType, string[]> = {
  OPERATIONNEL: ['attente', 'congestion', 'quai', 'rotation', 'retard', 'throughput', 'saturation'],
  DOCUMENTAIRE: ['document', 'manifeste', 'validation', 'conformité', 'dossier', 'traçabilité'],
  SYSTEMES_IT: ['api', 'système', 'erp', 'interfaçage', 'latence', 'données', 'intégration'],
  LOGISTIQUE_TRANSPORT: ['camion', 'transport', 'créneau', 'dernier kilomètre', 'flotte', 'route'],
  REGLEMENTAIRE: ['réglementaire', 'contrôle', 'douane', 'norme', 'inspection', 'autorisation'],
  FINANCIER: ['coût', 'marge', 'budget', 'facturation', 'encaissement', 'tarif'],
  INFRASTRUCTURE: ['capacité', 'équipement', 'maintenance', 'infrastructure', 'panne'],
  COORDINATION: ['coordination', 'acteur', 'gouvernance', 'pilotage', 'synchronisation', 'arbitrage'],
}

export type ClassificationResult = {
  cluster: ClusterType
  score: number
  keywords: string[]
  suggestedDatasets: string[]
  similarProblemTypes: string[]
  maturityScore: number
}

export function classifyProblemText(text: string): ClassificationResult {
  const normalized = text.toLowerCase()
  const clusterScores = Object.entries(clusterKeywords).map(([cluster, keywords]) => {
    const hits = keywords.filter((keyword) => normalized.includes(keyword))
    return { cluster: cluster as ClusterType, hits }
  })

  const bestMatch = clusterScores.sort((a, b) => b.hits.length - a.hits.length)[0]
  const cluster = bestMatch.hits.length ? bestMatch.cluster : 'COORDINATION'

  const relatedTypes = clusterProblemTypes
    .filter((item) => item.cluster === cluster)
    .sort((a, b) => b.analyticalComplexity - a.analyticalComplexity)
    .slice(0, 3)

  const baseComplexity = relatedTypes.length
    ? relatedTypes.reduce((sum, item) => sum + item.analyticalComplexity, 0) / relatedTypes.length
    : 3
  const maturityScore = Math.max(20, Math.min(95, Math.round(45 + bestMatch.hits.length * 8 + (5 - baseComplexity) * 6)))

  return {
    cluster,
    score: Math.min(100, Math.round(bestMatch.hits.length * 18 + 32)),
    keywords: bestMatch.hits,
    suggestedDatasets: getDefaultDatasetsForCluster(cluster),
    similarProblemTypes: relatedTypes.map((item) => item.type),
    maturityScore,
  }
}
