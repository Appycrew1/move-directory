import { z } from 'zod'

// Basic validation patterns
const emailSchema = z.string().email('Please enter a valid email address')
const phoneSchema = z.string().regex(
  /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
  'Please enter a valid UK mobile number'
)
const postcodeSchema = z.string().regex(
  /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
  'Please enter a valid UK postcode'
)
const urlSchema = z.string().url('Please enter a valid URL')

// Profile schemas
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  company_name: z.string().max(100).optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
})

export const profileUpdateSchema = profileSchema.partial()

// Supplier schemas
export const supplierSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional().nullable(),
  website: urlSchema.optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  email: emailSchema,
  address: z.string().min(5, 'Please enter a full address').max(200),
  city: z.string().min(2, 'City must be at least 2 characters').max(50),
  postcode: postcodeSchema,
  logo_url: z.string().url().optional().nullable(),
  categories: z.array(z.string()).min(1, 'Please select at least one category'),
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  coverage_areas: z.array(z.string()).min(1, 'Please select at least one coverage area'),
  minimum_order: z.number().min(0).optional().nullable(),
  established_year: z.number()
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional()
    .nullable(),
  staff_count: z.enum(['1-5', '6-10', '11-25', '26-50', '51-100', '100+']).optional().nullable(),
  certifications: z.array(z.string()).optional(),
  is_verified: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export const supplierUpdateSchema = supplierSchema.partial()

export const supplierApplicationSchema = supplierSchema.extend({
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
})

// Review schemas
export const reviewSchema = z.object({
  supplier_id: z.string().uuid(),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  title: z.string().max(100).optional().nullable(),
  comment: z.string().max(1000).optional().nullable(),
  verified_purchase: z.boolean().default(false),
})

export const reviewUpdateSchema = reviewSchema.partial().omit({ supplier_id: true })

// Quote request schemas
export const quoteRequestSchema = z.object({
  supplier_id: z.string().uuid(),
  service_type: z.string().min(1, 'Please select a service type'),
  move_date: z.string().optional().nullable(),
  move_from: z.string().min(5, 'Please enter the pickup location').max(200),
  move_to: z.string().min(5, 'Please enter the delivery location').max(200),
  property_size: z.enum([
    'Studio/Bedsit',
    '1 Bedroom',
    '2 Bedroom',
    '3 Bedroom',
    '4 Bedroom',
    '5+ Bedroom',
    'Office/Commercial'
  ]),
  special_requirements: z.string().max(500).optional().nullable(),
  budget_range: z.enum([
    'Under £500',
    '£500 - £1,000',
    '£1,000 - £2,000',
    '£2,000 - £5,000',
    '£5,000 - £10,000',
    'Over £10,000'
  ]).optional().nullable(),
  contact_preference: z.enum(['email', 'phone', 'both']).default('both'),
})

export const quoteRequestUpdateSchema = z.object({
  status: z.enum(['pending', 'contacted', 'quoted', 'accepted', 'declined']),
  commission_rate: z.number().min(0).max(100).optional().nullable(),
  commission_amount: z.number().min(0).optional().nullable(),
  quote_value: z.number().min(0).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

// Contact form schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

// Search and filter schemas
export const supplierFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  coverage_areas: z.array(z.string()).optional(),
  min_rating: z.number().min(0).max(5).optional(),
  is_verified: z.boolean().optional(),
  min_established_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  search: z.string().max(100).optional(),
  sort_by: z.enum(['name', 'rating', 'reviews', 'established']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
})

// Feature flag schemas
export const featureFlagSchema = z.object({
  name: z.string().min(1, 'Feature name is required').max(50),
  description: z.string().max(200).optional().nullable(),
  is_active: z.boolean().default(false),
  phase: z.number().min(1).max(3).optional().nullable(),
})

export const featureFlagUpdateSchema = featureFlagSchema.partial().omit({ name: true })

// Admin schemas
export const adminStatsSchema = z.object({
  total_suppliers: z.number(),
  total_reviews: z.number(),
  total_quote_requests: z.number(),
  pending_quotes: z.number(),
  commission_earned: z.number(),
  conversion_rate: z.number(),
})

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
})

export const signupSchema = z.object({
  email: emailSchema,
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  company_name: z.string().max(100).optional(),
  role: z.enum(['user', 'supplier']).default('user'),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  total_pages: z.number().min(0),
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be a JPEG, PNG, or WebP image'
    ),
})

// Bulk operations schemas
export const bulkSupplierUpdateSchema = z.object({
  supplier_ids: z.array(z.string().uuid()).min(1, 'Please select at least one supplier'),
  updates: supplierUpdateSchema,
})

export const bulkReviewModerationSchema = z.object({
  review_ids: z.array(z.string().uuid()).min(1, 'Please select at least one review'),
  action: z.enum(['approve', 'reject']),
})

// AI comparison schema
export const aiComparisonSchema = z.object({
  supplier_ids: z.array(z.string().uuid())
    .min(2, 'Please select at least 2 suppliers')
    .max(5, 'You can compare up to 5 suppliers'),
})

// Supplier import schema
export const supplierImportSchema = z.object({
  suppliers: z.array(supplierSchema).min(1, 'Please provide at least one supplier'),
})

// Commission tracking schema
export const commissionSchema = z.object({
  quote_request_id: z.string().uuid(),
  commission_rate: z.number().min(0).max(100),
  quote_value: z.number().min(0),
  commission_amount: z.number().min(0),
  payment_status: z.enum(['pending', 'paid', 'cancelled']).default('pending'),
  payment_date: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

// Verification schema
export const verificationSchema = z.object({
  supplier_id: z.string().uuid(),
  documents: z.array(z.string().url()).min(1, 'Please upload at least one document'),
  verification_type: z.enum(['identity', 'business', 'insurance', 'certification']),
  notes: z.string().max(500).optional().nullable(),
})

// Notification preferences schema
export const notificationPreferencesSchema = z.object({
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  marketing_emails: z.boolean().default(false),
  quote_updates: z.boolean().default(true),
  review_notifications: z.boolean().default(true),
  system_alerts: z.boolean().default(true),
})

// Export commonly used schemas
export type ProfileFormData = z.infer<typeof profileSchema>
export type SupplierFormData = z.infer<typeof supplierSchema>
export type SupplierApplicationData = z.infer<typeof supplierApplicationSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type SupplierFilters = z.infer<typeof supplierFiltersSchema>
export type FeatureFlagData = z.infer<typeof featureFlagSchema>
export type LoginData = z.infer<typeof loginSchema>
export type SignupData = z.infer<typeof signupSchema>
