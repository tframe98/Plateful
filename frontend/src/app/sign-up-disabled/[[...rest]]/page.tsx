"use client"

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Utensils, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const invitation = searchParams.get('invitation')
  
  // If there's an invitation, redirect to dashboard after signup
  // Otherwise, go to onboarding
  const afterSignUpUrl = invitation ? '/dashboard' : '/onboarding'

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex justify-center">
          <div className="flex items-center">
            <Utensils className="h-12 w-12 text-primary-600" />
            <span className="ml-3 text-2xl font-bold text-surface-900">Restaurant SaaS</span>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-surface-900">
          {invitation ? 'Accept Invitation' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-surface-600">
          {invitation 
            ? `You've been invited to join a restaurant team`
            : 'Start managing your restaurant in minutes'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:px-10">
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/login" 
            afterSignUpUrl={afterSignUpUrl}
            appearance={{
              elements: {
                formButtonPrimary: 'btn-primary w-full flex justify-center py-3',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'btn-secondary w-full flex justify-center py-3 mb-3',
                formFieldInput: 'input-field',
                formFieldLabel: 'block text-sm font-medium text-surface-700',
                formFieldLabelRow: 'mb-1',
                dividerLine: 'bg-surface-300',
                dividerText: 'px-2 bg-white text-surface-500',
                footerActionLink: 'font-medium text-primary-600 hover:text-primary-500',
                footerActionText: 'text-sm text-surface-600'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 