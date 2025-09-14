import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind CSS class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('en-GB', { ...defaultOptions, ...options }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

// Generate slug from string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// Calculate average rating
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

// Generate star rating display
export function generateStarRating(rating: number): { filled: number; half: boolean; empty: number } {
  const filled = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - filled - (half ? 1 : 0)
  
  return { filled, half, empty }
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate UK postcode
export function isValidUKPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  return postcodeRegex.test(postcode.replace(/\s/g, ''))
}

// Format UK postcode
export function formatUKPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  } else if (cleaned.length === 7) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`
  }
  return postcode
}

// Validate UK phone number
export function isValidUKPhone(phone: string): boolean {
  const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format UK phone number
export function formatUKPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('44')) {
    const number = cleaned.slice(2)
    return `+44 ${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`
  } else if (cleaned.startsWith('07')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  return phone
}

// Generate random ID
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Calculate distance between two postcodes (simplified)
export function calculateDistance(postcode1: string, postcode2: string): number {
  // This is a simplified implementation
  // In production, you'd use a proper geocoding service
  const area1 = postcode1.slice(0, 2).toUpperCase()
  const area2 = postcode2.slice(0, 2).toUpperCase()
  
  if (area1 === area2) return Math.random() * 10 // 0-10 miles
  
  // London postcodes
  const londonAreas = ['E1', 'EC', 'N1', 'NW', 'SE', 'SW', 'W1', 'WC']
  if (londonAreas.includes(area1) && londonAreas.includes(area2)) {
    return Math.random() * 25 // 0-25 miles within London
  }
  
  return Math.random() * 200 + 10 // 10-210 miles for different areas
}

// Convert array to comma-separated string
export function arrayToString(arr: string[], conjunction: string = 'and'): string {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`
  
  const lastItem = arr[arr.length - 1]
  const otherItems = arr.slice(0, -1).join(', ')
  return `${otherItems}, ${conjunction} ${lastItem}`
}

// Extract initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Convert file size to human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Sleep function for delays
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Convert camelCase to Title Case
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// Check if string is empty or whitespace
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0
}

// Remove duplicates from array
export function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

// Sort array of objects by property
export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// Group array by property
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// Generate avatar URL from initials
export function generateAvatarUrl(name: string): string {
  const initials = getInitials(name)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0ea5e9&color=white&size=128`
}
