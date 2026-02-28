import { Role, type User } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'pak-datathon-secret'

export interface JWTPayload {
  userId: string
  email: string
  role: Role
}

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'onboardingStep'>

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return req.cookies.get(AUTH_COOKIE_NAME)?.value || null
}

export async function getAuthUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      onboardingStep: true,
    },
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      onboardingStep: true,
    },
  })
}

export function canAccessRole(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole)
}

export const authCookieConfig = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}
