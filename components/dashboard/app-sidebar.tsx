'use client'

import { LogOut } from 'lucide-react'
import { 
  FileTextIcon, 
  DrawingPinIcon, 
  LockClosedIcon, 
  Component1Icon, 
  PersonIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useKeys } from '@/contexts/KeysContext'

interface User {
  id: number
  nombre: string
  apellidos: string
  correo: string
  edad: number
  createdAt: string
}

interface AppSidebarProps {
  user: User
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function AppSidebar({ user, activeSection = 'generate', onSectionChange }: AppSidebarProps) {
  const { currentKeys } = useKeys()
  const router = useRouter()

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    toast.success('Sesión cerrada exitosamente')
    router.push('/auth')
  }

  const menuItems = [
    {
      id: 'generate',
      title: 'Generar PDF',
      icon: FileTextIcon,
      description: 'Crear documentos PDF'
    },
    {
      id: 'sign',
      title: 'Firmar PDF',
      icon: DrawingPinIcon,
      description: 'Añadir firma digital'
    },
    {
      id: 'verify',
      title: 'Verificar Firma',
      icon: LockClosedIcon,
      description: 'Validar autenticidad'
    },
    {
      id: 'keys',
      title: 'Gestión de Claves',
      icon: Component1Icon,
      description: 'Administrar claves RSA'
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3.5 px-4 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground border-2 border-primary/20 dark:border-primary/40">
            <LockClosedIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">AgroIA</span>
            <span className="text-xs text-muted-foreground mt-0.5">Sistema de Firma Digital</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground/80">
            Herramientas de Firma Digital
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 py-1.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id} className="px-1">
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange?.(item.id)}
                    variant={activeSection === item.id ? "outline" : "default"}
                    className="relative w-full"
                  >
                    {activeSection === item.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-primary rounded-r-full" />
                    )}
                    <div className={`flex items-center justify-center h-8 w-8 rounded-md mr-3 ${
                      activeSection === item.id 
                        ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30' 
                        : 'bg-background dark:bg-background/80 border border-border/40 dark:border-border/20'
                    }`}>
                      <item.icon className={`h-4 w-4 ${activeSection === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <div className="flex items-center gap-2 w-full">
                        <span className={`text-sm font-medium ${activeSection === item.id ? 'text-primary' : ''}`}>
                          {item.title}
                        </span>
                        {item.id === 'keys' && currentKeys && (
                          <div className="flex items-center justify-center px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/70">
                            <CheckCircledIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-4 py-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3.5 bg-muted/30 dark:bg-muted/20 rounded-lg p-2.5 border border-border/40 dark:border-border/20">
            <Avatar className="h-9 w-9 border border-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {getInitials(user.nombre, user.apellidos)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.nombre} {user.apellidos}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.correo}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-background/80 border-muted-foreground/30 dark:border-muted-foreground/20"
              onClick={() => onSectionChange?.('profile')}
            >
              <PersonIcon className="h-4 w-4 mr-1.5" />
              Perfil
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-background/80 border-muted-foreground/30 dark:border-muted-foreground/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Salir
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}