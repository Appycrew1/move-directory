'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actions?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  className,
  size = 'md'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-8 w-8',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'h-12 w-12',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'h-16 w-16',
      title: 'text-2xl',
      description: 'text-lg'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn(
      'text-center',
      classes.container,
      className
    )}>
      {Icon && (
        <div className="mx-auto mb-4">
          <Icon className={cn(
            'text-gray-400',
            classes.icon
          )} />
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold text-gray-900 mb-2',
        classes.title
      )}>
        {title}
      </h3>
      
      <p className={cn(
        'text-gray-600 max-w-md mx-auto mb-6',
        classes.description
      )}>
        {description}
      </p>
      
      {actions && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions}
        </div>
      )}
    </div>
  )
}

// Specific empty state variants
export function NoSuppliersFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 20L28 28M28 20L20 28M24 4C35.045 4 44 12.955 44 24S35.045 44 24 44S4 35.045 4 24S12.955 4 24 4Z"
          />
        </svg>
      )}
      title="No suppliers found"
      description="We couldn't find any suppliers matching your criteria. Try adjusting your filters or search terms."
      actions={onClearFilters && (
        <button onClick={onClearFilters} className="btn-primary">
          Clear Filters
        </button>
      )}
    />
  )
}

export function NoFavoritesYet() {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20.84 4.61a5.5 5.5 0 017.32 0L44 18.9a2 2 0 010 3.17l-8.928 7.44a2 2 0 01-2.144 0L24 24l-8.928 5.47a2 2 0 01-2.144 0L4 18.9a2 2 0 010-3.17L20.84 4.61z"
          />
        </svg>
      )}
      title="No favorites yet"
      description="Start exploring suppliers and save your favorites for easy access later."
      actions={
        <a href="/" className="btn-primary">
          Browse Suppliers
        </a>
      }
    />
  )
}

export function NoComparisonItems() {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 3v14h7V3H9zm23 0v18h7V3h-7zM9 21v18h7V21H9zm14-18v18h7V3h-7z"
          />
        </svg>
      )}
      title="No suppliers to compare"
      description="Add suppliers to your comparison list to see them side by side with AI-powered recommendations."
      actions={
        <a href="/" className="btn-primary">
          Browse Suppliers
        </a>
      }
    />
  )
}

export function LoadingState({ title = "Loading...", description = "Please wait while we fetch your data." }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
        <div className="spinner w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading your data.", 
  onRetry 
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      title={title}
      description={description}
      actions={onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    />
  )
}