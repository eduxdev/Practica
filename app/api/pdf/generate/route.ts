import { NextRequest, NextResponse } from 'next/server'
import { createSamplePDF } from '@/lib/pdf-signature'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Generar PDF
    const pdfBuffer = await createSamplePDF(content, title)

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error generando PDF:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al generar PDF' },
      { status: 500 }
    )
  }
}
