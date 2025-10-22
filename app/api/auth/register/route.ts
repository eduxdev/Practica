import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { validateServerRegisterForm } from '@/lib/validations/register'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos con Zod (excluyendo confirmPassword para el servidor)
    const { confirmPassword, ...dataToValidate } = body
    const validation = validateServerRegisterForm(dataToValidate)
    
    if (!validation.success) {
      // Devolver todos los errores de validación
      return NextResponse.json(
        { 
          error: 'Datos de registro inválidos',
          errors: validation.errors || {},
          message: 'Por favor corrige los errores en el formulario'
        },
        { status: 400 }
      )
    }

    const { nombre, apellidos, correo, telefono, password } = validation.data!

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('correo', correo)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear el usuario
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .insert({
        nombre,
        apellidos,
        correo,
        telefono,
        password: hashedPassword,
      })
      .select('id, nombre, apellidos, correo, telefono, created_at')

    if (error) {
      console.error('Error creando usuario:', error)
      return NextResponse.json(
        { error: 'Error al crear el usuario' },
        { status: 500 }
      )
    }

    const user = users?.[0]

    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
