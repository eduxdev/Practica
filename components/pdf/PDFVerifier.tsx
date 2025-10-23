'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface VerificationResult {
  isValid: boolean
  message: string
  verificationDetails: {
    signer: string
    timestamp: string
    hash: string
    verifiedAt: string
  }
}

export function PDFVerifier() {
  const [signatureData, setSignatureData] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        // Verificar que sea un JSON válido y tenga la estructura correcta
        const parsedData = JSON.parse(content)
        
        // Verificar que tenga la estructura esperada
        if (parsedData.signatureInfo || (parsedData.signature && parsedData.publicKey)) {
          setSignatureData(content)
          toast.success('Archivo de verificación cargado exitosamente')
        } else {
          toast.error('El archivo no contiene datos de firma válidos. Usa el archivo JSON generado al firmar el documento.')
        }
      } catch (error) {
        toast.error('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.')
      }
    }
    reader.readAsText(file)
  }

  const handleVerify = async () => {
    if (!signatureData.trim()) {
      toast.error('Por favor ingresa los datos de la firma')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      // Intentar parsear los datos de la firma
      let signatureInfo
      try {
        signatureInfo = JSON.parse(signatureData)
      } catch {
        throw new Error('Formato de datos de firma inválido. Debe ser un JSON válido.')
      }

      // Verificar el formato del JSON y extraer signatureInfo
      let actualSignatureInfo
      
      // Si el JSON tiene la estructura completa (con documentName, signedAt, etc.)
      if (signatureInfo.signatureInfo) {
        actualSignatureInfo = signatureInfo.signatureInfo
      } 
      // Si el JSON es directamente la signatureInfo
      else if (signatureInfo.signature && signatureInfo.publicKey && signatureInfo.signer) {
        actualSignatureInfo = signatureInfo
      } 
      else {
        throw new Error('Datos de firma incompletos. Asegúrate de usar el archivo JSON generado al firmar el documento.')
      }

      // Verificar que tenga los campos necesarios
      if (!actualSignatureInfo.signature || !actualSignatureInfo.publicKey || !actualSignatureInfo.signer) {
        throw new Error('Datos de firma incompletos')
      }

      const response = await fetch('/api/pdf/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signatureInfo: actualSignatureInfo })
      })

      if (!response.ok) {
        throw new Error('Error al verificar la firma')
      }

      const result: VerificationResult = await response.json()
      setVerificationResult(result)

      if (result.isValid) {
        toast.success('Firma verificada exitosamente')
      } else {
        toast.error('La firma no es válida')
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al verificar la firma'
      toast.error(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  const sampleSignatureFormat = {
    documentName: "documento.pdf",
    signedAt: "2024-01-15T10:30:00.000Z",
    signatureInfo: {
      signer: "Juan Pérez",
      timestamp: "2024-01-15T10:30:00.000Z",
      hash: "a1b2c3d4e5f6...",
      signature: "eyJhbGciOiJSUzI1NiIs...",
      publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0B..."
    },
    certificateInfo: {
      issuer: "AgroIA Certificate Authority",
      subject: "CN=Juan Pérez"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verificar Firma Digital
          </CardTitle>
          <CardDescription>
            Verifica la autenticidad e integridad de una firma digital de PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signature-file">Cargar Archivo de Verificación (JSON)</Label>
            <Input
              id="signature-file"
              type="file"
              accept=".json"
              onChange={handleFileLoad}
              disabled={isVerifying}
            />
          </div>

          <div className="text-center text-muted-foreground">
            <span>- O -</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature-data">Pegar Datos de la Firma (JSON)</Label>
            <Textarea
              id="signature-data"
              placeholder={`Pega aquí los datos de la firma en formato JSON:\n\n${JSON.stringify(sampleSignatureFormat, null, 2)}`}
              className="min-h-[200px] font-mono text-xs"
              value={signatureData}
              onChange={(e) => setSignatureData(e.target.value)}
              disabled={isVerifying}
            />
          </div>

          <Button 
            onClick={handleVerify} 
            disabled={isVerifying || !signatureData.trim()}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando Firma...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verificar Firma
              </>
            )}
          </Button>

          <div className="flex items-start gap-3 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-md">
            <div className="mt-0.5">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1.5">
                Cómo obtener los datos de firma:
              </div>
              <ul className="space-y-1.5 text-xs text-blue-600 dark:text-blue-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Al firmar un PDF se descargan 2 archivos: el PDF firmado y un archivo JSON de verificación</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Usa el botón "Cargar Archivo" para subir el archivo JSON de verificación</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>O copia y pega el contenido del archivo JSON en el área de texto</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>El archivo JSON contiene toda la información necesaria para verificar la firma</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {verificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              verificationResult.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {verificationResult.isValid ? (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Firma Válida
                </>
              ) : (
                <>
                  <ShieldX className="h-5 w-5" />
                  Firma Inválida
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              verificationResult.isValid 
                ? 'bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900' 
                : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900'
            }`}>
              <div>
                {verificationResult.isValid ? (
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-600 dark:text-red-500" />
                )}
              </div>
              <p className={`font-medium ${
                verificationResult.isValid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
              }`}>
                {verificationResult.message}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/40 dark:bg-muted/20 p-3 rounded-md border border-border/50">
                <Label className="text-sm font-medium flex items-center gap-1.5 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Firmante</span>
                </Label>
                <p className="text-sm font-medium">{verificationResult.verificationDetails.signer}</p>
              </div>
              <div className="bg-muted/40 dark:bg-muted/20 p-3 rounded-md border border-border/50">
                <Label className="text-sm font-medium flex items-center gap-1.5 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Fecha de Firma</span>
                </Label>
                <p className="text-sm font-medium">
                  {new Date(verificationResult.verificationDetails.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className="bg-muted/40 dark:bg-muted/20 p-3 rounded-md border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Hash SHA-256</span>
                </Label>
                <Badge variant="outline" className="text-xs font-normal">Integridad</Badge>
              </div>
              <div className="text-xs font-mono bg-background/80 dark:bg-background/40 p-2 rounded-md break-all h-16 overflow-y-auto border border-border/50">
                {verificationResult.verificationDetails.hash}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/40 dark:bg-muted/20 p-3 rounded-md border border-border/50">
                <Label className="text-sm font-medium flex items-center gap-1.5 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Verificado el</span>
                </Label>
                <p className="text-sm font-medium">
                  {new Date(verificationResult.verificationDetails.verifiedAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-4 rounded-lg border ${
              verificationResult.isValid 
                ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900 text-green-800 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
            }`}>
              <div className="mt-0.5">
                {verificationResult.isValid ? (
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {verificationResult.isValid 
                    ? "Esta firma es auténtica y el documento no ha sido modificado" 
                    : "Esta firma no es válida o el documento ha sido alterado"
                  }
                </p>
                <div className="mt-3">
                  <Badge 
                    variant={verificationResult.isValid ? "default" : "destructive"} 
                    className={`px-3 py-1 ${verificationResult.isValid 
                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600' 
                      : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                    }`}
                  >
                    {verificationResult.isValid ? "VERIFICADO" : "NO VERIFICADO"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PDFVerifier
