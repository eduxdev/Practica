'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { GalleryVerticalEnd } from "lucide-react"

type Step = 'forgot' | 'reset'

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('forgot')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  const handleCodeSent = (correo: string) => {
    setUserEmail(correo)
    setCurrentStep('reset')
  }

  const handleBackToForgot = () => {
    setCurrentStep('forgot')
  }

  const handleBackToLogin = () => {
    router.push('/auth')
  }

  const handleSuccess = () => {
    router.push('/auth')
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Sistema AI
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {currentStep === 'forgot' && (
              <ForgotPasswordForm
                onCodeSent={handleCodeSent}
                onBackToLogin={handleBackToLogin}
              />
            )}
            
            {currentStep === 'reset' && (
              <ResetPasswordForm
                correo={userEmail}
                onBackToForgot={handleBackToForgot}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/image/agricultura.webp"
          alt="Recuperación de contraseña segura"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
    </div>
  )
}
