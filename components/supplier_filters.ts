'use client'

import { useState } from 'react'
import { StarIcon, TagIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import type { Category, SupplierFilters as FilterType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SupplierFiltersProps {
  categories: Category[]
  currentFilters: FilterType
  onFiltersChange: (filters: Partial<FilterType>) => void
  onClearFilters: () => void
}

const popularTags = [
  'CRM', 'Insurance', 'Fleet Management', 'Packing Materials',
  'Storage', 'Marketing', 'Legal Services', 'Accounting',
  'HR Software', 'Booking System', 'GPS Tracking', 'Fuel Cards'
]

const locationSuggestions = [
  'London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool',
  'Bristol', 'Sheffield', 'Leeds', 'Edinburgh', 'Cardiff'
]

export function SupplierFilters({
  categories,
  currentFilters,
  onFiltersChange,
  onClearFilters
}: SupplierFiltersProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const [customLocation, setCustomLocation] = useState(currentFilters.location || '')

  const handleLocationChange = (location: string) => {
    setCustomLocation(location)
    onFiltersChange({ location: location || undefined })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = currentFilters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    
    onFiltersChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const handleRatingChange = (rating: number) => {
    const newRating = currentFilters.rating === rating ? undefined : rating
    onFiltersChange({ rating: newRating })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={!currentFilters.category}
              onChange={() => onFiltersChange({ category: undefined })}
              className="form-radio text-blue-600"
            />
            <span className="ml-3 text-sm text-gray-700">All Categories</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={currentFilters.category === category.id || currentFilters.category === category.slug}
                onChange={() => onFiltersChange({ category: category.id })}
                className="form-radio text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={currentFilters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="sr-only"
              />
              <div className={cn(
                'flex items-center space-x-2 p-2 rounded-md transition-colors duration-200',
                currentFilters.rating === rating
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              )}>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={cn(
                        'h-4 w-4',
                        index < rating
                          ? currentFilters.rating === rating
                            ? 'text-blue-600'
                            : 'text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Special Filters</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentFilters.featured || false}
              onChange={(e) => onFiltersChange({ featured: e.target.checked || undefined })}
              className="form-checkbox text-blue-600"
            />
            <SparklesIcon className="h-4 w-4 text-purple-500 ml-3 mr-2" />
            <span className="text-sm text-gray-700">Featured Suppliers</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentFilters.hasDiscount || false}
              onChange={(e) => onFiltersChange({ hasDiscount: e.target.checked || undefined })}
              className="form-checkbox text-blue-600"
            />
            <TagIcon className="h-4 w-4 text-red-500 ml-3 mr-2" />
            <span className="text-sm text-gray-700">Has Discounts</span>
          </label>
        </div>
      </div>

      {/* Location Filter */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
        <div className="space-y-3">
          <div className="relative">
            <MapPinIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter city or region"
              value={customLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="form-input pl-10 text-sm"
            />
          </div>
          
          {/* Popular Locations */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Popular locations:</p>
            <div className="flex flex-wrap gap-1">
              {locationSuggestions.slice(0, 6).map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                    currentFilters.location === location
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Services & Tags
          {currentFilters.tags && currentFilters.tags.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {currentFilters.tags.length}
            </span>
          )}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {(showAllTags ? popularTags : popularTags.slice(0, 8)).map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={cn(
                'px-2 py-1 text-xs rounded-md transition-colors duration-200 border',
                currentFilters.tags?.includes(tag)
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {popularTags.length > 8 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showAllTags ? 'Show Less' : `Show ${popularTags.length - 8} More`}
          </button>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full btn-outline text-sm"
      >
        Clear All Filters
      </button>

      {/* Filter Summary */}
      {(currentFilters.search || 
        currentFilters.category || 
        currentFilters.location || 
        currentFilters.rating || 
        currentFilters.hasDiscount || 
        currentFilters.featured ||
        (currentFilters.tags && currentFilters.tags.length > 0)) && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Active Filters</h4>
          <div className="space-y-1 text-sm text-blue-800">
            {currentFilters.search && (
              <div>Search: "{currentFilters.search}"</div>
            )}
            {currentFilters.location && (
              <div>Location: {currentFilters.location}</div>
            )}
            {currentFilters.rating && (
              <div>Rating: {currentFilters.rating}+ stars</div>
            )}
            {currentFilters.hasDiscount && (
              <div>Has discounts available</div>
            )}
            {currentFilters.featured && (
              <div>Featured suppliers only</div>
            )}
            {currentFilters.tags && currentFilters.tags.length > 0 && (
              <div>Tags: {currentFilters.tags.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}