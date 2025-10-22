'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
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

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              ¡Bienvenido, {user.nombre}!
            </h2>
            <p className="text-gray-600 mt-1">
              Panel de control de tu cuenta
            </p>
          </div>

          {/* User Profile Card */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.nombre, user.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {user.nombre} {user.apellidos}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.correo}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Edad
                    </p>
                    <p className="text-lg font-semibold">{user.edad} años</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ID de Usuario
                    </p>
                    <Badge variant="secondary">#{user.id}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Miembro desde
                  </p>
                  <p className="text-lg font-semibold">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>
                  Información de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <p className="text-sm text-muted-foreground">
                    Cuenta Verificada
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <p className="text-sm text-muted-foreground">
                    Sesiones Activas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-2">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Gestiona tu cuenta y configuración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <div className="text-xl">👤</div>
                  <span>Editar Perfil</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <div className="text-xl">🔒</div>
                  <span>Cambiar Contraseña</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <div className="text-xl">⚙</div>
                  <span>Configuración</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}