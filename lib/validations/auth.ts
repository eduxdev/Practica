import { z } from 'zod'

// Schema de validación para registro
export const registerSchema = z.object({
  nombre: z.string()
    
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  apellidos: z.string()
    
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),
  correo: z.string()
    .email('Por favor ingresa un correo electrónico válido')
    .min(5, 'El correo es demasiado corto')
    .max(100, 'El correo es demasiado largo'),
  edad: z.string()
    .refine((val) => !isNaN(Number(val)), 'La edad debe ser un número')
    .refine((val) => Number(val) >= 1 && Number(val) <= 120, 'La edad debe estar entre 1 y 120 años'),
  password: z.string()
    
    .max(100, 'La contraseña es demasiado larga'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Schema de validación para login
export const loginSchema = z.object({
  correo: z.string()
    .email('Por favor ingresa un correo electrónico válido')
    .min(1, 'El correo es requerido'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
})

// Tipos inferidos de los schemas
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>


