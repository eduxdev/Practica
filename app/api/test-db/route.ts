import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Probando conexión a Supabase...')
    
    // Probar conexión básica
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, correo')
      .limit(5)

    if (error) {
      console.error('❌ Error de conexión:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    console.log('✅ Conexión exitosa, usuarios encontrados:', users?.length)

    return NextResponse.json({
      success: true,
      message: 'Conexión a Supabase exitosa',
      users: users?.map(u => ({ id: u.id, correo: u.correo })),
      count: users?.length || 0
    })

  } catch (error) {
    console.error('💥 Error inesperado:', error)
    return NextResponse.json({
      success: false,
      error: 'Error inesperado',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
