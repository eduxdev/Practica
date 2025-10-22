import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .min(1, 'El correo es obligatorio'),
  codigo: z
    .string()
    .min(4, 'El código debe tener al menos 4 dígitos')
    .max(6, 'El código debe tener máximo 6 dígitos')
    .regex(/^[0-9]+$/, 'El código solo puede contener números'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos con Zod
    const validation = resetPasswordSchema.safeParse(body)
    
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

    const { correo, codigo, password } = validation.data

    // Buscar el código de recuperación válido
    const { data: resetRecord, error: resetError } = await supabaseAdmin
      .from('password_resets')
      .select('*')
      .eq('correo', correo)
      .eq('codigo', codigo)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (resetError) {
      console.error('Error buscando código de reset:', resetError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (!resetRecord) {
      return NextResponse.json(
        { 
          error: 'Código inválido o expirado',
          errors: { codigo: 'El código es inválido o ha expirado' }
        },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, correo')
      .eq('id', resetRecord.user_id)
      .maybeSingle()

    if (userError || !user) {
      console.error('Error buscando usuario:', userError)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Actualizar la contraseña del usuario
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      )
    }

    // Marcar el código como usado
    const { error: markUsedError } = await supabaseAdmin
      .from('password_resets')
      .update({ 
        used: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', resetRecord.id)

    if (markUsedError) {
      console.error('Error marcando código como usado:', markUsedError)
      // No es crítico, la contraseña ya se cambió
    }

    // Opcional: Invalidar todos los códigos de reset pendientes para este usuario
    await supabaseAdmin
      .from('password_resets')
      .update({ 
        used: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('used', false)

    return NextResponse.json(
      { 
        message: 'Contraseña restablecida exitosamente',
        user: {
          id: user.id,
          correo: user.correo
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en reset-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
