'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { PenTool, Upload, Download, Key, Loader2, FileCheck, CheckCircle, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useKeys } from '@/contexts/KeysContext'

interface KeyPair {
  publicKey: string
  privateKey: string
  warning?: string
}

interface SignatureResult {
  message: string
  signatureInfo: {
    signer: string
    timestamp: string
    hash: string
    signature: string
    publicKey: string
  }
  certificateInfo: {
    issuer: string
    subject: string
    validFrom: string
    validTo: string
  }
  keyPair?: KeyPair
}

export function PDFSigner() {
  const { currentKeys } = useKeys()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [signerName, setSignerName] = useState('')
  const [useExistingKeys, setUseExistingKeys] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null)

  // Auto-llenar datos cuando hay claves guardadas
  useEffect(() => {
    if (currentKeys) {
      setSignerName(currentKeys.userName)
      setPrivateKey(currentKeys.privateKey)
      setPublicKey(currentKeys.publicKey)
      setUseExistingKeys(true)
    }
  }, [currentKeys])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setSignatureResult(null)
    } else {
      toast.error('Por favor selecciona un archivo PDF válido')
    }
  }

  const handleSign = async () => {
    if (!selectedFile || !signerName.trim()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (useExistingKeys && (!privateKey.trim() || !publicKey.trim())) {
      toast.error('Por favor proporciona las claves públicas y privadas')
      return
    }

    setIsSigning(true)

    try {
      const formData = new FormData()
      formData.append('pdf', selectedFile)
      formData.append('signerName', signerName)
      formData.append('useExistingKeys', useExistingKeys.toString())
      
      if (useExistingKeys) {
        formData.append('privateKey', privateKey)
        formData.append('publicKey', publicKey)
      }

      const response = await fetch('/api/pdf/sign', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errorData.error || 'Error al firmar PDF')
      }

      const result: SignatureResult = await response.json()
      setSignatureResult(result)

      // Obtener el PDF firmado del header
      const pdfData = response.headers.get('X-PDF-Data')
      if (pdfData) {
        const pdfBuffer = Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))
        const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedFile.name.replace('.pdf', '')}_firmado.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      // Generar y descargar archivo de verificación de firma
      const signatureVerificationData = {
        documentName: selectedFile.name,
        signedAt: new Date().toISOString(),
        signatureInfo: result.signatureInfo,
        certificateInfo: result.certificateInfo,
        instructions: {
          howToVerify: "Copia este JSON completo en la sección 'Verificar Firma Digital'",
          warning: "Este archivo contiene la información necesaria para verificar la autenticidad del documento firmado"
        }
      }

      const verificationBlob = new Blob([JSON.stringify(signatureVerificationData, null, 2)], { 
        type: 'application/json' 
      })
      const verificationUrl = window.URL.createObjectURL(verificationBlob)
      const verificationLink = document.createElement('a')
      verificationLink.href = verificationUrl
      verificationLink.download = `${selectedFile.name.replace('.pdf', '')}_verificacion_firma.json`
      document.body.appendChild(verificationLink)
      verificationLink.click()
      window.URL.revokeObjectURL(verificationUrl)
      document.body.removeChild(verificationLink)

      toast.success('PDF firmado exitosamente. Se descargaron el PDF firmado y el archivo de verificación.')

    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al firmar el PDF')
    } finally {
      setIsSigning(false)
    }
  }

  const downloadKeys = () => {
    if (!signatureResult?.keyPair) return

    const keysData = {
      signer: signerName,
      generatedAt: new Date().toISOString(),
      publicKey: signatureResult.keyPair.publicKey,
      privateKey: signatureResult.keyPair.privateKey,
      warning: 'MANTÉN LA CLAVE PRIVADA SEGURA Y NUNCA LA COMPARTAS'
    }

    const blob = new Blob([JSON.stringify(keysData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `claves_${signerName.replace(/[^a-zA-Z0-9]/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.success('Claves descargadas. ¡Guárdalas de forma segura!')
  }

  return (
    <div className="space-y-6">
      {/* Estado de Claves Automáticas */}
      {currentKeys && (
        <div className="border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
            <h3 className="font-medium text-green-800 dark:text-green-400">Claves Cargadas Automáticamente</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/80 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-800 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Key className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Firmante: {currentKeys.userName}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Las claves se han cargado automáticamente. Solo necesitas seleccionar el PDF y firmar.</span>
              </div>
            </div>
            
            
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Firmar Documento PDF
          </CardTitle>
          <CardDescription>
            Añade tu firma digital a un documento PDF para garantizar su autenticidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">Seleccionar Archivo PDF</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isSigning}
            />
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileCheck className="h-4 w-4" />
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signer-name">Nombre del Firmante</Label>
            <Input
              id="signer-name"
              placeholder="Tu nombre completo"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              disabled={isSigning}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-existing-keys"
              checked={useExistingKeys}
              onCheckedChange={(checked) => setUseExistingKeys(checked as boolean)}
              disabled={isSigning}
            />
            <Label htmlFor="use-existing-keys">
              Usar claves existentes (si ya tienes un par de claves)
            </Label>
          </div>

          {useExistingKeys && (
            <div className="space-y-4 p-3 border rounded-lg bg-muted/30 dark:bg-muted">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="private-key" className="flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-primary" />
                      <span>Clave Privada</span>
                    </Label>
                    <Badge variant="outline" className="text-xs font-normal">Privada</Badge>
                  </div>
                  <Textarea
                    id="private-key"
                    placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    disabled={isSigning}
                    className="font-mono text-xs h-24 resize-none bg-background dark:bg-background/80"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-key" className="flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-primary" />
                      <span>Clave Pública</span>
                    </Label>
                    <Badge variant="outline" className="text-xs font-normal">Pública</Badge>
                  </div>
                  <Textarea
                    id="public-key"
                    placeholder="-----BEGIN PUBLIC KEY-----..."
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    disabled={isSigning}
                    className="font-mono text-xs h-24 resize-none bg-background dark:bg-background/80"
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSign} 
            disabled={isSigning || !selectedFile || !signerName.trim()}
            className="w-full"
          >
            {isSigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Firmando PDF...
              </>
            ) : (
              <>
                <PenTool className="mr-2 h-4 w-4" />
                Firmar PDF
              </>
            )}
          </Button>

          {!currentKeys && !useExistingKeys && (
            <div className="flex items-start gap-2 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-md">
              <div className="mt-0.5">
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-400">
                <span className="font-medium">Importante:</span> Se generarán nuevas claves criptográficas. Guárdalas de forma segura para futuras firmas.
              </div>
            </div>
          )}

          {!currentKeys && (
            <div className="flex items-start gap-2 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-md">
              <div className="mt-0.5">
                <Key className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                <span className="font-medium">Consejo:</span> Puedes generar o importar claves en la sección "Gestión de Claves" para que se apliquen automáticamente aquí.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {signatureResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <FileCheck className="h-5 w-5" />
              Firma Digital Completada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Firmante</Label>
                <p className="text-sm">{signatureResult.signatureInfo.signer}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Fecha y Hora</Label>
                <p className="text-sm">
                  {new Date(signatureResult.signatureInfo.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Hash SHA-256</span>
                  </Label>
                  <Badge variant="outline" className="text-xs font-normal">Integridad</Badge>
                </div>
                <div className="text-xs font-mono bg-muted/50 dark:bg-muted p-2 rounded-md break-all h-16 overflow-y-auto border border-border/50">
                  {signatureResult.signatureInfo.hash}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <PenTool className="h-3.5 w-3.5 text-primary" />
                    <span>Firma Digital</span>
                  </Label>
                  <Badge variant="outline" className="text-xs font-normal">Autenticidad</Badge>
                </div>
                <div className="text-xs font-mono bg-muted/50 dark:bg-muted p-2 rounded-md break-all h-16 overflow-y-auto border border-border/50">
                  {signatureResult.signatureInfo.signature.substring(0, 100)}...
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Archivos Descargados</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white/80 dark:bg-blue-900/30 p-2.5 rounded-md border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">PDF Firmado</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 truncate">
                    {selectedFile?.name.replace('.pdf', '')}_firmado.pdf
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-blue-900/30 p-2.5 rounded-md border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">Datos de Verificación</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 truncate">
                    {selectedFile?.name.replace('.pdf', '')}_verificacion_firma.json
                  </p>
                </div>
              </div>
              <div className="mt-3 p-2.5 bg-blue-100/80 dark:bg-blue-900/50 rounded-md text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <div className="mt-0.5">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <strong>Para verificar la firma:</strong> Ve a la sección "Verificar Firma Digital" y carga el archivo JSON de verificación.
                </div>
              </div>
            </div>

            {signatureResult.keyPair && (
              <div className="border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  <Label className="text-sm font-medium text-amber-800 dark:text-amber-500">Nuevas Claves Generadas</Label>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    ¡Importante!
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/80 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                      Se han generado nuevas claves criptográficas para tu firma digital
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      {signatureResult.keyPair.warning}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={downloadKeys} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600 dark:text-white"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Claves
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PDFSigner
