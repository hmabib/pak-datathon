import { NextRequest } from 'next/server'
import { OnboardingStep } from '@prisma/client'
import prisma from '@/lib/prisma'
import { computeOnboardingScore } from '@/lib/onboarding'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { validateActorType, validateCluster, validateDataLevel } from '@/lib/validators'

export async function POST(request: NextRequest) {
  const currentUser = await getAuthUserFromRequest(request)
  if (!currentUser) {
    return jsonError('Non authentifié', 401)
  }

  const body = (await request.json()) as {
    actorType?: string
    dataLevel?: string
    domaineExpertise?: string
    organisation?: string
    poste?: string
    yearsExperience?: number
    disponibilite?: string
    interetClusters?: string[]
    skills?: string[]
    environmentAware?: boolean
    socialCommit?: boolean
    governanceAccept?: boolean
    dataCharterAccepted?: boolean
    ethicsAccepted?: boolean
    confidentialityAccepted?: boolean
  }

  const actorType = body.actorType || ''
  const dataLevel = body.dataLevel || ''
  const interetClusters = (body.interetClusters || []).filter((value): value is string => Boolean(value))
  const skills = (body.skills || []).map((skill) => skill.trim()).filter(Boolean)
  const yearsExperience = Number(body.yearsExperience || 0)

  if (!validateActorType(actorType)) {
    return jsonError('Type d’acteur invalide.', 400)
  }

  if (!validateDataLevel(dataLevel)) {
    return jsonError('Niveau data invalide.', 400)
  }

  if (!interetClusters.length || !interetClusters.every((cluster) => validateCluster(cluster))) {
    return jsonError('Au moins un cluster valide est requis.', 400)
  }

  const score = computeOnboardingScore({
    dataLevel,
    skillsCount: skills.length,
    yearsExperience,
    clusterCount: interetClusters.length,
  })

  await prisma.$transaction(async (tx) => {
    await tx.userProfile.upsert({
      where: { userId: currentUser.id },
      update: {
        actorType,
        dataLevel,
        domaineExpertise: body.domaineExpertise?.trim() || null,
        organisation: body.organisation?.trim() || null,
        poste: body.poste?.trim() || null,
        experienceLogistique: yearsExperience,
        disponibilite: body.disponibilite?.trim() || null,
        interetClusters,
      },
      create: {
        userId: currentUser.id,
        actorType,
        dataLevel,
        domaineExpertise: body.domaineExpertise?.trim() || null,
        organisation: body.organisation?.trim() || null,
        poste: body.poste?.trim() || null,
        experienceLogistique: yearsExperience,
        disponibilite: body.disponibilite?.trim() || null,
        interetClusters,
      },
    })

    await tx.userSkill.deleteMany({ where: { userId: currentUser.id } })
    if (skills.length) {
      await tx.userSkill.createMany({
        data: skills.map((name) => ({
          userId: currentUser.id,
          name,
          level: 3,
        })),
        skipDuplicates: true,
      })
    }

    await tx.onboardingScore.upsert({
      where: { userId: currentUser.id },
      update: {
        ...score,
        suggestedTeams: interetClusters.map((cluster) => `Team ${cluster}`),
        suggestedProblems: ['Fluidification portuaire', 'Réduction des coûts de transit'],
        suggestedDatasets: ['Flux navires', 'Performance douanière'],
      },
      create: {
        userId: currentUser.id,
        ...score,
        suggestedTeams: interetClusters.map((cluster) => `Team ${cluster}`),
        suggestedProblems: ['Fluidification portuaire', 'Réduction des coûts de transit'],
        suggestedDatasets: ['Flux navires', 'Performance douanière'],
      },
    })

    await tx.rseCommitment.upsert({
      where: { userId: currentUser.id },
      update: {
        environmentAware: Boolean(body.environmentAware),
        socialCommit: Boolean(body.socialCommit),
        governanceAccept: Boolean(body.governanceAccept),
      },
      create: {
        userId: currentUser.id,
        environmentAware: Boolean(body.environmentAware),
        socialCommit: Boolean(body.socialCommit),
        governanceAccept: Boolean(body.governanceAccept),
      },
    })

    await tx.governanceAcceptance.upsert({
      where: { userId: currentUser.id },
      update: {
        dataCharterAccepted: body.dataCharterAccepted ?? true,
        ethicsAccepted: body.ethicsAccepted ?? true,
        confidentialityAccepted: body.confidentialityAccepted ?? true,
      },
      create: {
        userId: currentUser.id,
        dataCharterAccepted: body.dataCharterAccepted ?? true,
        ethicsAccepted: body.ethicsAccepted ?? true,
        confidentialityAccepted: body.confidentialityAccepted ?? true,
      },
    })

    await tx.user.update({
      where: { id: currentUser.id },
      data: {
        onboardingStep: OnboardingStep.DASHBOARD_ACTIF,
      },
    })

    await tx.notification.create({
      data: {
        userId: currentUser.id,
        title: 'Onboarding terminé',
        message: 'Votre dashboard est actif. Vous pouvez commencer à contribuer.',
        type: 'success',
      },
    })
  })

  return jsonOk({ success: true })
}
