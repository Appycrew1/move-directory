'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import { 
  HeartIcon,
  TrashIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/20/solid'
import { SupplierCard, SupplierCardSkeleton } from '@/components/SupplierCard'
import { NoFavoritesYet, LoadingState, ErrorState } from '@/components/EmptyState'
import { favorites, cn } from '@/lib/utils'
import type { Supplier } from '@/lib/types'
import toast from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View and manage your favorite suppliers.',
}

export default function FavoritesPage() {
  const [favoriteSuppliers, setFavoriteSuppliers] = useState<Supplier[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date_added' | 'rating'>('date_added')

  // Update favorite IDs from localStorage
  useEffect(() => {
    const updateFavoriteIds = () => {
      const ids = favorites.get()
      setFavoriteIds(ids)
    }

    updateFavoriteIds()
    
    const handleStorageChange = () => updateFavoriteIds()
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(updateFavoriteIds, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Fetch supplier details when favorite IDs change
  const fetchFavoriteSuppliers = async (supplierIds: string[]) => {
    if (supplierIds.length === 0) {
      setFavoriteSuppliers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch suppliers in batches to avoid URL length limits
      const batchSize = 10
      const batches = []
      
      for (let i = 0; i < supplierIds.length; i += batchSize) {
        batches.push(supplierIds.slice(i, i + batchSize))
      }

      const allSuppliers: Supplier[] = []
      
      for (const batch of batches) {
        const params = new URLSearchParams()
        batch.forEach(id => params.append('id', id))
        
        const response = await fetch(`/api/suppliers?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers')
        }

        const data = await response.json()
        
        if (data.success) {
          allSuppliers.push(...(data.data || []))
        }
      }

      // Sort suppliers to match the order in favoriteIds
      const sortedSuppliers = supplierIds
        .map(id => allSuppliers.find(supplier => supplier.id === id))
        .filter(Boolean) as Supplier[]

      setFavoriteSuppliers(sortedSuppliers)
    } catch (error: any) {
      console.error('Error fetching favorite suppliers:', error)
      setError(error.message)
      setFavoriteSuppliers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch suppliers when favorite IDs change
  useEffect(() => {
    fetchFavoriteSuppliers(favoriteIds)
  }, [favoriteIds])

  // Filter and sort suppliers
  const filteredAndSortedSuppliers = favoriteSuppliers
    .filter(supplier => {
      const matchesSearch = !searchQuery || 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !categoryFilter || 
        supplier.category?.id === categoryFilter ||
        supplier.category?.slug === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating_average - a.rating_average
        case 'date_added':
        default:
          // Sort by order in favorites (most recently added first)
          const indexA = favoriteIds.indexOf(a.id)
          const indexB = favoriteIds.indexOf(b.id)
          return indexA - indexB
      }
    })

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.clear()
      toast.success('All favorites cleared')
    }
  }

  const handleRemoveFavorite = (supplierId: string) => {
    favorites.remove(supplierId)
    toast.success('Removed from favorites')
  }

  // Get unique categories from favorites
  const availableCategories = Array.from(
    new Set(
      favoriteSuppliers
        .map(supplier => supplier.category)
        .filter(Boolean)
        .map(category => category!.id)
    )
  ).map(categoryId => 
    favoriteSuppliers.find(supplier => supplier.category?.id === categoryId)?.category
  ).filter(Boolean)

  if (isLoading && favoriteIds.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <LoadingState title="Loading favorites..." description="Fetching your saved suppliers" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <ErrorState 
            title="Failed to load favorites"
            description={error}
            onRetry={() => fetchFavoriteSuppliers(favoriteIds)}
          />
        </div>
      </div>
    )
  }

  if (favoriteSuppliers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <NoFavoritesYet />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <HeartIconSolid className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Favorites
              </h1>
              <p className="text-gray-600">
                {favoriteSuppliers.length} saved suppliers
              </p>
            </div>
          </div>

          <button
            onClick={handleClearAllFavorites}
            className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            {availableCategories.length > 1 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category!.id} value={category!.id}>
                    {category!.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-select"
            >
              <option value="date_added">Recently Added</option>
              <option value="name">Name (A-Z)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredAndSortedSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <EyeSlashIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-600 mb-6">
              No favorites match your current search and filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('')
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
              <a href="/" className="btn-primary">
                Browse More Suppliers
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Suppliers Grid */}
            <div className="suppliers-grid">
              {filteredAndSortedSuppliers.map((supplier) => (
                <div key={supplier.id} className="relative">
                  <SupplierCard supplier={supplier} />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFavorite(supplier.id)}
                    className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Showing {filteredAndSortedSuppliers.length} of {favoriteSuppliers.length} favorites
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/" className="btn-primary">
                  Browse More Suppliers
                </a>
                <a href="/compare" className="btn-outline">
                  Compare Selected
                </a>
              </div>
            </div>
          </>
        )}

        {/* Tips */}
        <div className="mt-12 card p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 Tips for managing favorites
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Use the compare feature to evaluate multiple suppliers side by side</li>
            <li>• Click on any supplier to view detailed information and contact them</li>
            <li>• Your favorites are saved locally and will persist across browser sessions</li>
            <li>• Create an account to sync favorites across devices and access exclusive features</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
