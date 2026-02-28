import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants'

const protectedPaths = ['/dashboard', '/onboarding', '/admin']

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const pathname = request.nextUrl.pathname

  const needsAuth = protectedPaths.some((path) => pathname.startsWith(path))
  if (needsAuth && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAuthPage = pathname.startsWith('/auth/')
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/onboarding/:path*', '/auth/:path*'],
}
