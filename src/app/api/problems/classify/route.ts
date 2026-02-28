import { NextRequest } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'
import { classifyProblemText } from '@/lib/problem-intelligence'

export async function POST(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) return jsonError('Non authentifié', 401)

  const body = (await request.json()) as { text?: string }
  const text = body.text?.trim() || ''

  if (text.length < 20) {
    return jsonError('Décrivez le problème avec au moins 20 caractères.', 400)
  }

  const result = classifyProblemText(text)
  return jsonOk({ classification: result })
}
