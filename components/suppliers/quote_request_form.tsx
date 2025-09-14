'use client'

import { useState } from 'react'
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { quoteRequestSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import type { Supplier } from '@/lib/types'
import toast from 'react-hot-toast'

interface QuoteRequestFormProps {
  supplier: Supplier
  onSuccess?: () => void
}

const serviceTypes = [
  'Moving Services',
  'Insurance Coverage',
  'Software/CRM',
  'Equipment Rental',
  'Storage Solutions',
  'Marketing Services',
  'Professional Services',
  'Other'
]

const budgetRanges = [
  'Under £500',
  '£500 - £1,000',
  '£1,000 - £2,500',
  '£2,500 - £5,000',
  '£5,000 - £10,000',
  '£10,000+',
  'Contact me for details'
]

const timelines = [
  'ASAP',
  'Within 1 week',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring options'
]

export function QuoteRequestForm({ supplier, onSuccess }: QuoteRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_email: '',
    company_name: '',
    phone: '',
    service_type: '',
    budget_range: '',
    timeline: '',
    location: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    try {
      quoteRequestSchema.parse({
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
      const response = await fetch('/api/quotes', {
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
        throw new Error(data.error || 'Failed to send quote request')
      }

      if (data.success) {
        toast.success(data.message || 'Quote request sent successfully!')
        
        // Reset form
        setFormData({
          requester_name: '',
          requester_email: '',
          company_name: '',
          phone: '',
          service_type: '',
          budget_range: '',
          timeline: '',
          location: '',
          message: ''
        })
        setIsExpanded(false)
        setErrors({})
        
        onSuccess?.()
      } else {
        throw new Error(data.error || 'Failed to send quote request')
      }
    } catch (error: any) {
      console.error('Error submitting quote request:', error)
      toast.error(error.message || 'Failed to send quote request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isExpanded) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get a Quote
          </h3>
          <p className="text-gray-600 mb-4">
            Request a personalized quote from {supplier.name}
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-primary w-full"
          >
            Request Quote
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Request Quote from {supplier.name}
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
            <label htmlFor="requester_name" className="form-label form-label-required">
              Your Name
            </label>
            <input
              type="text"
              id="requester_name"
              name="requester_name"
              value={formData.requester_name}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.requester_name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="Your full name"
            />
            {errors.requester_name && (
              <p className="form-error">{errors.requester_name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="requester_email" className="form-label form-label-required">
              Email Address
            </label>
            <input
              type="email"
              id="requester_email"
              name="requester_email"
              value={formData.requester_email}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.requester_email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="your@email.com"
            />
            {errors.requester_email && (
              <p className="form-error">{errors.requester_email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="company_name" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className={cn(
                'form-input',
                errors.company_name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="Your moving company"
            />
            {errors.company_name && (
              <p className="form-error">{errors.company_name}</p>
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

        {/* Project Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="service_type" className="form-label">
              Service Type
            </label>
            <select
              id="service_type"
              name="service_type"
              value={formData.service_type}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select service type</option>
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget_range" className="form-label">
              Budget Range
            </label>
            <select
              id="budget_range"
              name="budget_range"
              value={formData.budget_range}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="timeline" className="form-label">
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select timeline</option>
              {timelines.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="City or region"
            />
          </div>
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message" className="form-label form-label-required">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className={cn(
              'form-textarea',
              errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            placeholder="Please describe your requirements in detail..."
          />
          {errors.message && (
            <p className="form-error">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'btn-primary w-full flex items-center justify-center space-x-2',
            isSubmitting && 'btn-disabled'
          )}
        >
          {isSubmitting ? (
            <div className="spinner w-4 h-4" />
          ) : (
            <>
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Send Quote Request</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-600 text-center">
          {supplier.name} will contact you directly with a personalized quote
        </p>
      </form>
    </div>
  )
}
