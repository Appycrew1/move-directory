'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { SupplierCard, SupplierCardSkeleton } from '@/components/SupplierCard'
import type { Supplier } from '@/lib/types'

interface RelatedSuppliersProps {
  currentSupplier: Supplier
  maxSuppliers?: number
}

export function RelatedSuppliers({ currentSupplier, maxSuppliers = 4 }: RelatedSuppliersProps) {
  const [relatedSuppliers, setRelatedSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedSuppliers = async () => {
      setIsLoading(true)

      try {
        // Build query parameters for related suppliers
        const params = new URLSearchParams({
          category: currentSupplier.category?.id || '',
          limit: String(maxSuppliers + 2), // Get a few extra in case we need to filter
        })

        const response = await fetch(`/api/suppliers?${params.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.success) {
            // Filter out the current supplier and limit results
            const filtered = (data.data || [])
              .filter((supplier: Supplier) => supplier.id !== currentSupplier.id)
              .slice(0, maxSuppliers)
            
            setRelatedSuppliers(filtered)
          }
        }
      } catch (error) {
        console.error('Error fetching related suppliers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedSuppliers()
  }, [currentSupplier.id, currentSupplier.category?.id, maxSuppliers])

  if (isLoading) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Related Suppliers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SupplierCardSkeleton key={index} compact />
          ))}
        </div>
      </div>
    )
  }

  if (relatedSuppliers.length === 0) {
    return null
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Related Suppliers
        </h2>
        
        {currentSupplier.category && (
          <Link
            href={`/suppliers?category=${currentSupplier.category.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <span>View all {currentSupplier.category.name}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedSuppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            compact
          />
        ))}
      </div>

      {relatedSuppliers.length === maxSuppliers && currentSupplier.category && (
        <div className="mt-6 text-center">
          <Link
            href={`/suppliers?category=${currentSupplier.category.slug}`}
            className="btn-outline"
          >
            Browse More {currentSupplier.category.name} Suppliers
          </Link>
        </div>
      )}
    </div>
  )
}
