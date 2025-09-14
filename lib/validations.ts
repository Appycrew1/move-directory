import { z } from 'zod'

// Basic validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name too long'),
  email: emailSchema,
  company: z.string().max(200, 'Company name too long').optional(),
  phone: z.string().optional(),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  supplier_id: z.string().uuid().optional()
})

export const supplierSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name too long'),
  category_id: z.string().uuid('Please select a category'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  short_summary: z.string().min(10, 'Summary must be at least 10 characters').max(300, 'Summary too long'),
  website_url: z.string().url('Please enter a valid website URL'),
  contact_email: emailSchema,
  contact_phone: z.string().optional(),
  location: z.string().max(200, 'Location too long').optional(),
  service_areas: z.array(z.string()).max(10, 'Maximum 10 service areas allowed').optional(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  employee_count: z.string().max(50).optional(),
  pricing_model: z.string().max(100).optional(),
  has_discount: z.boolean().default(false),
  discount_description: z.string().max(500).optional(),
  discount_code: z.string().max(50).optional(),
  accepts_quotes: z.boolean().default(true),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').default([])
})
