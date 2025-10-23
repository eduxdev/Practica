import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { calculateSHA256, signWithRSA, verifyRSASignature, generateRSAKeyPair } from './crypto'

export interface SignatureInfo {
  signer: string
  timestamp: string
  hash: string
  signature: string
  publicKey: string
}

export interface PDFSignatureResult {
  signedPdfBuffer: Buffer
  signatureInfo: SignatureInfo
  certificateInfo: {
    issuer: string
    subject: string
    validFrom: string
    validTo: string
  }
}

// Crear un PDF de ejemplo para firmar
export async function createSamplePDF(content: string, title: string = 'Documento AgroIA'): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Header
  page.drawText(title, {
    x: 50,
    y: 750,
    size: 20,
    font: boldFont,
    color: rgb(0.2, 0.4, 0.8)
  })
  
  // Fecha
  const now = new Date()
  page.drawText(`Fecha: ${now.toLocaleDateString('es-ES')}`, {
    x: 50,
    y: 720,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3)
  })
  
  // Contenido
  const lines = content.split('\n')
  let yPosition = 680
  
  for (const line of lines) {
    if (yPosition < 100) break // Evitar que el texto se salga de la página
    
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 11,
      font: font,
      color: rgb(0, 0, 0)
    })
    yPosition -= 20
  }
  
  // Footer
  page.drawText('Documento generado por AgroIA - Sistema de Firma Digital', {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  })
  
  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

// Firmar un PDF digitalmente
export async function signPDF(
  pdfBuffer: Buffer,
  signerName: string,
  privateKeyPem: string,
  publicKeyPem: string
): Promise<PDFSignatureResult> {
  // Calcular hash del PDF original
  const originalHash = calculateSHA256(pdfBuffer)
  
  // Crear información de la firma
  const timestamp = new Date().toISOString()
  const signatureData = `${originalHash}|${signerName}|${timestamp}`
  
  // Firmar con RSA
  const signature = signWithRSA(signatureData, privateKeyPem)
  
  // Cargar el PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer)
  
  // Agregar página de firma
  const signaturePage = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Título de la página de firma
  signaturePage.drawText('FIRMA DIGITAL', {
    x: 200,
    y: 750,
    size: 24,
    font: boldFont,
    color: rgb(0.8, 0.2, 0.2)
  })
  
  // Información de la firma
  signaturePage.drawText('Este documento ha sido firmado digitalmente', {
    x: 50,
    y: 700,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  
  signaturePage.drawText(`Firmado por: ${signerName}`, {
    x: 50,
    y: 670,
    size: 12,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  const dateStr = new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19)
  signaturePage.drawText(`Fecha y hora: ${dateStr}`, {
    x: 50,
    y: 650,
    size: 12,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  // Hash SHA-256 (con salto de línea si es necesario)
  let currentY = 630
  
  signaturePage.drawText('Hash SHA-256:', {
    x: 50,
    y: currentY,
    size: 10,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  })
  
  // Dividir el hash en líneas si es muy largo
  const hashCharsPerLine = 64
  let hashLinesCount = 1
  
  if (originalHash.length > hashCharsPerLine) {
    const hashLines = []
    for (let i = 0; i < originalHash.length; i += hashCharsPerLine) {
      hashLines.push(originalHash.substring(i, i + hashCharsPerLine))
    }
    hashLinesCount = hashLines.length
    
    hashLines.forEach((line, index) => {
      signaturePage.drawText(line, {
        x: 60,
        y: currentY - 15 - (index * 12),
        size: 9,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      })
    })
  } else {
    signaturePage.drawText(originalHash, {
      x: 60,
      y: currentY - 15,
      size: 9,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    })
  }
  
  // Actualizar posición Y después del hash
  currentY = currentY - 15 - (hashLinesCount * 12) - 20
  
  // Firma digital (completa en múltiples líneas)
  signaturePage.drawText('Firma digital:', {
    x: 50,
    y: currentY,
    size: 10,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3)
  })
  
  // Dividir la firma en líneas de 80 caracteres
  const charsPerLine = 80
  const signatureLines = []
  for (let i = 0; i < signature.length; i += charsPerLine) {
    signatureLines.push(signature.substring(i, i + charsPerLine))
  }
  
  // Dibujar cada línea de la firma
  signatureLines.forEach((line, index) => {
    signaturePage.drawText(line, {
      x: 60,
      y: currentY - 15 - (index * 12), // 12 puntos entre líneas
      size: 8,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    })
  })
  
  // Ajustar la posición Y para el siguiente contenido basado en el número de líneas
  const nextYPosition = currentY - 15 - (signatureLines.length * 12) - 20
  
  // Advertencia de seguridad (posición dinámica)
  signaturePage.drawText('IMPORTANTE:', {
    x: 50,
    y: nextYPosition,
    size: 12,
    font: boldFont,
    color: rgb(0.8, 0.4, 0)
  })
  
  signaturePage.drawText('- No modifique este documento despues de la firma', {
    x: 70,
    y: nextYPosition - 20,
    size: 10,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  signaturePage.drawText('- Cualquier modificacion invalidara la firma digital', {
    x: 70,
    y: nextYPosition - 40,
    size: 10,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  signaturePage.drawText('- Verifique la firma usando la clave publica correspondiente', {
    x: 70,
    y: nextYPosition - 60,
    size: 10,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  // Verificación
  signaturePage.drawText('VERIFICACION:', {
    x: 50,
    y: nextYPosition - 100,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.6, 0.2)
  })
  
  signaturePage.drawText('Para verificar esta firma, use el sistema de verificación de AgroIA', {
    x: 50,
    y: nextYPosition - 120,
    size: 10,
    font: font,
    color: rgb(0, 0, 0)
  })
  
  // Guardar PDF firmado
  const signedPdfBytes = await pdfDoc.save()
  const signedPdfBuffer = Buffer.from(signedPdfBytes)
  
  const signatureInfo: SignatureInfo = {
    signer: signerName,
    timestamp,
    hash: originalHash,
    signature,
    publicKey: publicKeyPem
  }
  
  const certificateInfo = {
    issuer: 'AgroIA Certificate Authority',
    subject: `CN=${signerName}`,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }
  
  return {
    signedPdfBuffer,
    signatureInfo,
    certificateInfo
  }
}

// Verificar la firma de un PDF
export function verifyPDFSignature(signatureInfo: SignatureInfo): boolean {
  const signatureData = `${signatureInfo.hash}|${signatureInfo.signer}|${signatureInfo.timestamp}`
  return verifyRSASignature(signatureData, signatureInfo.signature, signatureInfo.publicKey)
}

// Generar par de claves para un usuario
export function generateUserKeyPair(userName: string) {
  const keyPair = generateRSAKeyPair()
  
  return {
    userName,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    generated: new Date().toISOString()
  }
}
