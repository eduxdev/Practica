'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Key, Download, Upload, RefreshCw, Copy, Eye, EyeOff, AlertTriangle, Trash2, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { generateRSAKeyPair } from '@/lib/crypto'
import { useKeys } from '@/contexts/KeysContext'

interface KeyPair {
  userName: string
  publicKey: string
  privateKey: string
  generated: string
}

export function KeyManager() {
  const { currentKeys, setCurrentKeys, clearKeys } = useKeys()
  const [userName, setUserName] = useState('')
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateKeys = () => {
    if (!userName.trim()) {
      toast.error('Por favor ingresa tu nombre')
      return
    }

    setIsGenerating(true)

    try {
      const newKeyPair = generateRSAKeyPair()
      const keyData: KeyPair = {
        userName: userName.trim(),
        publicKey: newKeyPair.publicKey,
        privateKey: newKeyPair.privateKey,
        generated: new Date().toISOString()
      }

      setKeyPair(keyData)
      setCurrentKeys(keyData) // Guardar en el contexto global
      toast.success('Par de claves generado exitosamente')

    } catch (error) {
      console.error('Error generando claves:', error)
      toast.error('Error al generar las claves')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadKeys = () => {
    if (!keyPair) return

    const keysData = {
      ...keyPair,
      warning: 'MANTÉN LA CLAVE PRIVADA SEGURA Y NUNCA LA COMPARTAS',
      instructions: {
        publicKey: 'Puedes compartir esta clave para que otros verifiquen tus firmas',
        privateKey: 'NUNCA compartas esta clave. Úsala solo para firmar documentos'
      }
    }

    const blob = new Blob([JSON.stringify(keysData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `claves_${keyPair.userName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.success('Claves descargadas exitosamente')
  }

  const handleImportKeys = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        if (!importedData.publicKey || !importedData.privateKey || !importedData.userName) {
          throw new Error('Archivo de claves inválido')
        }

        setCurrentKeys(importedData) // Guardar en el contexto global
        toast.success('Claves importadas exitosamente y guardadas para uso automático')

      } catch (error) {
        console.error('Error importando claves:', error)
        toast.error('Error al importar las claves. Verifica el formato del archivo.')
      }
    }

    reader.readAsText(file)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copiada al portapapeles`)
    }).catch(() => {
      toast.error('Error al copiar al portapapeles')
    })
  }

  const truncateKey = (key: string, length: number = 50) => {
    if (key.length <= length) return key
    return key.substring(0, length) + '...'
  }

  return (
    <div className="space-y-6">
      {/* Claves Actuales Guardadas */}
      {currentKeys && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Key className="h-5 w-5" />
              Claves Activas
            </CardTitle>
            <CardDescription>
              Estas claves se usarán automáticamente al firmar documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Propietario</Label>
                <p className="text-sm">{currentKeys.userName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Generado el</Label>
                <p className="text-sm">
                  {new Date(currentKeys.generated).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <h4 className="font-semibold text-green-800 dark:text-green-400">Claves Listas para Usar</h4>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    clearKeys()
                    toast.success('Claves eliminadas del sistema')
                  }}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Estas claves se aplicarán automáticamente cuando firmes un PDF. 
                No necesitas volver a importarlas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generar Nuevas Claves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Generar Nuevas Claves RSA
          </CardTitle>
          <CardDescription>
            Crea un nuevo par de claves criptográficas para firmar documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Nombre del Propietario</Label>
            <Input
              id="user-name"
              placeholder="Tu nombre completo"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <Button 
            onClick={handleGenerateKeys} 
            disabled={isGenerating || !userName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generando Claves...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Generar Par de Claves RSA-2048
              </>
            )}
          </Button>

          <div className="flex items-start gap-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 p-3.5 rounded-md">
            <div className="mt-0.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1.5">
                Importante sobre la Seguridad
              </div>
              <ul className="space-y-1.5 text-xs text-amber-600 dark:text-amber-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Las claves se generan localmente en tu navegador</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>La clave privada NUNCA se envía al servidor</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Guarda las claves en un lugar seguro</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Si pierdes la clave privada, no podrás firmar documentos</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claves Generadas */}
      {keyPair && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Key className="h-5 w-5" />
              Claves Generadas
            </CardTitle>
            <CardDescription>
              Par de claves RSA-2048 generado para {keyPair.userName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Propietario</Label>
                <p className="text-sm">{keyPair.userName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Generado el</Label>
                <p className="text-sm">
                  {new Date(keyPair.generated).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Clave Pública</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(keyPair.publicKey, 'Clave pública')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  value={keyPair.publicKey}
                  readOnly
                  className="font-mono text-xs h-20"
                />
                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 mt-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Segura para compartir - Otros pueden usarla para verificar tus firmas</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Clave Privada</Label>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                    >
                      {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(keyPair.privateKey, 'Clave privada')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={showPrivateKey ? keyPair.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  readOnly
                  className="font-mono text-xs h-20"
                />
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>CONFIDENCIAL - Nunca compartas esta clave con nadie</span>
                </div>
              </div>
            </div>

            <Button onClick={handleDownloadKeys} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Descargar Claves (JSON)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Importar Claves */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Claves Existentes
          </CardTitle>
          <CardDescription>
            Carga un archivo de claves previamente generado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-keys">Archivo de Claves (JSON)</Label>
            <Input
              id="import-keys"
              type="file"
              accept=".json"
              onChange={handleImportKeys}
            />
          </div>

          <div className="flex items-start gap-3 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-md">
            <div className="mt-0.5">
              <Upload className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              <span className="font-medium">Formato esperado:</span> Archivo JSON con las claves generadas por esta aplicación
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default KeyManager
