import { NextRequest } from 'next/server'
import { Role } from '@prisma/client'
import prisma from '@/lib/prisma'
import { authCookieConfig, signToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'
import { hashPassword } from '@/lib/password'
import { jsonError, jsonOk } from '@/lib/http'
import { isValidEmail } from '@/lib/validators'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string
    email?: string
    password?: string
  }

  const name = body.name?.trim() || ''
  const email = body.email?.trim().toLowerCase() || ''
  const password = body.password || ''

  if (!name || !email || !password) {
    return jsonError('Nom, email et mot de passe sont obligatoires.', 400)
  }

  if (!isValidEmail(email)) {
    return jsonError('Email invalide.', 400)
  }

  if (password.length < 8) {
    return jsonError('Le mot de passe doit contenir au moins 8 caractères.', 400)
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return jsonError('Un compte existe déjà avec cet email.', 409)
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: Role.USER,
      notifications: {
        create: {
          title: 'Bienvenue sur PAK DataThon Platform',
          message: 'Commencez votre onboarding pour activer votre dashboard.',
          type: 'success',
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      onboardingStep: true,
    },
  })

  const token = signToken({ userId: user.id, email: user.email, role: user.role })

  const response = jsonOk({ user }, { status: 201 })
  response.cookies.set(AUTH_COOKIE_NAME, token, authCookieConfig)
  return response
}
