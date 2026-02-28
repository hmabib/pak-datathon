import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

async function assertTeamMember(teamId: string, userId: string) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  })

  return Boolean(membership)
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const { teamId } = await context.params
  const isMember = await assertTeamMember(teamId, user.id)
  if (!isMember) return jsonError('Accès réservé aux membres.', 403)

  const messages = await prisma.teamMessage.findMany({
    where: { teamId },
    orderBy: { createdAt: 'desc' },
    take: 80,
  })

  const senderIds = Array.from(new Set(messages.map((message) => message.senderId)))
  const users = await prisma.user.findMany({
    where: { id: { in: senderIds } },
    select: { id: true, name: true, email: true },
  })
  const senders = new Map(users.map((item) => [item.id, item]))

  return jsonOk({
    messages: messages.map((message) => ({
      ...message,
      sender: senders.get(message.senderId) || null,
    })),
  })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const { teamId } = await context.params
  const isMember = await assertTeamMember(teamId, user.id)
  if (!isMember) return jsonError('Accès réservé aux membres.', 403)

  const body = (await request.json()) as { content?: string }
  const content = body.content?.trim() || ''

  if (content.length < 2) return jsonError('Message trop court.', 400)

  const message = await prisma.teamMessage.create({
    data: {
      teamId,
      senderId: user.id,
      content,
      type: 'text',
    },
  })

  return jsonOk({ message }, { status: 201 })
}
