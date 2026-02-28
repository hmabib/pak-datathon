import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const { teamId } = await context.params
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      _count: { select: { members: true } },
      members: { where: { userId: user.id }, select: { id: true } },
    },
  })

  if (!team) return jsonError('Équipe introuvable.', 404)
  if (!team.isOpen) return jsonError('Équipe fermée.', 409)
  if (team.members.length) return jsonError('Vous êtes déjà membre.', 409)
  if (team._count.members >= team.maxMembers) return jsonError('Équipe complète.', 409)

  await prisma.teamMember.create({
    data: {
      teamId,
      userId: user.id,
      role: 'member',
    },
  })

  await prisma.teamMessage.create({
    data: {
      teamId,
      senderId: user.id,
      content: `${user.name} a rejoint l’équipe.`,
      type: 'system',
    },
  })

  return jsonOk({ success: true })
}
