# Documentación del Componente RegisterForm

## Descripción General

El componente `RegisterForm` es un formulario de registro de usuarios desarrollado en React con TypeScript que permite a los nuevos usuarios crear una cuenta en el sistema RaXiBot. Utiliza validación del lado cliente, integración con API backend y manejo avanzado de estados para proporcionar una experiencia de registro fluida y segura.

## Ubicación del Archivo
```
components/auth/RegisterForm.tsx
```

## Características Principales

### 🔐 Funcionalidades de Registro
- **Validación completa**: Nombre, apellidos, email, edad y contraseñas
- **Confirmación de contraseña**: Verificación de coincidencia en tiempo real
- **Validación de edad**: Rango válido entre 1 y 120 años
- **Integración con API**: Comunicación con endpoint `/api/auth/register`
- **Manejo de estados**: Loading, success y error states
- **Auto-redirección**: Cambia automáticamente al formulario de login tras registro exitoso

### 🎨 Interfaz de Usuario
- **Diseño responsivo**: Grid adaptativo para campos nombre/apellidos
- **Componentes reutilizables**: Utiliza sistema de componentes UI consistente
- **Feedback visual**: Spinner durante carga y notificaciones toast detalladas
- **Accesibilidad**: Labels apropiados, navegación por teclado y validación HTML5
- **UX optimizada**: Limpieza automática del formulario y transiciones suaves

## Dependencias

### Librerías Externas
```typescript
import { useState } from 'react'           // Manejo de estado local
import { toast } from "sonner"             // Notificaciones toast avanzadas
```

### Componentes Internos
```typescript
import { cn } from "@/lib/utils"                    // Utilidad para clases CSS
import { Button } from '@/components/ui/button'     // Botón personalizado
import { Input } from '@/components/ui/input'       // Input personalizado
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field" // Sistema de campos
import { Spinner } from "@/components/ui/spinner"   // Indicador de carga
```

## Estructura del Componente

### Props Interface
```typescript
interface RegisterFormProps extends React.ComponentProps<"form"> {
  onToggleForm?: () => void  // Función opcional para alternar entre registro/login
}
```

### Estados Locales
```typescript
const [formData, setFormData] = useState({
  nombre: '',           // Nombre del usuario
  apellidos: '',        // Apellidos del usuario
  correo: '',          // Email del usuario
  edad: '',            // Edad del usuario (string para input)
  password: '',        // Contraseña del usuario
  confirmPassword: ''  // Confirmación de contraseña
})
const [isLoading, setIsLoading] = useState(false) // Estado de carga
```

## Flujo de Funcionamiento

### 1. Captura de Datos
- El usuario completa todos los campos requeridos
- Manejo unificado de cambios con `handleChange`
- Validación HTML5 automática (required, email, minLength)
- Validación de rango para edad (1-120)

### 2. Validaciones del Cliente
```typescript
// Validación de coincidencia de contraseñas
if (formData.password !== formData.confirmPassword) {
  toast.error('Las contraseñas no coinciden')
  return
}

// Validación de rango de edad
if (parseInt(formData.edad) < 1 || parseInt(formData.edad) > 120) {
  toast.error('Por favor ingresa una edad válida')
  return
}
```

### 3. Proceso de Registro
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Prevenir comportamiento por defecto
  e.preventDefault()
  
  // 2. Activar estado de carga
  setIsLoading(true)
  
  // 3. Validaciones del cliente
  // ... validaciones
  
  // 4. Realizar petición HTTP POST
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      edad: formData.edad,
      password: formData.password
    })
  })
  
  // 5. Procesar respuesta y manejar estados
}
```

### 4. Manejo de Respuestas

#### Éxito ✅
- Muestra notificación de éxito con descripción detallada
- Limpia completamente el formulario
- Programa cambio automático al formulario de login (1.5s delay)
- Reset del estado de carga

#### Error ❌
- Captura errores específicos del servidor
- Notificación de error con descripción de ayuda
- Mantiene datos del formulario para corrección
- Reset del estado de carga

## Estructura del Formulario

### Campos de Entrada

1. **Nombre y Apellidos** (Grid 2 columnas)
   - Tipo: `text`
   - Placeholders: "Juan", "Pérez"
   - Validación: Requeridos
   - Layout: Grid responsivo

2. **Correo Electrónico**
   - Tipo: `email`
   - Placeholder: `tu@ejemplo.com`
   - Validación: Requerido + formato email

3. **Edad**
   - Tipo: `number`
   - Placeholder: `25`
   - Validación: Requerido, min=1, max=120
   - Rango: 1-120 años

4. **Contraseña**
   - Tipo: `password`
   - Validación: Requerido, minLength=6
   - Placeholder: `••••••••`

5. **Confirmar Contraseña**
   - Tipo: `password`
   - Validación: Requerido, minLength=6, coincidencia
   - Placeholder: `••••••••`

### Botón de Envío
- **Estado normal**: "Crear Cuenta"
- **Estado de carga**: Spinner + "Creando cuenta..."
- **Comportamiento**: Deshabilitado durante el proceso
- **Tipo**: `submit` para activar validación HTML5

### Enlace de Login
- **Texto**: "¿Ya tienes una cuenta? Iniciar sesión"
- **Funcionalidad condicional**:
  - Si `onToggleForm` existe: botón para alternar formularios
  - Si no: enlace estático de fallback

## API Integration

### Endpoint
```
POST /api/auth/register
```

### Request Body
```json
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "correo": "juan.perez@email.com",
  "edad": "25",
  "password": "contraseña123"
}
```

### Response Success
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "user_id",
    "nombre": "Juan",
    "apellidos": "Pérez",
    "correo": "juan.perez@email.com",
    "edad": 25
  }
}
```

### Response Error
```json
{
  "error": "El correo ya está registrado"
}
```

## Manejo de Estados

### Loading State
- **Campos**: Deshabilitados con `disabled={isLoading}`
- **Botón**: Deshabilitado y muestra spinner
- **Texto**: Cambia a "Creando cuenta..."
- **Prevención**: Evita múltiples envíos simultáneos

### Success State
- **Notificación**: Toast verde con título y descripción
- **Duración**: 4 segundos para lectura completa
- **Limpieza**: Reset completo del formulario
- **Transición**: Auto-cambio a login después de 1.5s
- **UX**: Feedback claro del éxito de la operación

### Error State
- **Notificación**: Toast rojo con mensaje específico
- **Descripción**: "Por favor intenta nuevamente"
- **Persistencia**: Mantiene datos del formulario
- **Recuperación**: Usuario puede corregir y reintentar

## Validaciones Implementadas

### Validación del Cliente
1. **Campos requeridos**: Todos los campos son obligatorios
2. **Formato de email**: Validación HTML5 automática
3. **Longitud de contraseña**: Mínimo 6 caracteres
4. **Coincidencia de contraseñas**: Verificación antes del envío
5. **Rango de edad**: Entre 1 y 120 años
6. **Tipo de datos**: Conversión y validación de edad como número

### Validación del Servidor
- Manejo de errores específicos del backend
- Verificación de duplicados (email existente)
- Validación adicional de formato y seguridad
- Respuestas estructuradas para mejor UX

## Estilos y Diseño

### Clases CSS Principales
```typescript
className={cn("flex flex-col gap-6", className)}
```

### Estructura Visual
- **Header**: Título "Crear Cuenta" y descripción centrados
- **Grid**: Nombre y apellidos en 2 columnas responsivas
- **Campos**: Espaciado vertical consistente de 6 unidades
- **Botón**: Ancho completo, estado visual dinámico
- **Footer**: Enlace de login centrado

### Layout Responsivo
```css
.grid-cols-2 {
  /* Desktop: 2 columnas para nombre/apellidos */
}

@media (max-width: 640px) {
  /* Mobile: Stack vertical automático */
}
```

## Casos de Uso

### 1. Registro Exitoso
```
Usuario completa formulario correctamente
→ Validaciones del cliente pasan
→ Formulario se envía a API
→ API responde con éxito
→ Notificación de éxito mostrada
→ Formulario se limpia automáticamente
→ Auto-redirección a formulario de login
```

### 2. Contraseñas No Coinciden
```
Usuario ingresa contraseñas diferentes
→ Validación del cliente detecta discrepancia
→ Toast de error mostrado
→ Formulario no se envía
→ Usuario corrige y reintenta
```

### 3. Email Ya Registrado
```
Usuario intenta registrar email existente
→ Validaciones del cliente pasan
→ API responde con error de duplicado
→ Notificación específica mostrada
→ Usuario puede usar email diferente
```

### 4. Edad Inválida
```
Usuario ingresa edad fuera de rango
→ Validación del cliente detecta error
→ Toast de error mostrado
→ Formulario no se envía
→ Usuario corrige edad
```

## Consideraciones de Seguridad

### ✅ Implementadas
- **Validación dual**: Cliente y servidor
- **Sanitización**: No exposición de contraseñas en logs
- **Deshabilitación**: Prevención de múltiples envíos
- **Validación de tipos**: Conversión segura de datos
- **Manejo de errores**: Sin exposición de información sensible

### ⚠️ Recomendaciones Adicionales
- **Validación de contraseña robusta**: Mayúsculas, números, símbolos
- **Rate limiting**: Prevención de spam de registros
- **CAPTCHA**: Para prevenir registros automatizados
- **Verificación de email**: Confirmación por correo electrónico
- **Encriptación**: Hash seguro de contraseñas en backend
- **Validación de nombres**: Prevención de caracteres especiales maliciosos

## Testing

### Casos de Prueba Sugeridos
1. **Envío con campos vacíos**
2. **Envío con email inválido**
3. **Contraseñas que no coinciden**
4. **Edad fuera de rango (0, 121, negativo)**
5. **Registro exitoso con datos válidos**
6. **Email ya registrado (duplicado)**
7. **Contraseña muy corta (< 6 caracteres)**
8. **Manejo de errores de red**
9. **Funcionalidad del botón "Iniciar sesión"**
10. **Estados de carga y deshabilitación**
11. **Auto-limpieza del formulario tras éxito**
12. **Auto-redirección a formulario de login**

### Pruebas de Integración
- **API endpoints**: Verificar respuestas correctas
- **Base de datos**: Inserción correcta de usuarios
- **Validación backend**: Coherencia con validación frontend
- **Manejo de errores**: Respuestas apropiadas del servidor

## Mantenimiento y Mejoras

### Posibles Mejoras
- [ ] **Validación en tiempo real**: Feedback inmediato por campo
- [ ] **Medidor de fortaleza**: Indicador visual para contraseñas
- [ ] **Autocompletado inteligente**: Sugerencias de nombres/apellidos
- [ ] **Verificación de email**: Confirmación por correo
- [ ] **Política de contraseñas**: Requisitos más estrictos
- [ ] **Campos opcionales**: Teléfono, dirección, etc.
- [ ] **Avatar upload**: Imagen de perfil durante registro
- [ ] **Términos y condiciones**: Checkbox de aceptación
- [ ] **Animaciones**: Transiciones suaves entre estados
- [ ] **Modo offline**: Almacenamiento temporal para envío posterior

### Refactoring Sugerido
- **Custom hooks**: Extraer lógica de formulario y API
- **Esquemas de validación**: Implementar Zod o Yup
- **Contexto de autenticación**: Estado global de usuario
- **Componente de campo**: Abstraer lógica común de inputs
- **Constantes**: Separar mensajes y configuraciones
- **Tipos TypeScript**: Interfaces más específicas para API

### Optimizaciones de Performance
- **Debouncing**: Para validaciones en tiempo real
- **Memoización**: Prevenir re-renders innecesarios
- **Lazy loading**: Carga diferida de validaciones complejas
- **Compresión**: Optimizar tamaño del bundle

## Integración con Sistema

### Flujo de Autenticación Completo
```
1. Usuario accede a /auth
2. Ve formulario de login por defecto
3. Hace clic en "Crear cuenta"
4. Completa formulario de registro
5. Registro exitoso → Auto-cambio a login
6. Inicia sesión con nuevas credenciales
7. Redirección a /dashboard
```

### Consistencia de Diseño
- **Paleta de colores**: Coherente con Header/Hero/Footer
- **Tipografía**: Misma jerarquía visual
- **Componentes UI**: Reutilización del sistema de diseño
- **Espaciado**: Grid y padding consistentes
- **Interacciones**: Hover states y transiciones uniformes

## Conclusión

El componente `RegisterForm` proporciona una experiencia de registro completa, segura y user-friendly para el sistema RaXiBot. Su diseño robusto, validaciones exhaustivas y manejo inteligente de estados lo convierten en una pieza fundamental del sistema de autenticación. La integración seamless con el formulario de login y la consistencia visual con el resto de la aplicación garantizan una experiencia de usuario cohesiva y profesional.

### Puntos Clave
- ✅ **Validación robusta** en cliente y servidor
- ✅ **UX optimizada** con feedback claro y transiciones suaves
- ✅ **Seguridad implementada** con mejores prácticas
- ✅ **Diseño responsivo** adaptable a todos los dispositivos
- ✅ **Integración completa** con el sistema de autenticación
- ✅ **Mantenibilidad alta** con código limpio y documentado
