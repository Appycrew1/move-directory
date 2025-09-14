'use client'

import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  SparklesIcon,
  CheckIcon,
  XIcon as XIconOutline,
  StarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  CheckBadgeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Metadata } from 'next'
import { compareSuppliers, getSupplierLogoUrl, cn, formatRating } from '@/lib/utils'
import { NoComparisonItems, LoadingState, ErrorState } from '@/components/EmptyState'
import { FeatureGate } from '@/components/providers/FeatureFlagProvider'
import type { Supplier, AIComparison } from '@/lib/types'
import toast from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Compare Suppliers',
  description: 'Compare moving industry suppliers side by side with AI-powered recommendations to make informed decisions.',
}

export default function ComparePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [aiComparison, setAiComparison] = useState<AIComparison | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Update compare IDs from localStorage
  useEffect(() => {
    const updateCompareIds = () => {
      const ids = compareSuppliers.get()
      setCompareIds(ids)
    }

    updateCompareIds()
    
    const handleStorageChange = () => updateCompareIds()
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(updateCompareIds, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Fetch supplier details
  const fetchSuppliers = async (supplierIds: string[]) => {
    if (supplierIds.length === 0) {
      setSuppliers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/suppliers?ids=${supplierIds.join(',')}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers')
      }

      const data = await response.json()
      
      if (data.success) {
        setSuppliers(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to fetch suppliers')
      }
    } catch (error: any) {
      console.error('Error fetching suppliers:', error)
      setError(error.message)
      setSuppliers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch suppliers when compareIds change
  useEffect(() => {
    fetchSuppliers(compareIds)
  }, [compareIds])

  // Remove supplier from comparison
  const handleRemoveSupplier = (supplierId: string) => {
    compareSuppliers.remove(supplierId)
    setAiComparison(null) // Clear AI comparison when suppliers change
    toast.success('Supplier removed from comparison')
  }

  // Clear all comparisons
  const handleClearAll = () => {
    compareSuppliers.clear()
    setAiComparison(null)
    toast.success('Comparison cleared')
  }

  // Generate AI comparison
  const handleGenerateAIComparison = async () => {
    if (suppliers.length < 2) {
      toast.error('At least 2 suppliers are required for AI comparison')
      return
    }

    setIsGeneratingAI(true)

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_ids: suppliers.map(s => s.id)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate comparison')
      }

      if (data.success) {
        setAiComparison(data.data)
        toast.success('AI comparison generated!')
      } else {
        throw new Error(data.error || 'Failed to generate comparison')
      }
    } catch (error: any) {
      console.error('Error generating AI comparison:', error)
      toast.error(error.message || 'Failed to generate AI comparison')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <LoadingState title="Loading comparison..." description="Fetching supplier details" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <ErrorState 
            title="Failed to load suppliers"
            description={error}
            onRetry={() => fetchSuppliers(compareIds)}
          />
        </div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <NoComparisonItems />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Compare Suppliers
            </h1>
            <p className="text-gray-600 mt-1">
              Compare {suppliers.length} suppliers side by side
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <FeatureGate flag="ai_comparison">
              <button
                onClick={handleGenerateAIComparison}
                disabled={isGeneratingAI || suppliers.length < 2}
                className={cn(
                  'btn-primary flex items-center space-x-2',
                  (isGeneratingAI || suppliers.length < 2) && 'btn-disabled'
                )}
              >
                {isGeneratingAI ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <SparklesIcon className="h-4 w-4" />
                )}
                <span>
                  {isGeneratingAI ? 'Generating...' : 'AI Compare'}
                </span>
              </button>
            </FeatureGate>

            <button
              onClick={handleClearAll}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* AI Comparison Results */}
        {aiComparison && (
          <div className="card p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Analysis</h2>
              <span className="text-xs text-gray-500">
                Generated {new Date(aiComparison.generated_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {aiComparison.suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{supplier.name}</h3>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Strengths:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {supplier.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="h-3 w-3 text-green-600 mt-0.5 mr-1 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {supplier.cons.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-orange-700 mb-1">Considerations:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {supplier.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <XIconOutline className="h-3 w-3 text-orange-500 mt-0.5 mr-1 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-md p-2">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Best For:</h4>
                    <p className="text-sm text-blue-700">{supplier.bestFor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Recommendation</h3>
              <p className="text-gray-700 leading-relaxed">{aiComparison.recommendation}</p>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Supplier
                  </th>
                  {suppliers.map((supplier) => (
                    <th key={supplier.id} className="px-6 py-4 text-center w-72">
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveSupplier(supplier.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors duration-200"
                          title="Remove from comparison"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mb-2">
                            <img
                              src={getSupplierLogoUrl(supplier.logo_url)}
                              alt={`${supplier.name} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {supplier.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {supplier.category?.name}
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Basic Information */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Summary
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {supplier.short_summary || supplier.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Rating
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <StarIconSolid
                              key={index}
                              className={cn(
                                'h-4 w-4',
                                index < Math.floor(supplier.rating_average)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {formatRating(supplier.rating_average)} ({supplier.rating_count})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Verification Status */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Verification
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {supplier.verified_business && (
                          <div className="flex items-center text-green-600">
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Business</span>
                          </div>
                        )}
                        {supplier.verified_insurance && (
                          <div className="flex items-center text-blue-600">
                            <ShieldCheckIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Insured</span>
                          </div>
                        )}
                        {!supplier.verified_business && !supplier.verified_insurance && (
                          <span className="text-xs text-gray-500">Pending</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Founded Year */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Founded
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {supplier.founded_year || 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Team Size */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Team Size
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {supplier.employee_count || 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Pricing */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Pricing
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                      {supplier.pricing_model || 'Contact for pricing'}
                    </td>
                  ))}
                </tr>

                {/* Discounts */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Discounts
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center">
                      {supplier.has_discount ? (
                        <div>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <TagIcon className="h-3 w-3 mr-1" />
                            Available
                          </div>
                          {supplier.discount_description && (
                            <p className="text-xs text-gray-600 mt-1">
                              {supplier.discount_description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No discounts</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Contact Actions */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Actions
                  </td>
                  {suppliers.map((supplier) => (
                    <td key={supplier.id} className="px-6 py-4 text-center">
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/suppliers/${supplier.slug}`}
                          className="btn-primary btn-sm"
                        >
                          View Details
                        </Link>
                        
                        {supplier.website_url && (
                          <a
                            href={supplier.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline btn-sm flex items-center justify-center space-x-1"
                          >
                            <GlobeAltIcon className="h-3 w-3" />
                            <span>Website</span>
                          </a>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Suppliers */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to compare more suppliers? You can add up to {3 - suppliers.length} more.
          </p>
          <Link href="/" className="btn-outline">
            Browse More Suppliers
          </Link>
        </div>
      </div>
    </div>
  )
}
