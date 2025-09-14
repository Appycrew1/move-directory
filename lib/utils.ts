import { clsx, type ClassValue } from 'clsx'
import type { FeatureFlagId, Supplier, SupplierFilters } from './types'

// Tailwind CSS class merger
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Feature flag utilities
let cachedFeatureFlags: Record<string, boolean> = {}

export async function isFeatureEnabled(flagId: FeatureFlagId): Promise<boolean> {
  // Check cache first
  if (flagId in cachedFeatureFlags) {
    return cachedFeatureFlags[flagId]
  }

  try {
    const response = await fetch(`/api/feature-flags/${flagId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      console.warn(`Failed to fetch feature flag: ${flagId}`)
      return false
    }
    
    const data = await response.json()
    const enabled = data.enabled || false
    
    // Cache the result
    cachedFeatureFlags[flagId] = enabled
    return enabled
  } catch (error) {
    console.error(`Error checking feature flag ${flagId}:`, error)
    return false
  }
}

// Clear feature flag cache (useful when toggling flags in admin)
export function clearFeatureFlagCache() {
  cachedFeatureFlags = {}
}

// Local storage utilities (for favorites, compare, etc.)
export const localStorage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error)
      return null
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }
}

// Favorites management
export const favorites = {
  get: (): string[] => localStorage.get('favorites') || [],
  
  add: (supplierId: string) => {
    const current = favorites.get()
    if (!current.includes(supplierId)) {
      localStorage.set('favorites', [...current, supplierId])
    }
  },
  
  remove: (supplierId: string) => {
    const current = favorites.get()
    localStorage.set('favorites', current.filter(id => id !== supplierId))
  },
  
  toggle: (supplierId: string) => {
    const current = favorites.get()
    if (current.includes(supplierId)) {
      favorites.remove(supplierId)
      return false
    } else {
      favorites.add(supplierId)
      return true
    }
  },
  
  has: (supplierId: string): boolean => {
    return favorites.get().includes(supplierId)
  },
  
  clear: () => localStorage.remove('favorites')
}

// Compare suppliers management
export const compareSuppliers = {
  get: (): string[] => localStorage.get('compare') || [],
  
  add: (supplierId: string): boolean => {
    const current = compareSuppliers.get()
    if (current.length >= 3) return false // Max 3 suppliers
    if (!current.includes(supplierId)) {
      localStorage.set('compare', [...current, supplierId])
      return true
    }
    return false
  },
  
  remove: (supplierId: string) => {
    const current = compareSuppliers.get()
    localStorage.set('compare', current.filter(id => id !== supplierId))
  },
  
  toggle: (supplierId: string): boolean => {
    const current = compareSuppliers.get()
    if (current.includes(supplierId)) {
      compareSuppliers.remove(supplierId)
      return false
    } else {
      return compareSuppliers.add(supplierId)
    }
  },
  
  has: (supplierId: string): boolean => {
    return compareSuppliers.get().includes(supplierId)
  },
  
  clear: () => localStorage.remove('compare'),
  
  canAdd: (): boolean => compareSuppliers.get().length < 3
}

// URL and slug utilities
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateString)
}

// Number formatting
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatPrice(price: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

// Search and filter utilities
export function buildSupplierQuery(filters: SupplierFilters) {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else {
        params.append(key, value.toString())
      }
    }
  })
  
  return params.toString()
}

export function parseSupplierFilters(searchParams: URLSearchParams): SupplierFilters {
  return {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    hasDiscount: searchParams.get('hasDiscount') === 'true',
    featured: searchParams.get('featured') === 'true',
    tags: searchParams.getAll('tags'),
    sortBy: (searchParams.get('sortBy') as any) || 'name',
    sortOrder: (searchParams.get('sortOrder') as any) || 'asc'
  }
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone.trim())
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Error handling
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      code: error.code
    }
  }
  
  if (error.code === 'PGRST116') {
    return {
      error: 'Record not found',
      statusCode: 404,
      code: 'NOT_FOUND'
    }
  }
  
  if (error.code === '23505') {
    return {
      error: 'This record already exists',
      statusCode: 409,
      code: 'DUPLICATE'
    }
  }
  
  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
    code: 'INTERNAL_ERROR'
  }
}

// Analytics and tracking
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
  
  // Add other analytics providers here (Mixpanel, Amplitude, etc.)
  console.log(`Event: ${eventName}`, properties)
}

// SEO utilities
export function generateMetaTitle(title: string, siteName = 'Moving Suppliers Hub'): string {
  return `${title} | ${siteName}`
}

export function generateMetaDescription(description: string, maxLength = 160): string {
  return truncateText(description, maxLength)
}

// Supplier utilities
export function getSupplierUrl(supplier: { slug: string }): string {
  return `/suppliers/${supplier.slug}`
}

export function getSupplierLogoUrl(logoUrl?: string): string {
  if (logoUrl) return logoUrl
  return '/images/default-logo.png' // Fallback logo
}

export function calculateSupplierScore(supplier: Supplier): number {
  let score = 0
  
  // Base score from rating
  score += supplier.rating_average * 20 // Max 100 from rating
  
  // Bonuses
  if (supplier.verified_business) score += 10
  if (supplier.verified_insurance) score += 10
  if (supplier.description && supplier.description.length > 100) score += 5
  if (supplier.logo_url) score += 5
  if (supplier.review_count && supplier.review_count > 5) score += 10
  
  return Math.min(score, 100) // Cap at 100
}

// Export commonly used constants
export const ITEMS_PER_PAGE = 12
export const MAX_COMPARE_ITEMS = 3
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Type guards
export function isSupplier(obj: any): obj is Supplier {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj && 'status' in obj
}