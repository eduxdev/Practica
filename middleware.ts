import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/jwt'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard']

// Rutas que solo pueden acceder usuarios no autenticados
const authRoutes = ['/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar si el usuario está autenticado
  const user = await getUserFromRequest(request)
  const isAuthenticated = !!user
  
  // Si está en una ruta protegida y no está autenticado
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirigir al login
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  // Si está en rutas de auth y ya está autenticado
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirigir al dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Permitir el acceso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
