'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  correo: z
    .string()
    .email('Debe ser un correo electrónico válido')
    .min(1, 'El correo es obligatorio')
    .toLowerCase()
    .trim()
})

interface ForgotPasswordFormProps extends React.ComponentProps<"form"> {
  onBackToLogin?: () => void
  onCodeSent?: (correo: string) => void
}

export function ForgotPasswordForm({
  className,
  onBackToLogin,
  onCodeSent,
  ...props
}: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState({
    correo: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validar con Zod
      const validatedData = forgotPasswordSchema.parse(formData)
      
      // Llamar a la API para enviar SMS
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: validatedData.correo
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        }
        throw new Error(data.error || 'Error al enviar código de recuperación')
      }
      
      toast.success('¡Código enviado! 📱', {
        description: `Se ha enviado un código de recuperación al número ${data.telefono}`,
        duration: 5000,
      })
      
      // Navegar al formulario de reset con código
      onCodeSent?.(validatedData.correo)
      
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
        const errorMessage = error instanceof Error ? error.message : 'Error al enviar código'
        toast.error(errorMessage, {
          description: 'Por favor verifica que el correo esté registrado.',
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
          <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tu correo electrónico y te enviaremos un código SMS para restablecer tu contraseña
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="correo">Correo Electrónico</FieldLabel>
          <Input 
            id="correo"
            name="correo"
            type="email" 
            placeholder="Correo Electrónico" 
            value={formData.correo}
            onChange={handleChange}
            required 
            disabled={isLoading}
            className={cn(
              errors.correo && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.correo && (
            <p className="text-xs text-red-500 mt-1">{errors.correo}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Enviando código...
              </>
            ) : (
              'Enviar Código SMS'
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            ¿Recordaste tu contraseña?{" "}
            {onBackToLogin ? (
              <button
                type="button"
                onClick={onBackToLogin}
                className="underline underline-offset-4 hover:text-primary"
              >
                Volver al inicio de sesión
              </button>
            ) : (
              <a href="#" className="underline underline-offset-4">
                Volver al inicio de sesión
              </a>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
