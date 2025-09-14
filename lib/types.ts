// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      suppliers: {
        Row: Supplier
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'contact_count' | 'rating_average' | 'rating_count'>
        Update: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>
      }
      supplier_tags: {
        Row: SupplierTag
        Insert: Omit<SupplierTag, 'id' | 'created_at'>
        Update: Partial<Omit<SupplierTag, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>
      }
      quote_requests: {
        Row: QuoteRequest
        Insert: Omit<QuoteRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuoteRequest, 'id' | 'created_at' | 'updated_at'>>
      }
      contact_messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, 'id' | 'created_at' | 'read_at'>
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>
      }
      feature_flags: {
        Row: FeatureFlag
        Insert: Omit<FeatureFlag, 'created_at' | 'updated_at'>
        Update: Partial<Omit<FeatureFlag, 'created_at' | 'updated_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'created_at' | 'updated_at'>>
      }
      saved_suppliers: {
        Row: SavedSupplier
        Insert: Omit<SavedSupplier, 'id' | 'created_at'>
        Update: Partial<Omit<SavedSupplier, 'id' | 'created_at'>>
      }
    }
  }
}

// Core entities
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  slug: string
  category_id?: string
  description?: string
  short_summary?: string
  logo_url?: string
  website_url?: string
  contact_email?: string
  contact_phone?: string
  
  // Location & Service Area
  location?: string
  service_areas?: string[]
  
  // Business Info
  founded_year?: number
  employee_count?: string
  annual_revenue_range?: string
  
  // Platform Status
  status: 'pending' | 'approved' | 'rejected' | 'hidden'
  featured: boolean
  verified_business: boolean
  verified_insurance: boolean
  
  // Pricing & Discounts
  has_discount: boolean
  discount_description?: string
  discount_code?: string
  pricing_model?: string
  
  // Engagement Metrics
  view_count: number
  contact_count: number
  rating_average: number
  rating_count: number
  
  // Feature Flags
  accepts_quotes: boolean
  commission_rate: number
  
  // Metadata
  created_at: string
  updated_at: string
  created_by?: string
  approved_by?: string
  approved_at?: string
  
  // Relations
  category?: Category
  tags?: SupplierTag[]
  reviews?: Review[]
}

export interface SupplierTag {
  id: string
  supplier_id: string
  tag: string
  created_at: string
}

export interface Review {
  id: string
  supplier_id: string
  user_id: string
  company_name?: string
  rating: number
  title?: string
  content: string
  verified: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  
  // Relations
  user_profile?: UserProfile
}

export interface QuoteRequest {
  id: string
  supplier_id: string
  requester_email: string
  requester_name: string
  company_name?: string
  phone?: string
  
  // Request Details
  service_type?: string
  budget_range?: string
  timeline?: string
  location?: string
  message: string
  
  // Tracking
  status: 'new' | 'responded' | 'converted' | 'lost'
  source: string
  utm_campaign?: string
  utm_source?: string
  
  // Commission Tracking (Phase 2)
  commission_tracked: boolean
  commission_amount?: number
  conversion_value?: number
  converted_at?: string
  
  created_at: string
  updated_at: string
  
  // Relations
  supplier?: Supplier
}

export interface ContactMessage {
  id: string
  supplier_id?: string
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
  
  status: 'new' | 'read' | 'responded'
  source: string
  
  created_at: string
  read_at?: string
  
  // Relations
  supplier?: Supplier
}

export interface FeatureFlag {
  id: string
  enabled: boolean
  description?: string
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  phone?: string
  location?: string
  role: 'user' | 'admin' | 'supplier'
  
  // Preferences
  email_notifications: boolean
  marketing_emails: boolean
  
  created_at: string
  updated_at: string
}

export interface SavedSupplier {
  id: string
  user_id: string
  supplier_id: string
  created_at: string
  
  // Relations
  supplier?: Supplier
}

// UI Types
export interface CompareSupplier extends Supplier {
  isSelected: boolean
}

export interface AIComparison {
  suppliers: {
    id: string
    name: string
    pros: string[]
    cons: string[]
    bestFor: string
  }[]
  recommendation: string
  generated_at: string
}

// Form Types
export interface QuoteFormData {
  requester_name: string
  requester_email: string
  company_name?: string
  phone?: string
  service_type?: string
  budget_range?: string
  timeline?: string
  location?: string
  message: string
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
  supplier_id?: string
}

export interface SupplierFormData {
  name: string
  category_id: string
  description: string
  short_summary: string
  website_url: string
  contact_email: string
  contact_phone?: string
  location?: string
  service_areas?: string[]
  founded_year?: number
  employee_count?: string
  pricing_model?: string
  has_discount: boolean
  discount_description?: string
  discount_code?: string
  accepts_quotes: boolean
  tags: string[]
}

export interface ReviewFormData {
  rating: number
  title?: string
  content: string
  company_name?: string
}

// Filter & Search Types
export interface SupplierFilters {
  category?: string
  location?: string
  rating?: number
  hasDiscount?: boolean
  featured?: boolean
  tags?: string[]
  search?: string
  sortBy?: 'name' | 'rating' | 'newest' | 'popular'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationInfo
}

// Feature Flag Helpers
export type FeatureFlagId = 
  | 'commission_tracking'
  | 'premium_listings' 
  | 'supplier_analytics'
  | 'quote_requests'
  | 'reviews_system'
  | 'ai_comparison'
  | 'location_filtering'
  | 'email_notifications'

// Utility Types
export type SupplierStatus = Supplier['status']
export type UserRole = UserProfile['role']
export type QuoteStatus = QuoteRequest['status']
export type MessageStatus = ContactMessage['status']

// Component Props
export interface SupplierCardProps {
  supplier: Supplier
  showActions?: boolean
  compact?: boolean
}

export interface FeatureGateProps {
  flag: FeatureFlagId
  children: React.ReactNode
  fallback?: React.ReactNode
}

export interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}
