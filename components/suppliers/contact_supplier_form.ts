'use client'

import { useState } from 'react'
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { contactMessageSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import type { Supplier } from '@/lib/types'
import toast from 'react-hot-toast'

interface ContactSupplierFormProps {
  supplier: Supplier
  onSuccess?: () => void
}

export function ContactSupplierForm({ supplier, onSuccess }: ContactSupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    try {
      contactMessageSchema.parse({
        ...formData,
        supplier_id: supplier.id
      })
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

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          supplier_id: supplier.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      if (data.success) {
        toast.success(data.message || 'Message sent successfully!')
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: ''
        })
        setIsExpanded(false)
        setErrors({})
        
        onSuccess?.()
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDirectContact = () => {
    if (supplier.contact_email) {
      const subject = encodeURIComponent(`Inquiry about ${supplier.name}`)
      const body = encodeURIComponent(`Hi,\n\nI found your company on Moving Suppliers Hub and I'm interested in learning more about your services.\n\nBest regards`)
      window.location.href = `mailto:${supplier.contact_email}?subject=${subject}&body=${body}`
    }
  }

  if (!isExpanded) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <EnvelopeIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contact {supplier.name}
          </h3>
          <p className="text-gray-600 mb-4">
            Have questions? Send them a message
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="btn-primary w-full"
            >
              Send Message
            </button>
            
            {supplier.contact_email && (
              <button
                onClick={handleDirectContact}
                className="btn-outline w-full"
              >
                Email Directly
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Contact {supplier.name}
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label form-label-required">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="form-error">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label form-label-required">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="company" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.company && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="Your moving company"
            />
            {errors.company && (
              <p className="form-error">{errors.company}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.phone && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="+44 7XXX XXXXXX"
            />
            {errors.phone && (
              <p className="form-error">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={cn(
              'form-input',
              errors.subject && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            placeholder="What's this about?"
          />
          {errors.subject && (
            <p className="form-error">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message" className="form-label form-label-required">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={cn(
              'form-textarea',
              errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            placeholder="Hi, I'm interested in learning more about your services..."
          />
          {errors.message && (
            <p className="form-error">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'btn-primary flex-1 flex items-center justify-center space-x-2',
              isSubmitting && 'btn-disabled'
            )}
          >
            {isSubmitting ? (
              <div className="spinner w-4 h-4" />
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>

          {supplier.contact_email && (
            <button
              type="button"
              onClick={handleDirectContact}
              className="btn-outline flex-1"
            >
              Email Directly
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 text-center">
          Your message will be sent directly to {supplier.name}
        </p>
      </form>
    </div>
  )
}