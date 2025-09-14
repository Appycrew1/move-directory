'use client'

import { useState, useEffect } from 'react'
import { StarIcon, PlusIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import { useAuth } from '@/hooks/useAuth'
import { reviewSchema } from '@/lib/validations'
import { cn, formatDate } from '@/lib/utils'
import type { Supplier, Review } from '@/lib/types'
import toast from 'react-hot-toast'

interface SupplierReviewsProps {
  supplier: Supplier
}

export function SupplierReviews({ supplier }: SupplierReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(supplier.reviews || [])
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    company_name: ''
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Check if user has already reviewed this supplier
  const userHasReviewed = reviews.some(review => review.user_id === user?.id)

  const validateReviewForm = () => {
    const newErrors: Record<string, string> = {}

    try {
      reviewSchema.parse({
        ...reviewForm,
        supplier_id: supplier.id
      })
    } catch (error: any) {
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
    }

    setReviewErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please sign in to write a review')
      return
    }

    if (!validateReviewForm()) {
      return
    }

    setIsSubmittingReview(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewForm,
          supplier_id: supplier.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      if (data.success) {
        toast.success('Review submitted successfully!')
        
        // Add new review to list
        setReviews(prev => [data.data, ...prev])
        
        // Reset form
        setReviewForm({
          rating: 0,
          title: '',
          content: '',
          company_name: ''
        })
        setShowWriteReview(false)
        setReviewErrors({})
      } else {
        throw new Error(data.error || 'Failed to submit review')
      }
    } catch (error: any) {
      console.error('Error submitting review:', error)
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleReviewInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setReviewForm(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (reviewErrors[name]) {
      setReviewErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={cn(
              interactive 
                ? 'hover:scale-110 transition-transform duration-150 cursor-pointer' 
                : 'cursor-default'
            )}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center mt-2">
              {renderStars(supplier.rating_average)}
              <span className="ml-2 text-sm text-gray-600">
                {supplier.rating_average.toFixed(1)} average rating
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {reviews.length > 1 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-select text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          )}

          {user && !userHasReviewed && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="btn-primary btn-sm flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Write a Review</h3>
            <button
              onClick={() => setShowWriteReview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div className="form-group">
              <label className="form-label form-label-required">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
                <span className="text-sm text-gray-600 ml-2">
                  {reviewForm.rating > 0 
                    ? `${reviewForm.rating} star${reviewForm.rating > 1 ? 's' : ''}`
                    : 'Select a rating'
                  }
                </span>
              </div>
              {reviewErrors.rating && (
                <p className="form-error">{reviewErrors.rating}</p>
              )}
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="review-title" className="form-label">
                Review Title
              </label>
              <input
                type="text"
                id="review-title"
                name="title"
                value={reviewForm.title}
                onChange={handleReviewInputChange}
                className="form-input"
                placeholder="Summarize your experience"
              />
            </div>

            {/* Company Name */}
            <div className="form-group">
              <label htmlFor="review-company" className="form-label">
                Your Company Name
              </label>
              <input
                type="text"
                id="review-company"
                name="company_name"
                value={reviewForm.company_name}
                onChange={handleReviewInputChange}
                className="form-input"
                placeholder="Your moving company (optional)"
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <label htmlFor="review-content" className="form-label form-label-required">
                Your Review
              </label>
              <textarea
                id="review-content"
                name="content"
                rows={4}
                value={reviewForm.content}
                onChange={handleReviewInputChange}
                className={cn(
                  'form-textarea',
                  reviewErrors.content && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                placeholder="Share your experience with this supplier..."
              />
              {reviewErrors.content && (
                <p className="form-error">{reviewErrors.content}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className={cn(
                  'btn-primary',
                  isSubmittingReview && 'btn-disabled'
                )}
              >
                {isSubmittingReview ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to review {supplier.name}
          </p>
          {user && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="btn-primary"
            >
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <span className="badge-success text-xs">Verified</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    by {review.user_profile?.full_name || 'Anonymous'}
                    {review.company_name && (
                      <span className="text-gray-500">
                        {' '}from {review.company_name}
                      </span>
                    )}
                    <span className="text-gray-400 ml-2">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">
                  {review.title}
                </h4>
              )}

              <p className="text-gray-700 whitespace-pre-line">
                {review.content}
              </p>

              {review.helpful_count > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                  {review.helpful_count} people found this helpful
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!user && reviews.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-800 mb-2">
            Have experience with {supplier.name}?
          </p>
          <a href="/auth/signin" className="btn-primary btn-sm">
            Sign in to Write Review
          </a>
        </div>
      )}
    </div>
  )
}
