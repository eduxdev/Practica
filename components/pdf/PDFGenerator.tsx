'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function PDFGenerator() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      })

      if (!response.ok) {
        throw new Error('Error al generar PDF')
      }

      // Descargar el PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF generado y descargado exitosamente')
      
      // Limpiar formulario
      setTitle('')
      setContent('')

    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al generar el PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generar Documento PDF
        </CardTitle>
        <CardDescription>
          Crea un documento PDF que podrás firmar digitalmente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Documento</Label>
          <Input
            id="title"
            placeholder="Ej: Contrato de Arrendamiento Agrícola"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenido del Documento</Label>
          <Textarea
            id="content"
            placeholder="Escribe el contenido de tu documento aquí..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !title.trim() || !content.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generar y Descargar PDF
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <strong>Consejo:</strong> Una vez generado el PDF, podrás subirlo en la sección {'"'}Firmar PDF{'"'} para añadir tu firma digital.
        </div>
      </CardContent>
    </Card>
  )
}

export default PDFGenerator
