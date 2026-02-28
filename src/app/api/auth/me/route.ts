import { NextRequest } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { jsonError, jsonOk } from '@/lib/http'

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user) {
    return jsonError('Non authentifié', 401)
  }

  return jsonOk({ user })
}
