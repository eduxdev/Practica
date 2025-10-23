import { NextRequest, NextResponse } from 'next/server'
import { signPDF, generateUserKeyPair } from '@/lib/pdf-signature'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File
    const signerName = formData.get('signerName') as string
    const useExistingKeys = formData.get('useExistingKeys') === 'true'
    const existingPrivateKey = formData.get('privateKey') as string
    const existingPublicKey = formData.get('publicKey') as string

    if (!pdfFile || !signerName) {
      return NextResponse.json(
        { error: 'Archivo PDF y nombre del firmante son requeridos' },
        { status: 400 }
      )
    }

    // Convertir archivo a buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())

    let privateKey: string
    let publicKey: string

    if (useExistingKeys && existingPrivateKey && existingPublicKey) {
      // Usar claves existentes
      privateKey = existingPrivateKey
      publicKey = existingPublicKey
    } else {
      // Generar nuevas claves
      const keyPair = generateUserKeyPair(signerName)
      privateKey = keyPair.privateKey
      publicKey = keyPair.publicKey
    }

    // Firmar el PDF
    const signatureResult = await signPDF(pdfBuffer, signerName, privateKey, publicKey)

    // Retornar información de la firma y las claves (si son nuevas)
    const response = {
      message: 'PDF firmado exitosamente',
      signatureInfo: signatureResult.signatureInfo,
      certificateInfo: signatureResult.certificateInfo,
      ...((!useExistingKeys || !existingPrivateKey) && {
        keyPair: {
          publicKey,
          privateKey,
          warning: 'IMPORTANTE: Guarda estas claves de forma segura. La clave privada no se almacenará en el servidor.'
        }
      })
    }

    // Configurar headers para descargar el PDF firmado
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('X-PDF-Data', Buffer.from(signatureResult.signedPdfBuffer).toString('base64'))

    return NextResponse.json(response, { 
      status: 200,
      headers 
    })

  } catch (error) {
    console.error('Error firmando PDF:', error)
    
    // Proporcionar más detalles del error para debugging
    const errorMessage = error instanceof Error 
      ? `Error al firmar PDF: ${error.message}` 
      : 'Error interno del servidor al firmar PDF'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
