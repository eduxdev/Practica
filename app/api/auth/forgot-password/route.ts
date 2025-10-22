import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .min(1, 'El correo es obligatorio')
})

// Función para generar código aleatorio de 6 dígitos
function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Función para enmascarar el número de teléfono
function maskPhoneNumber(telefono: string): string {
  if (telefono.length !== 10) return telefono
  return `***-***-${telefono.slice(-4)}`
}

// Simulación de envío de SMS (en producción usarías Twilio, AWS SNS, etc.)
async function sendSMS(telefono: string, codigo: string): Promise<boolean> {
  // TODO: Implementar servicio real de SMS
  // Por ahora solo simulamos el envío
  console.log(`📱 SMS enviado a ${telefono}: Tu código de recuperación es: ${codigo}`)
  
  // Simular delay de envío
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos con Zod
    const validation = forgotPasswordSchema.safeParse(body)
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          errors: fieldErrors
        },
        { status: 400 }
      )
    }

    const { correo } = validation.data

    // Buscar usuario por correo
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, correo, telefono')
      .eq('correo', correo)
      .maybeSingle()

    if (userError) {
      console.error('Error buscando usuario:', userError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No existe una cuenta con este correo electrónico' },
        { status: 404 }
      )
    }

    if (!user.telefono) {
      return NextResponse.json(
        { error: 'Esta cuenta no tiene un número de teléfono asociado' },
        { status: 400 }
      )
    }

    // Generar código de recuperación
    const resetCode = generateResetCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    // Guardar código en la base de datos (necesitaremos crear una tabla para esto)
    // Por ahora lo guardamos en memoria temporal (en producción usar Redis o BD)
    
    // Crear o actualizar registro de recuperación
    const { error: resetError } = await supabaseAdmin
      .from('password_resets')
      .upsert({
        user_id: user.id,
        correo: user.correo,
        codigo: resetCode,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (resetError) {
      console.error('Error guardando código de reset:', resetError)
      
      // Si la tabla no existe, intentar crearla
      if (resetError.message.includes('relation "password_resets" does not exist')) {
        return NextResponse.json(
          { error: 'Sistema de recuperación no configurado. Contacta al administrador.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Error al generar código de recuperación' },
        { status: 500 }
      )
    }

    // Enviar SMS
    try {
      await sendSMS(user.telefono, resetCode)
    } catch (smsError) {
      console.error('Error enviando SMS:', smsError)
      return NextResponse.json(
        { error: 'Error al enviar SMS. Intenta nuevamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Código de recuperación enviado',
        telefono: maskPhoneNumber(user.telefono)
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
