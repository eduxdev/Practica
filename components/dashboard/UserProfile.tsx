'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Hash, Shield, Key } from 'lucide-react'

interface User {
  id: number
  nombre: string
  apellidos: string
  correo: string
  edad: number
  createdAt: string
}

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
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

  return (
    <div className="space-y-6">
      {/* Perfil del Firmante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-base">
                {getInitials(user.nombre, user.apellidos)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {user.nombre} {user.apellidos}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.correo}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Información de Firma Digital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Sistema de Firma Digital
          </CardTitle>
          <CardDescription>
            Tecnologías criptográficas utilizadas en tu firma digital
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">Cifrado RSA</h4>
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Algoritmo: RSA-2048 bits</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Tipo: Asimétrico (clave pública/privada)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Seguridad: Alta (resistente a factorización)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-300">Hash SHA-256</h4>
              </div>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span>Tamaño: 256 bits (32 bytes)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span>Función: Integridad del documento</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span>Estándar: FIPS 180-4</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-300">Firma Digital</h4>
              </div>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500 dark:text-purple-400">•</span>
                  <span>Proceso: Hash + Cifrado RSA</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500 dark:text-purple-400">•</span>
                  <span>Autenticidad: Verificable</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500 dark:text-purple-400">•</span>
                  <span>No repudio: Garantizado</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-md">
            <div className="mt-0.5">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-2">
                Buenas Prácticas de Seguridad
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Nunca compartas tu clave privada con nadie</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Guarda tus claves en un lugar seguro y realiza copias de seguridad</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Verifica siempre las firmas antes de confiar en un documento</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">•</span>
                  <span>Renueva tus claves periódicamente para mayor seguridad</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Firma Digital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Acciones de Firma Digital
          </CardTitle>
          <CardDescription>
            Gestiona tus herramientas de firma digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:border-primary/40">
              <Key className="h-6 w-6 text-primary" />
              <span className="text-sm">Generar Nuevas Claves</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:border-primary/40">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm">Verificar Certificado</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-primary/20 hover:border-primary/40">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-sm">Historial de Firmas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
