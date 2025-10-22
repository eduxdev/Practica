import { z } from 'zod'

// Esquema de validación para el formulario de registro
export const registerSchema = z.object({
  nombre: z
    .string()
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/, 'El nombre solo puede contener letras')
    .trim(),
  
  apellidos: z
    .string()
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/, 'Los apellidos solo pueden contener letras')
    .trim(),
  
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    
    .max(100, 'El correo no puede exceder 100 caracteres')
    .toLowerCase()
    .trim(),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Esquema para validación en el servidor (sin confirmPassword)
export const serverRegisterSchema = z.object({
  nombre: z
    .string()
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/, 'El nombre solo puede contener letras')
    .trim(),
  
  apellidos: z
    .string()
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/, 'Los apellidos solo pueden contener letras')
    .trim(),
  
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .toLowerCase()
    .trim(),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Tipo TypeScript inferido del esquema
export type RegisterFormData = z.infer<typeof registerSchema>
export type ServerRegisterData = z.infer<typeof serverRegisterSchema>

// Función helper para validar campos individuales
export const validateField = (fieldName: keyof RegisterFormData, value: string | number) => {
  try {
    // Para confirmPassword, solo validar que no esté vacío si se requiere
    if (fieldName === 'confirmPassword') {
      if (value === '') {
        return { success: false, error: 'Confirma tu contraseña' }
      }
      return { success: true, error: null }
    }
    
    const fieldSchema = registerSchema.shape[fieldName]
    fieldSchema.parse(value)
    return { success: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Error de validación' }
    }
    return { success: false, error: 'Error de validación' }
  }
}

// Función para validar todo el formulario (frontend)
export const validateRegisterForm = (data: Record<string, unknown>) => {
  try {
    const result = registerSchema.parse(data)
    return { success: true, data: result, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      return { success: false, data: null, errors: fieldErrors }
    }
    return { success: false, data: null, errors: { general: 'Error de validación' } }
  }
}

// Función para validar datos en el servidor (sin confirmPassword)
export const validateServerRegisterForm = (data: Record<string, unknown>) => {
  try {
    const result = serverRegisterSchema.parse(data)
    return { success: true, data: result, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.issues.forEach((err: z.ZodIssue) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      return { success: false, data: null, errors: fieldErrors }
    }
    return { success: false, data: null, errors: { general: 'Error de validación' } }
  }
}
