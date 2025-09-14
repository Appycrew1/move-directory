'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { signInSchema, signUpSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { signIn, signUp, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    try {
      if (isSignUp) {
        signUpSchema.parse({
          email,
          full_name: fullName,
          company_name: companyName,
          marketing_emails: marketingEmails
        })
      } else {
        signInSchema.parse({ email })
      }
    } catch (error: any) {
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, {
          full_name: fullName,
          company_name: companyName,
          marketing_emails: marketingEmails
        })
      } else {
        await signIn(email)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const loading = isLoading || authLoading

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <img 
              className="h-10 w-auto" 
              src="/images/logo.svg" 
              alt="Moving Suppliers Hub" 
            />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Moving Suppliers Hub
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Join moving companies across the UK' : 'Access your saved suppliers and preferences'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false)
                setErrors({})
              }}
              className={cn(
                'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200',
                !isSignUp
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true)
                setErrors({})
              }}
              className={cn(
                'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200',
                isSignUp
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label form-label-required">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'form-input pl-10',
                    errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Enter your email"
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label form-label-required">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={cn(
                      'form-input',
                      errors.full_name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                    placeholder="Your full name"
                  />
                  {errors.full_name && (
                    <p className="form-error">{errors.full_name}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">
                    Company name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={cn(
                      'form-input',
                      errors.company_name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                    placeholder="Your moving company name (optional)"
                  />
                  {errors.company_name && (
                    <p className="form-error">{errors.company_name}</p>
                  )}
                </div>

                {/* Marketing Emails */}
                <div className="flex items-start">
                  <input
                    id="marketingEmails"
                    name="marketingEmails"
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="form-checkbox mt-1"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                    Send me updates about new suppliers, exclusive discounts, and industry insights
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'btn-primary w-full flex items-center justify-center space-x-2',
                loading && 'btn-disabled'
              )}
            >
              {loading ? (
                <div className="spinner w-4 h-4" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Send Magic Link'}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Magic Link Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Secure Magic Link Authentication
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  We'll send you a secure link to sign in. No passwords to remember!
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          {isSignUp && (
            <p className="mt-4 text-xs text-gray-600 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>

        {/* Back to Directory */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-1"
          >
            <span>← Back to Directory</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
