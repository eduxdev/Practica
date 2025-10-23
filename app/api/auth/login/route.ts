import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { generateJWT, setJWTCookie } from '@/lib/jwt'

// Función para verificar reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY no configurada')
    return false
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { correo, password, recaptchaToken } = await request.json()

    // Verificar reCAPTCHA si está presente
    if (recaptchaToken) {
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { error: 'Verificación reCAPTCHA fallida' },
          { status: 400 }
        )
      }
    }

    // Validaciones básicas
    if (!correo || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('correo', correo)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar JWT token
    const jwtPayload = {
      userId: user.id,
      email: user.correo,
      name: user.nombre || user.correo
    }
    
    const token = await generateJWT(jwtPayload)
    
    // Crear respuesta con cookie HttpOnly
    const response = NextResponse.json(
      { 
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          email: user.correo,
          name: user.nombre || user.correo
        }
      },
      { status: 200 }
    )
    
    // Establecer cookie HttpOnly y Secure
    return setJWTCookie(response, token)

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
