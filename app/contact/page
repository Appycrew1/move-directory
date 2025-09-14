'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { contactMessageSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Moving Suppliers Hub. We\'re here to help with any questions about our directory or services.',
}

const contactReasons = [
  {
    id: 'general',
    title: 'General Inquiry',
    description: 'General questions about our services',
    icon: QuestionMarkCircleIcon
  },
  {
    id: 'supplier',
    title: 'Supplier Support',
    description: 'Help with your supplier listing',
    icon: ChatBubbleLeftRightIcon
  },
  {
    id: 'technical',
    title: 'Technical Issue',
    description: 'Report a bug or technical problem',
    icon: ExclamationCircleIcon
  },
  {
    id: 'partnership',
    title: 'Partnership',
    description: 'Business partnerships and collaborations',
    icon: CheckCircleIcon
  }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
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
      contactMessageSchema.parse(formData)
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
          subject: formData.subject || getSubjectFromReason()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      if (data.success) {
        setIsSubmitted(true)
        toast.success('Message sent successfully!')
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

  const getSubjectFromReason = () => {
    const reason = contactReasons.find(r => r.id === selectedReason)
    return reason ? reason.title : 'General Inquiry'
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for reaching out!
            </h1>
            
            <p className="text-gray-600 mb-8">
              We've received your message and will get back to you within 24 hours. 
              Our team is committed to providing excellent support.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-green-900 mb-3">What happens next?</h2>
              <ul className="text-green-800 space-y-2 text-left">
                <li>• We'll review your message and route it to the right team member</li>
                <li>• You'll receive a response within 24 hours (usually much sooner)</li>
                <li>• For urgent issues, we may call you directly</li>
                <li>• We'll keep you updated on any follow-up actions needed</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn-primary">
                Back to Directory
              </a>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    subject: '',
                    message: ''
                  })
                  setSelectedReason('')
                  setErrors({})
                }}
                className="btn-outline"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Whether you have questions, need support, or want to discuss partnerships, 
            we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <EnvelopeIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:hello@movingsuppliershub.com" className="hover:text-blue-600">
                      hello@movingsuppliershub.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    We respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <PhoneIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+442012345678" className="hover:text-blue-600">
                      +44 20 1234 5678
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Fri, 9am-6pm GMT
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600">
                    London, United Kingdom
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Serving the UK market
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Business Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    All times in GMT
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Quick Answers
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Check our FAQ section for answers to common questions about our directory and services.
              </p>
              <a href="/faq" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Visit FAQ →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {/* Contact Reasons */}
              <div className="mb-6">
                <label className="form-label mb-3">What can we help you with?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contactReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className={cn(
                        'relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200',
                        selectedReason === reason.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="sr-only"
                      />
                      <reason.icon className={cn(
                        'h-5 w-5 mr-3',
                        selectedReason === reason.id ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <div>
                        <div className={cn(
                          'font-medium text-sm',
                          selectedReason === reason.id ? 'text-blue-900' : 'text-gray-900'
                        )}>
                          {reason.title}
                        </div>
                        <div className={cn(
                          'text-xs',
                          selectedReason === reason.id ? 'text-blue-700' : 'text-gray-600'
                        )}>
                          {reason.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    {errors.name && <p className="form-error">{errors.name}</p>}
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
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      className="form-input"
                      placeholder="Your company (optional)"
                    />
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
                      className="form-input"
                      placeholder="+44 7XXX XXXXXX"
                    />
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
                    className="form-input"
                    placeholder={`Subject (optional - defaults to "${getSubjectFromReason()}")`}
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label form-label-required">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={cn(
                      'form-textarea',
                      errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                    placeholder="Please provide as much detail as possible so we can help you effectively..."
                  />
                  {errors.message && <p className="form-error">{errors.message}</p>}
                  <p className="form-help">
                    {formData.message.length}/2000 characters
                  </p>
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
                    <>
                      <div className="spinner w-4 h-4" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  We typically respond within 24 hours. For urgent matters, please call us directly.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
