import { DataLevel } from '@prisma/client'

type ScoreInput = {
  dataLevel: DataLevel
  skillsCount: number
  yearsExperience: number
  clusterCount: number
}

export function computeOnboardingScore(input: ScoreInput) {
  const levelWeight: Record<DataLevel, number> = {
    DEBUTANT: 0.35,
    INTERMEDIAIRE: 0.55,
    AVANCE: 0.75,
    EXPERT: 0.9,
  }

  const compatibility = Math.min(100, Math.round((input.clusterCount * 18 + input.skillsCount * 8) * 1.2))
  const readiness = Math.min(100, Math.round(levelWeight[input.dataLevel] * 100 + input.yearsExperience * 2))
  const teamFit = Math.min(100, Math.round((input.skillsCount * 9 + input.clusterCount * 14) * 0.9))

  return {
    compatibilityScore: compatibility,
    dataReadiness: readiness,
    teamFitScore: teamFit,
  }
}
