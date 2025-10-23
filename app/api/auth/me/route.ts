import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    // Obtener usuario desde el JWT en la cookie
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    // Retornar datos del usuario
    return NextResponse.json(
      { 
        user: {
          id: user.userId,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
