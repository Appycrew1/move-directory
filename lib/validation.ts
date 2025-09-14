import { z } from 'zod'

// Common schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const phoneSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number').optional()
export const urlSchema = z.string().url('Please enter a valid URL').optional()
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

// Supplier validation
export const supplierSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name too long'),
  category_id: z.string().uuid('Please select a category'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  short_summary: z.string().min(10, 'Summary must be at least 10 characters').max(300, 'Summary too long'),
  website_url: z.string().url('Please enter a valid website URL'),
  contact_email: emailSchema,
  contact_phone: phoneSchema,
  
  // Location & Service
  location: z.string().max(200, 'Location too long').optional(),
  service_areas: z.array(z.string()).max(10, 'Maximum 10 service areas allowed').optional(),
  
  // Business Info
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  employee_count: z.string().max(50).optional(),
  pricing_model: z.string().max(100).optional(),
  
  // Discounts
  has_discount: z.boolean().default(false),
  discount_description: z.string().max(500).optional(),
  discount_code: z.string().max(50).optional(),
  
  // Settings
  accepts_quotes: z.boolean().default(true),
  
  // Tags
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').default([])
})

export const supplierUpdateSchema = supplierSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected', 'hidden']).optional(),
  featured: z.boolean().optional(),
  verified_business: z.boolean().optional(),
  verified_insurance: z.boolean().optional(),
  commission_rate: z.number().min(0).max(50).optional() // 0-50% commission rate
})

// Quote Request validation
export const quoteRequestSchema = z.object({
  supplier_id: z.string().uuid('Invalid supplier ID'),
  requester_name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  requester_email: emailSchema,
  company_name: z.string().max(200, 'Company name too long').optional(),
  phone: phoneSchema,
  
  service_type: z.string().max(100, 'Service type too long').optional(),
  budget_range: z.string().max(50, 'Budget range too long').optional(),
  timeline: z.string().max(100, 'Timeline too long').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  
  // UTM tracking
  utm_campaign: z.string().max(100).optional(),
  utm_source: z.string().max(100).optional()
})

export const quoteUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'responded', 'converted', 'lost']).optional(),
  commission_tracked: z.boolean().optional(),
  commission_amount: z.number().min(0).optional(),
  conversion_value: z.number().min(0).optional(),
  converted_at: z.string().datetime().optional()
})

// Review validation
export const reviewSchema = z.object({
  supplier_id: z.string().uuid('Invalid supplier ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().max(200, 'Title too long').optional(),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review too long'),
  company_name: z.string().max(200, 'Company name too long').optional()
})

export const reviewUpdateSchema = reviewSchema.partial().extend({
  id: z.string().uuid(),
  verified: z.boolean().optional()
})

// Contact Message validation
export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  email: emailSchema,
  company: z.string().max(200, 'Company name too long').optional(),
  phone: phoneSchema,
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  supplier_id: z.string().uuid().optional()
})

// User Profile validation
export const userProfileSchema = z.object({
  full_name: z.string().max(200, 'Name too long').optional(),
  company_name: z.string().max(200, 'Company name too long').optional(),
  phone: phoneSchema,
  location: z.string().max(200, 'Location too long').optional(),
  email_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false)
})

// Category validation
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100, 'Name too long'),
  slug: slugSchema,
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(50, 'Icon name too long').optional()
})

export const categoryUpdateSchema = categorySchema.partial().extend({
  id: z.string().uuid()
})

// Feature Flag validation
export const featureFlagSchema = z.object({
  id: z.string().min(1, 'Feature flag ID is required').max(50),
  enabled: z.boolean().default(false),
  description: z.string().max(500).optional(),
  config: z.record(z.any()).default({})
})

// Search and Filter validation
export const supplierFilterSchema = z.object({
  search: z.string().max(100).optional(),
  category: z.string().uuid().optional(),
  location: z.string().max(100).optional(),
  rating: z.number().min(1).max(5).optional(),
  hasDiscount: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['name', 'rating', 'newest', 'popular']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12)
})

// AI Comparison validation
export const aiComparisonSchema = z.object({
  supplier_ids: z.array(z.string().uuid()).min(2, 'At least 2 suppliers required').max(3, 'Maximum 3 suppliers allowed')
})

// Admin validation schemas
export const adminLogSchema = z.object({
  action: z.string().max(100),
  target_type: z.string().max(50).optional(),
  target_id: z.string().uuid().optional(),
  details: z.record(z.any()).optional()
})

// Auth validation
export const signInSchema = z.object({
  email: emailSchema
})

export const signUpSchema = z.object({
  email: emailSchema,
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  company_name: z.string().max(200).optional(),
  marketing_emails: z.boolean().default(false)
})

// Password validation (if implementing password auth)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')

export const signUpWithPasswordSchema = signUpSchema.extend({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Export types inferred from schemas
export type SupplierFormData = z.infer<typeof supplierSchema>
export type SupplierUpdateData = z.infer<typeof supplierUpdateSchema>
export type QuoteRequestData = z.infer<typeof quoteRequestSchema>
export type QuoteUpdateData = z.infer<typeof quoteUpdateSchema>
export type ReviewData = z.infer<typeof reviewSchema>
export type ReviewUpdateData = z.infer<typeof reviewUpdateSchema>
export type ContactMessageData = z.infer<typeof contactMessageSchema>
export type UserProfileData = z.infer<typeof userProfileSchema>
export type CategoryData = z.infer<typeof categorySchema>
export type CategoryUpdateData = z.infer<typeof categoryUpdateSchema>
export type FeatureFlagData = z.infer<typeof featureFlagSchema>
export type SupplierFilterData = z.infer<typeof supplierFilterSchema>
export type AIComparisonData = z.infer<typeof aiComparisonSchema>
export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
export type SignUpWithPasswordData = z.infer<typeof signUpWithPasswordSchema>
