import { NextRequest, NextResponse } from 'next/server'
import { verifyPDFSignature, SignatureInfo } from '@/lib/pdf-signature'

export async function POST(request: NextRequest) {
  try {
    const { signatureInfo }: { signatureInfo: SignatureInfo } = await request.json()

    if (!signatureInfo || !signatureInfo.signature || !signatureInfo.publicKey) {
      return NextResponse.json(
        { error: 'Información de firma incompleta' },
        { status: 400 }
      )
    }

    // Verificar la firma
    const isValid = verifyPDFSignature(signatureInfo)

    const response = {
      isValid,
      message: isValid 
        ? 'La firma digital es válida y auténtica' 
        : 'La firma digital no es válida o ha sido alterada',
      verificationDetails: {
        signer: signatureInfo.signer,
        timestamp: signatureInfo.timestamp,
        hash: signatureInfo.hash,
        verifiedAt: new Date().toISOString()
      }
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Error verificando firma:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al verificar firma' },
      { status: 500 }
    )
  }
}
