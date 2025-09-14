'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  maxVisible?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  maxVisible = 7,
  className
}: PaginationProps) {
  // Generate page numbers to display
  const getVisiblePages = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const sidePages = Math.floor(maxVisible / 2)
    let startPage = Math.max(1, currentPage - sidePages)
    let endPage = Math.min(totalPages, currentPage + sidePages)

    // Adjust if we're near the beginning or end
    if (currentPage <= sidePages) {
      endPage = maxVisible
    }
    if (currentPage > totalPages - sidePages) {
      startPage = totalPages - maxVisible + 1
    }

    const pages = []
    
    // Always show first page
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('ellipsis-start')
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className={cn('flex items-center justify-between', className)}>
      {/* Mobile: Simple Previous/Next */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={cn(
            'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
            hasPrev
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          )}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={cn(
            'relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
            hasNext
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          )}
        >
          Next
        </button>
      </div>

      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page{' '}
            <span className="font-medium">{currentPage}</span>
            {' '}of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrev}
              className={cn(
                'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
                hasPrev
                  ? 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span
                    key={page}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                )
              }

              const isCurrentPage = page === currentPage

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                    isCurrentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  )}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            })}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              className={cn(
                'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
                hasNext
                  ? 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </nav>
  )
}

// Simple pagination component for smaller spaces
export function SimplePagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  className
}: Omit<PaginationProps, 'maxVisible'>) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={cn(
            'p-2 rounded-md border transition-colors duration-200',
            hasPrev
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={cn(
            'p-2 rounded-md border transition-colors duration-200',
            hasNext
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}