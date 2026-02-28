import { NextRequest, NextResponse } from 'next/server'
import { Role, SimulationStatus, SimulationType } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

function isSimulationType(value: string): value is SimulationType {
  return Object.values(SimulationType).includes(value as SimulationType)
}

function buildSimulationOutput(type: SimulationType, inputs: Record<string, number>) {
  const baselineFlow = Number(inputs.baselineFlow || 100)
  const congestionRate = Number(inputs.congestionRate || 0.2)
  const incidentRate = Number(inputs.incidentRate || 0.08)

  const predictedDelay = Math.round((baselineFlow * congestionRate + baselineFlow * incidentRate * 0.6) * 10) / 10
  const throughputDelta = Math.round((1 - congestionRate * 0.8) * 100)
  const efficiencyScore = Math.max(25, Math.round(90 - congestionRate * 120 - incidentRate * 95))

  const labelMap: Record<SimulationType, string> = {
    CONGESTION: 'Simulation de congestion',
    FLUX_COMMERCE: 'Projection flux commerce',
    IMPORT_EXPORT_STRESS: 'Stress test import/export',
    TRAFIC_CAMIONS: 'Simulation trafic camions',
    CAPACITE_TERMINAL: 'Simulation capacité terminal',
  }

  return {
    summary: `${labelMap[type]}: délai projeté ${predictedDelay}h, throughput ${throughputDelta}% de la baseline.`,
    metrics: {
      predictedDelayHours: predictedDelay,
      throughputPercent: throughputDelta,
      efficiencyScore,
    },
    assumptions: inputs,
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const scope = request.nextUrl.searchParams.get('scope')
  const canReadAll = scope === 'all' && (user.role === Role.ADMIN || user.role === Role.MODERATOR)

  const simulations = await prisma.simulation.findMany({
    where: canReadAll ? undefined : { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      problem: { select: { id: true, title: true, cluster: true } },
      team: { select: { id: true, name: true, cluster: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  })

  return jsonOk({ simulations })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const body = (await request.json()) as {
    type?: string
    title?: string
    assumptions?: string
    inputs?: Record<string, number>
    problemId?: string
    teamId?: string
  }

  const type = body.type || ''
  const title = body.title?.trim() || ''
  const inputs = body.inputs || {}

  if (!isSimulationType(type)) return jsonError('Type de simulation invalide.', 400)
  if (!title) return jsonError('Titre requis.', 400)

  const output = buildSimulationOutput(type, inputs)

  const simulation = await prisma.simulation.create({
    data: {
      userId: user.id,
      type,
      title,
      assumptions: body.assumptions?.trim() || null,
      inputs,
      outputs: output,
      resultSummary: output.summary,
      problemId: body.problemId || null,
      teamId: body.teamId || null,
      status: SimulationStatus.TERMINEE,
    },
  })

  return jsonOk({ simulation }, { status: 201 })
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
