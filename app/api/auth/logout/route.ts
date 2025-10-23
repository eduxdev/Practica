import { NextRequest, NextResponse } from 'next/server'
import { clearJWTCookie } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Crear respuesta de logout exitoso
    const response = NextResponse.json(
      { message: 'Logout exitoso' },
      { status: 200 }
    )
    
    // Eliminar la cookie de autenticación
    return clearJWTCookie(response)
    
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
