'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { SupplierCard, SupplierCardSkeleton } from '@/components/SupplierCard'
import { SupplierFilters } from '@/components/SupplierFilters'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import type { Supplier, Category, SupplierFilters as FilterType } from '@/lib/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse filters from URL
  const currentFilters: FilterType = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    hasDiscount: searchParams.get('hasDiscount') === 'true',
    featured: searchParams.get('featured') === 'true',
    tags: searchParams.getAll('tags'),
    sortBy: (searchParams.get('sortBy') as any) || 'name',
    sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12')
  }), [searchParams])

  // Fetch suppliers
  const fetchSuppliers = async (filters: FilterType) => {
    setIsLoading(true)
    
    try {
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

      const response = await fetch(`/api/suppliers?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers')
      }

      const data = await response.json()
      
      if (data.success) {
        setSuppliers(data.data || [])
        setPagination(data.pagination || pagination)
      } else {
        throw new Error(data.error || 'Failed to fetch suppliers')
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast.error('Failed to load suppliers. Please try again.')
      setSuppliers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories
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

  // Initial load
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch suppliers when filters change
  useEffect(() => {
    fetchSuppliers(currentFilters)
  }, [currentFilters])

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<FilterType>) => {
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 }
    const params = new URLSearchParams()

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    router.push(pathname)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (currentFilters.search) count++
    if (currentFilters.category) count++
    if (currentFilters.location) count++
    if (currentFilters.rating) count++
    if (currentFilters.hasDiscount) count++
    if (currentFilters.featured) count++
    if (currentFilters.tags && currentFilters.tags.length > 0) count++
    return count
  }, [currentFilters])

  // Get current category name
  const currentCategoryName = useMemo(() => {
    if (!currentFilters.category) return null
    const category = categories.find(c => c.id === currentFilters.category || c.slug === currentFilters.category)
    return category?.name
  }, [currentFilters.category, categories])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentCategoryName ? `${currentCategoryName} Suppliers` : 'Directory'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isLoading ? (
                  'Loading suppliers...'
                ) : (
                  `${pagination.total} verified suppliers${currentFilters.search ? ` for "${currentFilters.search}"` : ''}`
                )}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick Search */}
              <div className="relative flex-1 lg:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={currentFilters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value || undefined })}
                  className="form-input pl-10 w-full"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'btn-outline relative flex items-center space-x-2',
                  showFilters && 'bg-blue-50 text-blue-600 border-blue-600'
                )}
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Options */}
              <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button className="p-2 rounded-md bg-white text-gray-700 shadow-sm">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {currentFilters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{currentFilters.search}"
                  <button
                    onClick={() => updateFilters({ search: undefined })}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              {currentCategoryName && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {currentCategoryName}
                  <button
                    onClick={() => updateFilters({ category: undefined })}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              {currentFilters.hasDiscount && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Has Discount
                  <button
                    onClick={() => updateFilters({ hasDiscount: false })}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              {currentFilters.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Featured
                  <button
                    onClick={() => updateFilters({ featured: false })}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            'w-80 flex-shrink-0',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <div className="sticky top-8">
              <SupplierFilters
                categories={categories}
                currentFilters={currentFilters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  'Loading...'
                ) : (
                  `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} suppliers`
                )}
              </div>

              <select
                value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  updateFilters({ sortBy: sortBy as any, sortOrder: sortOrder as any })
                }}
                className="form-select text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="newest-desc">Newest First</option>
                <option value="popular-desc">Most Popular</option>
              </select>
            </div>

            {/* Suppliers Grid */}
            {isLoading ? (
              <div className="suppliers-grid">
                {[...Array(12)].map((_, index) => (
                  <SupplierCardSkeleton key={index} />
                ))}
              </div>
            ) : suppliers.length > 0 ? (
              <>
                <div className="suppliers-grid">
                  {suppliers.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      hasNext={pagination.hasNext}
                      hasPrev={pagination.hasPrev}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="No suppliers found"
                description={
                  activeFiltersCount > 0
                    ? "No suppliers match your current filters. Try adjusting your search criteria."
                    : "We couldn't find any suppliers at the moment. Please try again later."
                }
                actions={
                  activeFiltersCount > 0 ? (
                    <button onClick={clearFilters} className="btn-primary">
                      Clear Filters
                    </button>
                  ) : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
