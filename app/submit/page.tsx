'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { supplierSchema } from '@/lib/validations'
import { createSlug, cn } from '@/lib/utils'
import type { Category } from '@/lib/types'
import toast from 'react-hot-toast'

export default function SubmitSupplierPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    short_summary: '',
    website_url: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    service_areas: [] as string[],
    founded_year: undefined as number | undefined,
    employee_count: '',
    pricing_model: '',
    has_discount: false,
    discount_description: '',
    discount_code: '',
    accepts_quotes: true,
    tags: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')
  const [serviceAreaInput, setServiceAreaInput] = useState('')

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Company details and category' },
    { id: 2, title: 'Contact & Location', description: 'How customers can reach you' },
    { id: 3, title: 'Services & Pricing', description: 'What you offer and how you price it' },
    { id: 4, title: 'Review & Submit', description: 'Final review before submission' }
  ]

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCategories(data.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Company name is required'
      if (!formData.category_id) newErrors.category_id = 'Please select a category'
      if (!formData.short_summary.trim()) newErrors.short_summary = 'Summary is required'
      if (formData.short_summary.length < 10) newErrors.short_summary = 'Summary must be at least 10 characters'
    }

    if (step === 2) {
      if (!formData.website_url.trim()) newErrors.website_url = 'Website URL is required'
      if (!formData.contact_email.trim()) newErrors.contact_email = 'Contact email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
        newErrors.contact_email = 'Please enter a valid email address'
      }
    }

    if (step === 3) {
      if (!formData.description.trim()) newErrors.description = 'Description is required'
      if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddServiceArea = () => {
    if (serviceAreaInput.trim() && !formData.service_areas.includes(serviceAreaInput.trim())) {
      setFormData(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, serviceAreaInput.trim()]
      }))
      setServiceAreaInput('')
    }
  }

  const handleRemoveServiceArea = (areaToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter(area => area !== areaToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all steps
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step)
        return
      }
    }

    // Final validation with full schema
    try {
      supplierSchema.parse(formData)
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      
      // Go to the step with the first error
      const errorFields = Object.keys(newErrors)
      if (errorFields.includes('name') || errorFields.includes('category_id') || errorFields.includes('short_summary')) {
        setCurrentStep(1)
      } else if (errorFields.includes('website_url') || errorFields.includes('contact_email')) {
        setCurrentStep(2)
      } else if (errorFields.includes('description')) {
        setCurrentStep(3)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/suppliers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit supplier')
      }

      if (data.success) {
        setIsSubmitted(true)
        toast.success('Supplier submitted successfully!')
      } else {
        throw new Error(data.error || 'Failed to submit supplier')
      }
    } catch (error: any) {
      console.error('Error submitting supplier:', error)
      toast.error(error.message || 'Failed to submit supplier')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for your submission!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Your supplier listing has been submitted and is now under review. 
              We'll notify you via email once it's been approved and published.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-blue-900 mb-3">What happens next?</h2>
              <ul className="text-blue-800 space-y-2 text-left">
                <li>• Our team will review your submission within 2-3 business days</li>
                <li>• We may contact you if we need additional information</li>
                <li>• Once approved, your listing will be published in our directory</li>
                <li>• You'll receive login details to manage your listing</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn-primary">
                Browse Directory
              </a>
              <a href="/contact" className="btn-outline">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedCategory = categories.find(cat => cat.id === formData.category_id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Submit Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our directory of verified UK suppliers and connect with moving companies across the country.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep > step.id
                    ? 'bg-green-600 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                )}>
                  {currentStep > step.id ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-full h-1 mx-4',
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  )} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label form-label-required">
                  Company Name
                </label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={cn(
                      'form-input pl-10',
                      errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                    placeholder="Your company name"
                  />
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="category_id" className="form-label form-label-required">
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={cn(
                    'form-select',
                    errors.category_id && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                >
                  <option value="">Select your business category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="form-error">{errors.category_id}</p>}
                {selectedCategory && (
                  <p className="form-help">{selectedCategory.description}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="short_summary" className="form-label form-label-required">
                  Short Summary
                </label>
                <textarea
                  id="short_summary"
                  name="short_summary"
                  rows={3}
                  value={formData.short_summary}
                  onChange={handleInputChange}
                  className={cn(
                    'form-textarea',
                    errors.short_summary && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="A brief description of what your company does (10-300 characters)"
                />
                <div className="flex justify-between items-center">
                  {errors.short_summary && <p className="form-error">{errors.short_summary}</p>}
                  <p className="form-help ml-auto">
                    {formData.short_summary.length}/300
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="website_url" className="form-label form-label-required">
                  Website URL
                </label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className={cn(
                      'form-input pl-10',
                      errors.website_url && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                {errors.website_url && <p className="form-error">{errors.website_url}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="contact_email" className="form-label form-label-required">
                    Contact Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className={cn(
                        'form-input pl-10',
                        errors.contact_email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                      placeholder="hello@yourcompany.com"
                    />
                  </div>
                  {errors.contact_email && <p className="form-error">{errors.contact_email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="contact_phone" className="form-label">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="form-input pl-10"
                      placeholder="+44 20 1234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Primary Location
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    placeholder="London, UK"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Areas</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={serviceAreaInput}
                    onChange={(e) => setServiceAreaInput(e.target.value)}
                    className="form-input flex-1"
                    placeholder="Enter a service area"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddServiceArea()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceArea}
                    className="btn-outline px-3"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {formData.service_areas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.service_areas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceArea(area)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="form-help">Add the regions or cities where you provide services</p>
              </div>
            </div>
          )}

          {/* Step 3: Services & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="description" className="form-label form-label-required">
                  Detailed Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={cn(
                    'form-textarea',
                    errors.description && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Provide a detailed description of your services, experience, and what makes you unique..."
                />
                <div className="flex justify-between items-center">
                  {errors.description && <p className="form-error">{errors.description}</p>}
                  <p className="form-help ml-auto">
                    {formData.description.length}/2000 (minimum 50)
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Services & Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="form-input flex-1"
                    placeholder="Enter a service or specialty"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn-outline px-3"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="form-help">Add tags that describe your services, specialties, or industries you serve</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="founded_year" className="form-label">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    id="founded_year"
                    name="founded_year"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.founded_year || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      founded_year: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="form-input"
                    placeholder="2010"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="employee_count" className="form-label">
                    Team Size
                  </label>
                  <select
                    id="employee_count"
                    name="employee_count"
                    value={formData.employee_count}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select team size</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2-5 employees</option>
                    <option value="6-10">6-10 employees</option>
                    <option value="11-25">11-25 employees</option>
                    <option value="26-50">26-50 employees</option>
                    <option value="51-100">51-100 employees</option>
                    <option value="100+">100+ employees</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pricing_model" className="form-label">
                  Pricing Model
                </label>
                <input
                  type="text"
                  id="pricing_model"
                  name="pricing_model"
                  value={formData.pricing_model}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Monthly subscription, Per project, Hourly rates"
                />
              </div>

              {/* Discount Section */}
              <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_discount"
                    name="has_discount"
                    checked={formData.has_discount}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="has_discount" className="ml-2 font-medium text-red-900">
                    Offer exclusive discount to Moving Suppliers Hub users
                  </label>
                </div>

                {formData.has_discount && (
                  <div className="space-y-4">
                    <div className="form-group">
                      <label htmlFor="discount_description" className="form-label">
                        Discount Description
                      </label>
                      <input
                        type="text"
                        id="discount_description"
                        name="discount_description"
                        value={formData.discount_description}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., 20% off first 3 months, Free setup fee"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="discount_code" className="form-label">
                        Discount Code (Optional)
                      </label>
                      <input
                        type="text"
                        id="discount_code"
                        name="discount_code"
                        value={formData.discount_code}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="MOVING20"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accepts_quotes"
                  name="accepts_quotes"
                  checked={formData.accepts_quotes}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <label htmlFor="accepts_quotes" className="ml-2 text-gray-700">
                  Accept quote requests from moving companies
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Review your submission</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Please review all information carefully before submitting. Once submitted, 
                      your listing will be reviewed by our team before publication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Company Name</dt>
                      <dd className="text-sm text-gray-900">{formData.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Category</dt>
                      <dd className="text-sm text-gray-900">{selectedCategory?.name}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-600">Summary</dt>
                      <dd className="text-sm text-gray-900">{formData.short_summary}</dd>
                    </div>
                  </dl>
                </div>

                <div className="card p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Website</dt>
                      <dd className="text-sm text-blue-600">
                        <a href={formData.website_url} target="_blank" rel="noopener noreferrer">
                          {formData.website_url}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Email</dt>
                      <dd className="text-sm text-gray-900">{formData.contact_email}</dd>
                    </div>
                    {formData.contact_phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Phone</dt>
                        <dd className="text-sm text-gray-900">{formData.contact_phone}</dd>
                      </div>
                    )}
                    {formData.location && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Location</dt>
                        <dd className="text-sm text-gray-900">{formData.location}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="card p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Services & Details</h3>
                  <div className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 mb-1">Description</dt>
                      <dd className="text-sm text-gray-900">{formData.description}</dd>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600 mb-1">Services</dt>
                        <dd className="flex flex-wrap gap-1">
                          {formData.tags.map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}

                    {formData.has_discount && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Discount Offer</dt>
                        <dd className="text-sm text-red-700 font-medium">
                          {formData.discount_description}
                          {formData.discount_code && ` (Code: ${formData.discount_code})`}
                        </dd>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={cn(
                'btn-outline',
                currentStep === 1 && 'btn-disabled'
              )}
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'btn-primary flex items-center space-x-2',
                  isSubmitting && 'btn-disabled'
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 card p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you create the perfect listing. If you have questions or need assistance, don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/contact" className="btn-outline">
              Contact Support
            </a>
            <a href="mailto:hello@movingsuppliershub.com" className="btn-ghost">
              Email: hello@movingsuppliershub.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
