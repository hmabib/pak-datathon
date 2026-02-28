import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'

function buildLogoutResponse() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return response
}

export async function POST() {
  return buildLogoutResponse()
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url))
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return response
}
