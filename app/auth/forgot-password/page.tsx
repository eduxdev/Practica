'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
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
  )
}
