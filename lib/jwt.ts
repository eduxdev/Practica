import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno')
}

// Convertir la clave secreta a Uint8Array para jose
const secret = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

/**
 * Genera un token JWT firmado
 */
export async function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('login-app')
    .setAudience('login-app-users')
    .setExpirationTime('24h')
    .sign(secret)
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'login-app',
      audience: 'login-app-users'
    })
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      iat: payload.iat,
      exp: payload.exp
    }
  } catch (error) {
    console.error('Error verificando JWT:', error)
    return null
  }
}

/**
 * Establece una cookie HttpOnly y Secure con el JWT
 */
export function setJWTCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('auth-token', token, {
    httpOnly: true,      // No accesible desde JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict',  // Protección CSRF
    maxAge: 24 * 60 * 60, // 24 horas en segundos
    path: '/'            // Disponible en toda la app
  })
  
  return response
}

/**
 * Elimina la cookie de autenticación
 */
export function clearJWTCookie(response: NextResponse): NextResponse {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expira inmediatamente
    path: '/'
  })
  
  return response
}

/**
 * Obtiene el token JWT desde las cookies de la request
 */
export function getJWTFromRequest(request: NextRequest): string | null {
  return request.cookies.get('auth-token')?.value || null
}

/**
 * Verifica si el usuario está autenticado desde la request
 */
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = getJWTFromRequest(request)
  
  if (!token) {
    return null
  }
  
  return await verifyJWT(token)
}
