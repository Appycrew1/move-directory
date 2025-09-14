'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

// Simple validation function instead of importing from lib
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const searchParams = useSearchParams()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (isSignUp && !fullName.trim()) {
      newErrors.full_name = 'Name is required'
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
      // Simple fetch call for now - you can enhance this later
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: isSignUp ? fullName : undefined,
          companyName: isSignUp ? companyName : undefined,
          marketingEmails: isSignUp ? marketingEmails : undefined,
          isSignUp
        })
      })

      if (response.ok) {
        toast.success('Check your email for the magic link!')
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of your component JSX stays the same
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Your existing JSX here */}
      <div className="text-center">
        <h1>Sign In Page</h1>
        <p>This is a placeholder - add your full form JSX here</p>
      </div>
    </div>
  )
}
