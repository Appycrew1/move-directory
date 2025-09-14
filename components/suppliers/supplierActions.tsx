'use client'

import { useState, useEffect } from 'react'
import { HeartIcon, ScaleIcon, ShareIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { favorites, compareSuppliers, cn } from '@/lib/utils'
import type { Supplier } from '@/lib/types'
import toast from 'react-hot-toast'

interface SupplierActionsProps {
  supplier: Supplier
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SupplierActions({ 
  supplier, 
  size = 'md', 
  className 
}: SupplierActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [canAddToCompare, setCanAddToCompare] = useState(true)

  // Update states when localStorage changes
  useEffect(() => {
    const updateStates = () => {
      setIsFavorited(favorites.has(supplier.id))
      setIsComparing(compareSuppliers.has(supplier.id))
      setCanAddToCompare(compareSuppliers.canAdd() || compareSuppliers.has(supplier.id))
    }

    updateStates()
    
    const handleStorageChange = () => updateStates()
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(updateStates, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [supplier.id])

  const handleToggleFavorite = () => {
    const wasAdded = favorites.toggle(supplier.id)
    setIsFavorited(wasAdded)
    
    toast.success(
      wasAdded ? 'Added to favorites' : 'Removed from favorites',
      { duration: 2000 }
    )
  }

  const handleToggleCompare = () => {
    if (isComparing) {
      compareSuppliers.remove(supplier.id)
      setIsComparing(false)
      toast.success('Removed from comparison')
    } else if (compareSuppliers.canAdd()) {
      compareSuppliers.add(supplier.id)
      setIsComparing(true)
      toast.success('Added to comparison')
    } else {
      toast.error('You can only compare up to 3 suppliers')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: supplier.name,
          text: supplier.short_summary || `Check out ${supplier.name} on Moving Suppliers Hub`,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled or share failed
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const sizeClasses = {
    sm: {
      button: 'p-2',
      icon: 'h-4 w-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-3',
      icon: 'h-5 w-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-4',
      icon: 'h-6 w-6',
      text: 'text-base'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className={cn(
          'rounded-lg border transition-all duration-200 flex items-center space-x-2',
          classes.button,
          isFavorited
            ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-300'
        )}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? (
          <HeartIconSolid className={classes.icon} />
        ) : (
          <HeartIcon className={classes.icon} />
        )}
        <span className={cn('hidden sm:inline', classes.text)}>
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      </button>

      {/* Compare Button */}
      <button
        onClick={handleToggleCompare}
        disabled={!canAddToCompare && !isComparing}
        className={cn(
          'rounded-lg border transition-all duration-200 flex items-center space-x-2',
          classes.button,
          isComparing
            ? 'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100'
            : canAddToCompare
            ? 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300'
            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
        title={
          isComparing 
            ? 'Remove from comparison' 
            : canAddToCompare 
            ? 'Add to comparison' 
            : 'Maximum 3 suppliers can be compared'
        }
      >
        <ScaleIcon className={classes.icon} />
        <span className={cn('hidden sm:inline', classes.text)}>
          {isComparing ? 'Comparing' : 'Compare'}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className={cn(
          'rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 flex items-center space-x-2',
          classes.button
        )}
        title="Share supplier"
      >
        <ShareIcon className={classes.icon} />
        <span className={cn('hidden sm:inline', classes.text)}>
          Share
        </span>
      </button>
    </div>
  )
}
