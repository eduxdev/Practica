'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import ReCAPTCHA from 'react-google-recaptcha'

interface LoginFormProps extends React.ComponentProps<"form"> {
  onToggleForm?: () => void
}

export function LoginForm({
  className,
  onToggleForm,
  ...props
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const router = useRouter()
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Verificar reCAPTCHA
    if (!recaptchaToken) {
      toast.error('Por favor completa la verificación reCAPTCHA')
      setIsLoading(false)
      return
    }

    // Validar con Zod
    try {
      const validatedData = loginSchema.parse(formData)
      setErrors({}) // Limpiar errores si la validación es exitosa
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError
        // Convertir errores de Zod a un objeto más manejable
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
        zodError.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof LoginFormData
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = err.message
          }
        })
        setErrors(fieldErrors)
        
        // Mostrar el primer error
        const firstError = zodError.issues[0]?.message
        if (firstError) {
          toast.error(firstError)
        }
        setIsLoading(false)
        return
      }
    }
    
    try {
      // Llamar a la API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password,
          recaptchaToken: recaptchaToken // Agregar esto
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }
      
      // Guardar datos del usuario en localStorage (temporal)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      toast.success('¡Inicio de sesión exitoso!', {
        description: 'Bienvenido de vuelta.',
        duration: 3000,
      })
      
      // Redirigir al dashboard
      router.push('/dashboard')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
      toast.error(errorMessage, {
        description: 'Por favor verifica tus credenciales.',
      })
      
      // Resetear reCAPTCHA en caso de error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
        setRecaptchaToken(null)
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
          <h1 className="text-2xl font-bold">Inicia Sesión</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tu correo electrónico para iniciar sesión
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Link
              href="/auth/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required 
              disabled={isLoading}
              className={cn(
                "pr-10",
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
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
        </Field>
        <Field>
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleRecaptchaChange}
              theme="light"
              hl="es"
            />
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading || !recaptchaToken}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            ¿No tienes una cuenta?{" "}
            {onToggleForm ? (
              <button
                type="button"
                onClick={onToggleForm}
                className="underline underline-offset-4 hover:text-primary"
              >
                Crear cuenta
              </button>
            ) : (
              <a href="#" className="underline underline-offset-4">
                Crear cuenta
              </a>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
