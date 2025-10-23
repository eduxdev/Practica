'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import PDFGenerator from '@/components/pdf/PDFGenerator'
import PDFSigner from '@/components/pdf/PDFSigner'
import PDFVerifier from '@/components/pdf/PDFVerifier'
import KeyManager from '@/components/pdf/KeyManager'
import { UserProfile } from '@/components/dashboard/UserProfile'
import { KeysProvider } from '@/contexts/KeysContext'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  nombre: string
  apellidos: string
  correo: string
  edad: number
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState('generate')
  const router = useRouter()

  useEffect(() => {
    // Obtener datos del usuario desde localStorage (temporal)
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/auth')
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Cargando...</h2>
        </div>
      </div>
    )
  }

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'generate':
        return <PDFGenerator />
      case 'sign':
        return <PDFSigner />
      case 'verify':
        return <PDFVerifier />
      case 'keys':
        return <KeyManager />
      case 'profile':
        return <UserProfile user={user!} />
      default:
        return <PDFGenerator />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'generate':
        return 'Generar Documento PDF'
      case 'sign':
        return 'Firmar Documento PDF'
      case 'verify':
        return 'Verificar Firma Digital'
      case 'keys':
        return 'Gestión de Claves RSA'
      case 'profile':
        return 'Perfil de Usuario'
      default:
        return 'Sistema de Firma Digital'
    }
  }

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'generate':
        return 'Crea documentos PDF que podrás firmar digitalmente'
      case 'sign':
        return 'Añade tu firma digital a documentos PDF para garantizar autenticidad'
      case 'verify':
        return 'Verifica la autenticidad e integridad de firmas digitales'
      case 'keys':
        return 'Administra tus claves criptográficas RSA para firma digital'
      case 'profile':
        return 'Información y configuración de tu cuenta'
      default:
        return 'Herramientas avanzadas de criptografía y firma digital'
    }
  }

  return (
    <KeysProvider>
      <SidebarProvider>
        <AppSidebar 
          user={user} 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">{getSectionTitle()}</h1>
              <p className="text-xs text-muted-foreground">{getSectionDescription()}</p>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KeysProvider>
  )
}