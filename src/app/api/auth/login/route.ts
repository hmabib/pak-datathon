import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authCookieConfig, signToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'
import { comparePassword } from '@/lib/password'
import { jsonError, jsonOk } from '@/lib/http'
import { isValidEmail } from '@/lib/validators'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string
    password?: string
  }

  const email = body.email?.trim().toLowerCase() || ''
  const password = body.password || ''

  if (!email || !password) {
    return jsonError('Email et mot de passe sont obligatoires.', 400)
  }

  if (!isValidEmail(email)) {
    return jsonError('Email invalide.', 400)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return jsonError('Identifiants invalides.', 401)
  }

  const isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) {
    return jsonError('Identifiants invalides.', 401)
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role })

  const response = jsonOk({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboardingStep: user.onboardingStep,
    },
  })
  response.cookies.set(AUTH_COOKIE_NAME, token, authCookieConfig)
  return response
}
