import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import twilio from 'twilio'

const forgotPasswordSchema = z.object({
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .min(1, 'El correo es obligatorio')
    .toLowerCase()
    .trim()
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

// Configurar cliente de Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Función para enviar SMS usando Twilio
async function sendSMS(telefono: string, codigo: string): Promise<boolean> {
  try {
    // Validar que las credenciales de Twilio estén configuradas
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error('Credenciales de Twilio no configuradas')
      throw new Error('Servicio SMS no configurado')
    }

    // Enviar SMS usando Twilio
    const message = await twilioClient.messages.create({
      body: `Tu código de recuperación es: ${codigo}. Válido por 15 minutos.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+52${telefono}` // +52 es el código de país para México
    })

    console.log(`✅ SMS enviado exitosamente. SID: ${message.sid}`)
    return true

  } catch (error) {
    console.error('Error enviando SMS con Twilio:', error)
    
    // Si estamos en desarrollo y Twilio falla, usar simulación
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 [SIMULACIÓN] SMS a ${telefono}: Tu código de recuperación es: ${codigo}`)
      return true
    }
    
    throw error
  }
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

    // Primero, invalidar códigos anteriores del usuario
    await supabaseAdmin
      .from('password_resets')
      .update({ used: true })
      .eq('user_id', user.id)
      .eq('used', false)

    // Crear nuevo registro de recuperación
    const { error: resetError } = await supabaseAdmin
      .from('password_resets')
      .insert({
        user_id: user.id,
        correo: user.correo,
        codigo: resetCode,
        expires_at: expiresAt.toISOString(),
        used: false
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
