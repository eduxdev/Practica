Documentación del Componente LoginForm

Descripción General

El componente `LoginForm` es un formulario de inicio de sesión desarrollado en React con TypeScript que permite a los usuarios autenticarse en el sistema RaXiBot. Utiliza Next.js para la navegación y manejo de rutas, y está integrado con una API backend para la autenticación.

Ubicación del Archivo
```
components/auth/LoginForm.tsx
```

Características Principales

🔐 Funcionalidades de Autenticación
- **Validación de credenciales**: Email y contraseña requeridos
- **Integración con API**: Comunicación con endpoint `/api/auth/login`
- **Manejo de estados**: Loading, success y error states
- **Almacenamiento local**: Guarda datos del usuario en localStorage
- **Redirección automática**: Navega al dashboard tras login exitoso

🎨 Interfaz de Usuario
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **Componentes reutilizables**: Utiliza componentes UI personalizados
- **Feedback visual**: Spinner durante carga y notificaciones toast
- **Accesibilidad**: Labels apropiados y navegación por teclado

Dependencias

Librerías Externas
```typescript
import { useState } from 'react'           // Manejo de estado local
import { useRouter } from 'next/navigation' // Navegación en Next.js
import { toast } from "sonner"             // Notificaciones toast
```

Componentes Internos
```typescript
import { cn } from "@/lib/utils"                    // Utilidad para clases CSS
import { Button } from "@/components/ui/button"     // Botón personalizado
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field" // Campos de formulario
import { Input } from "@/components/ui/input"       // Input personalizado
import { Spinner } from "@/components/ui/spinner"   // Indicador de carga
```

Estructura del Componente

Props Interface
```typescript
interface LoginFormProps extends React.ComponentProps<"form"> {
  onToggleForm?: () => void  // Función opcional para alternar entre login/registro
}
```

Estados Locales
```typescript
const [email, setEmail] = useState('')         // Email del usuario
const [password, setPassword] = useState('')   // Contraseña del usuario
const [isLoading, setIsLoading] = useState(false) // Estado de carga
```

Flujo de Funcionamiento

1. Captura de Datos
- El usuario ingresa email y contraseña
- Los campos son validados como requeridos
- Se previene el envío con campos vacíos

2. Proceso de Autenticación
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Prevenir comportamiento por defecto
  e.preventDefault()
  
  // 2. Activar estado de carga
  setIsLoading(true)
  
  // 3. Realizar petición HTTP POST
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      correo: email,
      password: password
    })
  })
  
  // 4. Procesar respuesta
  // 5. Manejar éxito o error
}
```

3. Manejo de Respuestas

Éxito 
- Guarda datos del usuario en `localStorage`
- Muestra notificación de éxito con `toast.success`
- Redirige al dashboard usando `router.push('/dashboard')`

Error 
- Captura y muestra errores específicos
- Notificación de error con `toast.error`
- Mantiene al usuario en el formulario

Estructura del Formulario

Campos de Entrada
1. **Email**
   - Tipo: `email`
   - Placeholder: `m@example.com`
   - Validación: Requerido
   - Deshabilitado durante carga

2. **Contraseña**
   - Tipo: `password`
   - Validación: Requerido
   - Enlace "¿Olvidaste tu contraseña?"
   - Deshabilitado durante carga

Botón de Envío
- Estado normal: "Iniciar sesión"
- Estado de carga: Spinner + "Iniciando sesión..."
- Deshabilitado durante el proceso

Enlace de Registro
- Texto: "¿No tienes una cuenta? Crear cuenta"
- Funcionalidad condicional:
  - Si `onToggleForm` existe: botón para alternar formularios
  - Si no: enlace estático

API Integration

Endpoint
```
POST /api/auth/login
```

Request Body
```json
{
  "correo": "usuario@email.com",
  "password": "contraseña123"
}
```

Response Success
```json
{
  "user": {
    "id": "user_id",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  }
}
```

Response Error
```json
{
  "error": "Mensaje de error específico"
}
```

Manejo de Estados

Loading State
- Deshabilitación de campos de entrada
- Deshabilitación del botón de envío
- Mostrar spinner y texto de carga
- Prevenir múltiples envíos

Success State
- Notificación toast verde
- Almacenamiento en localStorage
- Redirección automática
- Reset del estado de carga

Error State
- Notificación toast roja
- Mensaje de error específico
- Mantener datos del formulario
- Reset del estado de carga

Estilos y Diseño

Clases CSS Principales
```typescript
className={cn("flex flex-col gap-6", className)}
```

Estructura Visual
- **Header**: Título y descripción centrados
- **Campos**: Espaciado vertical de 6 unidades
- **Botón**: Ancho completo, estado visual dinámico
- **Footer**: Enlace de registro centrado

Casos de Uso

1. Login Exitoso
```
Usuario ingresa credenciales válidas
→ Formulario se envía
→ API responde con éxito
→ Usuario se almacena en localStorage
→ Redirección a /dashboard
→ Notificación de bienvenida
```

2. Credenciales Inválidas
```
Usuario ingresa credenciales incorrectas
→ Formulario se envía
→ API responde con error
→ Notificación de error
→ Usuario permanece en formulario
```

3. Error de Conexión
```
Usuario intenta login sin conexión
→ Formulario se envía
→ Falla la petición HTTP
→ Notificación de error genérico
→ Usuario puede reintentar
```

Consideraciones de Seguridad

✅ Implementadas
- Validación de campos requeridos
- Deshabilitación durante carga
- Manejo seguro de errores
- No exposición de contraseñas en logs

⚠️ Recomendaciones Adicionales
- Implementar rate limiting
- Agregar CAPTCHA para múltiples intentos
- Validación de formato de email más robusta
- Encriptación de datos en localStorage
- Implementar tokens JWT para autenticación

Testing

Casos de Prueba Sugeridos
1. **Envío con campos vacíos**
2. **Envío con email inválido**
3. **Login exitoso con credenciales válidas**
4. **Login fallido con credenciales inválidas**
5. **Manejo de errores de red**
6. **Funcionalidad del botón "Crear cuenta"**
7. **Estados de carga y deshabilitación**

Mantenimiento y Mejoras

Posibles Mejoras
- [ ] Implementar validación en tiempo real
- [ ] Agregar opción "Recordarme"
- [ ] Implementar autenticación con redes sociales
- [ ] Mejorar accesibilidad (ARIA labels)
- [ ] Agregar animaciones de transición
- [ ] Implementar modo offline

Refactoring Sugerido
- Extraer lógica de API a custom hook
- Crear contexto de autenticación global
- Implementar esquemas de validación con Zod
- Separar constantes y configuraciones

Conclusión

El componente `LoginForm` proporciona una solución completa y robusta para la autenticación de usuarios en el sistema RaXiBot. Su diseño modular, manejo de estados eficiente y integración con la API lo convierten en una pieza fundamental del sistema de autenticación de la aplicación.
