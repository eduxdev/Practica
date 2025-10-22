'use client'

import { useState, useMemo } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { z } from 'zod'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'

const resetPasswordSchema = z.object({
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .toLowerCase()
    .trim(),
  codigo: z
    .string()
    .length(6, 'El código debe tener exactamente 6 dígitos')
    .regex(/^[0-9]{6}$/, 'El código solo puede contener números'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu nueva contraseña')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  correo: string
  onBackToForgot?: () => void
  onSuccess?: () => void
}

export function ResetPasswordForm({
  className,
  correo,
  onBackToForgot,
  onSuccess,
  ...props
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    correo,
    codigo: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calcular fortaleza de la contraseña
  const passwordStrength = useMemo(() => {
    const password = formData.password
    if (!password) return { strength: 0, label: '', color: '' }

    let strength = 0
    const checks = {
      length: password.length >= 6,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    // Calcular puntuación
    if (checks.length) strength += 20
    if (password.length >= 8) strength += 10
    if (checks.hasLower) strength += 20
    if (checks.hasUpper) strength += 20
    if (checks.hasNumber) strength += 15
    if (checks.hasSpecial) strength += 15

    // Determinar etiqueta y color
    let label = ''
    let color = ''
    
    if (strength < 40) {
      label = 'Débil'
      color = 'bg-gray-100'
    } else if (strength < 60) {
      label = 'Media'
      color = 'bg-y'
    } else {
      label = 'Fuerte'
      color = 'bg-gray-250'
    }

    return { strength, label, color }
  }, [formData.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Función separada para manejar cambios en el código OTP
  const handleOTPChange = (value: string) => {
    setFormData(prev => ({ ...prev, codigo: value }))
    
    // Limpiar error del código cuando el usuario empiece a escribir
    if (errors.codigo) {
      setErrors(prev => ({
        ...prev,
        codigo: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validar con Zod
      const validatedData = resetPasswordSchema.parse(formData)
      
      // Llamar a la API para restablecer contraseña
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: validatedData.correo,
          codigo: validatedData.codigo,
          password: validatedData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        }
        throw new Error(data.error || 'Error al restablecer contraseña')
      }
      
      toast.success('¡Contraseña restablecida! ✅', {
        description: 'Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión.',
        duration: 5000,
      })
      
      // Limpiar formulario
      setFormData({
        correo,
        codigo: '',
        password: '',
        confirmPassword: ''
      })
      
      // Navegar de vuelta al login
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        
        const firstError = error.issues[0]?.message
        if (firstError) {
          toast.error(firstError)
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error al restablecer contraseña'
        toast.error(errorMessage, {
          description: 'Por favor verifica el código e intenta nuevamente.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Restablecer Contraseña</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa el código que recibiste por SMS y tu nueva contraseña
          </p>

        </div>
        
        <Field>
          <FieldLabel htmlFor="codigo">Código SMS</FieldLabel>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={formData.codigo}
              onChange={handleOTPChange}
              disabled={isLoading}
              className={cn(errors.codigo && "border-red-500")}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {errors.codigo && (
            <p className="text-xs text-red-500 mt-1 text-center">{errors.codigo}</p>
          )}
          <FieldDescription className="text-xs text-muted-foreground text-center">
            Ingresa el código de 6 dígitos que recibiste por SMS
          </FieldDescription>
        </Field>

        <Field className="relative">
          <FieldLabel htmlFor="password">Nueva Contraseña</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={cn("pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.password}
            >
              {showPassword ? (
                <EyeOpenIcon className="h-4 w-4" />
              ) : (
                <EyeClosedIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
          {formData.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "font-medium",
                  passwordStrength.strength < 40 && "text-gray-100",
                  passwordStrength.strength >= 40 && passwordStrength.strength < 70 && "text-gray-250",
                  passwordStrength.strength >= 60 && "text-gray-250"
                )}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={passwordStrength.strength} 
                  className="h-2"
                />
                <div 
                  className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300",
                    passwordStrength.color
                  )}
                  style={{
                    width: `${passwordStrength.strength}%`,
                  }}
                />
              </div>
            </div>
          )}
        </Field>

        <Field className="relative">
          <FieldLabel htmlFor="confirmPassword">Confirmar Nueva Contraseña</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={cn("pr-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.confirmPassword}
            >
              {showConfirmPassword ? (
                <EyeOpenIcon className="h-4 w-4" />
              ) : (
                <EyeClosedIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Restableciendo...
              </>
            ) : (
              'Restablecer Contraseña'
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            ¿No recibiste el código?{" "}
            {onBackToForgot ? (
              <button
                type="button"
                onClick={onBackToForgot}
                className="underline underline-offset-4 hover:text-primary"
              >
                Enviar nuevo código
              </button>
            ) : (
              <a href="#" className="underline underline-offset-4">
                Enviar nuevo código
              </a>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
