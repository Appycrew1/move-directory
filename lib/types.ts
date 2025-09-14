export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          role: 'user' | 'admin' | 'supplier'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'supplier'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'supplier'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          phone: string | null
          email: string | null
          address: string | null
          city: string | null
          postcode: string | null
          logo_url: string | null
          categories: string[]
          services: string[]
          coverage_areas: string[]
          minimum_order: number | null
          established_year: number | null
          staff_count: string | null
          certifications: string[]
          avg_rating: number | null
          total_reviews: number
          is_verified: boolean
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          postcode?: string | null
          logo_url?: string | null
          categories?: string[]
          services?: string[]
          coverage_areas?: string[]
          minimum_order?: number | null
          established_year?: number | null
          staff_count?: string | null
          certifications?: string[]
          avg_rating?: number | null
          total_reviews?: number
          is_verified?: boolean
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          postcode?: string | null
          logo_url?: string | null
          categories?: string[]
          services?: string[]
          coverage_areas?: string[]
          minimum_order?: number | null
          established_year?: number | null
          staff_count?: string | null
          certifications?: string[]
          avg_rating?: number | null
          total_reviews?: number
          is_verified?: boolean
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          supplier_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          verified_purchase: boolean
          helpful_count: number
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          verified_purchase?: boolean
          helpful_count?: number
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quote_requests: {
        Row: {
          id: string
          user_id: string
          supplier_id: string
          service_type: string
          move_date: string | null
          move_from: string
          move_to: string
          property_size: string
          special_requirements: string | null
          budget_range: string | null
          contact_preference: 'email' | 'phone' | 'both'
          status: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'declined'
          commission_rate: number | null
          commission_amount: number | null
          quote_value: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          supplier_id: string
          service_type: string
          move_date?: string | null
          move_from: string
          move_to: string
          property_size: string
          special_requirements?: string | null
          budget_range?: string | null
          contact_preference?: 'email' | 'phone' | 'both'
          status?: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'declined'
          commission_rate?: number | null
          commission_amount?: number | null
          quote_value?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          supplier_id?: string
          service_type?: string
          move_date?: string | null
          move_from?: string
          move_to?: string
          property_size?: string
          special_requirements?: string | null
          budget_range?: string | null
          contact_preference?: 'email' | 'phone' | 'both'
          status?: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'declined'
          commission_rate?: number | null
          commission_amount?: number | null
          quote_value?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feature_flags: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          phase: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          phase?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          phase?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          supplier_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          supplier_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          supplier_id?: string
          created_at?: string
        }
      }
      comparisons: {
        Row: {
          id: string
          user_id: string
          supplier_ids: string[]
          ai_analysis: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          supplier_ids: string[]
          ai_analysis?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          supplier_ids?: string[]
          ai_analysis?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin' | 'supplier'
      quote_status: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'declined'
      contact_preference: 'email' | 'phone' | 'both'
    }
  }
}

// Utility types
export type Supplier = Database['public']['Tables']['suppliers']['Row']
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert']
export type SupplierUpdate = Database['public']['Tables']['suppliers']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row']
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert']
export type QuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update']

export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row']
export type FeatureFlagInsert = Database['public']['Tables']['feature_flags']['Insert']
export type FeatureFlagUpdate = Database['public']['Tables']['feature_flags']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Comparison = Database['public']['Tables']['comparisons']['Row']

// Extended types with relations
export type SupplierWithStats = Supplier & {
  reviews?: Review[]
  quote_requests?: QuoteRequest[]
  is_favorited?: boolean
}

export type ReviewWithUser = Review & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>
}

export type QuoteRequestWithDetails = QuoteRequest & {
  supplier: Pick<Supplier, 'name' | 'logo_url' | 'email' | 'phone'>
  user: Pick<Profile, 'full_name' | 'email' | 'phone'>
}

// Search and filter types
export interface SupplierFilters {
  categories?: string[]
  services?: string[]
  coverage_areas?: string[]
  min_rating?: number
  is_verified?: boolean
  min_established_year?: number
  search?: string
  sort_by?: 'name' | 'rating' | 'reviews' | 'established'
  sort_order?: 'asc' | 'desc'
}

export interface SearchResults {
  suppliers: SupplierWithStats[]
  total: number
  page: number
  limit: number
  filters: SupplierFilters
}

// AI Comparison types
export interface AIComparisonResult {
  summary: string
  strengths: Record<string, string[]>
  weaknesses: Record<string, string[]>
  recommendations: string[]
  best_for: Record<string, string>
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Form types
export interface ContactForm {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export interface SupplierApplicationForm {
  name: string
  description: string
  website?: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  categories: string[]
  services: string[]
  coverage_areas: string[]
  established_year?: number
  staff_count?: string
  certifications?: string[]
  terms_accepted: boolean
}

// Dashboard types
export interface DashboardStats {
  total_suppliers: number
  total_reviews: number
  total_quote_requests: number
  pending_quotes: number
  commission_earned: number
  conversion_rate: number
}

export interface AdminDashboardData {
  stats: DashboardStats
  recent_suppliers: Supplier[]
  recent_reviews: ReviewWithUser[]
  recent_quotes: QuoteRequestWithDetails[]
  feature_flags: FeatureFlag[]
}
