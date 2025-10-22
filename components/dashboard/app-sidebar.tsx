'use client'

import * as React from 'react'
import {
  MessageSquare,
  LayoutDashboard,
  Cloud,
  Sprout,
  Droplet,
  Wheat,
  Package,
  RefreshCw,
  MessageSquarePlus,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  SidebarRail,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: number
  nombre: string
  apellidos: string
  correo: string
  edad: number
  createdAt: string
}

const dashboardNav = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard',
  },
  {
    title: 'Chat',
    icon: MessageSquare,
    url: '/dashboard/chat',
  },
]

const gestionAgricolaNav = [
  {
    title: 'Clima',
    icon: Cloud,
    url: '/dashboard/clima',
  },
  {
    title: 'Abono',
    icon: Sprout,
    url: '/dashboard/abono',
  },
  {
    title: 'Riego',
    icon: Droplet,
    url: '/dashboard/riego',
  },
  {
    title: 'Siembra',
    icon: Wheat,
    url: '/dashboard/siembra',
  },
  {
    title: 'Cosecha',
    icon: Package,
    url: '/dashboard/cosecha',
  },
  {
    title: 'Resiembra',
    icon: RefreshCw,
    url: '/dashboard/resiembra',
  },
]

export function AppSidebar({ user, ...props }: { user: User | null } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    toast.success('Sesión cerrada correctamente')
    router.push('/')
  }

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Wheat className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">RaXiBot</span>
                <span className="text-xs text-muted-foreground">v0.0.1</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Botón Nuevo Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => router.push('/dashboard/chat')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  <MessageSquarePlus className="size-4" />
                  <span>Nuevo chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestión Agrícola Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase">Gestión Agrícola</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gestionAgricolaNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              {user && (
                <>
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {getInitials(user.nombre, user.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Admin RaXiBot
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.correo}
                    </span>
                  </div>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Iconos de acción en el footer */}
          <SidebarMenuItem>
            <div className="flex items-center justify-around px-2 py-1">
              <SidebarMenuButton size="sm" tooltip="Notificaciones">
                <Bell className="size-4" />
              </SidebarMenuButton>
              <SidebarMenuButton size="sm" tooltip="Configuración">
                <Settings className="size-4" />
              </SidebarMenuButton>
              <SidebarMenuButton size="sm" tooltip="Cerrar Sesión" onClick={handleLogout}>
                <LogOut className="size-4" />
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
