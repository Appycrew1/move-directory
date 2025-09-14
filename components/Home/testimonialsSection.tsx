'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'London Moving Solutions',
    location: 'London',
    rating: 5,
    content: 'This directory has been a game-changer for our business. We found our insurance provider and CRM system through here, both offering exclusive discounts. The verification process gives us confidence in the suppliers.',
    avatar: '/images/testimonials/sarah.jpg',
    service: 'Insurance & CRM'
  },
  {
    id: 2,
    name: 'Michael Thompson',
    company: 'ThompsonMoves Ltd',
    location: 'Manchester',
    rating: 5,
    content: 'The AI comparison feature saved us hours of research when selecting our fleet management software. Being able to compare multiple suppliers side-by-side with expert recommendations was invaluable.',
    avatar: '/images/testimonials/michael.jpg',
    service: 'Fleet Management'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    company: 'Elite Relocations',
    location: 'Birmingham',
    rating: 5,
    content: 'As a new moving company, this directory helped us quickly identify and connect with reliable suppliers. The reviews from other moving companies were particularly helpful in making decisions.',
    avatar: '/images/testimonials/emma.jpg',
    service: 'Multiple Services'
  },
  {
    id: 4,
    name: 'David Roberts',
    company: 'Roberts Removals',
    location: 'Leeds',
    rating: 5,
    content: 'The quality of suppliers in this directory is outstanding. Every supplier we\'ve worked with has been professional and reliable. The exclusive discounts have also helped our bottom line.',
    avatar: '/images/testimonials/david.jpg',
    service: 'Packing Supplies'
  },
  {
    id: 5,
    name: 'Lisa Chen',
    company: 'Premier Moving Co',
    location: 'Bristol',
    rating: 5,
    content: 'The directory\'s search functionality is excellent. We can quickly filter by location, services, and read authentic reviews. It\'s become our go-to resource for finding new suppliers.',
    avatar: '/images/testimonials/lisa.jpg',
    service: 'Storage Solutions'
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trusted by Moving Companies Across the UK
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what moving company owners say about finding suppliers through our directory
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="card p-8 md:p-12 text-center relative">
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 hover:text-blue-600 transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 hover:text-blue-600 transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(currentTestimonial.rating)].map((_, index) => (
                <StarIcon key={index} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 font-medium leading-relaxed">
              "{currentTestimonial.content}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gray-200">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=3B82F6&color=fff`
                  }}
                />
              </div>
              
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {currentTestimonial.name}
                </div>
                <div className="text-gray-600 mb-1">
                  {currentTestimonial.company}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTestimonial.location} • {currentTestimonial.service}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Additional Testimonials Grid (Hidden on Mobile) */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 mt-12">
            {testimonials
              .filter((_, index) => index !== currentIndex)
              .slice(0, 2)
              .map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="card p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => goToSlide(testimonials.indexOf(testimonial))}
                >
                  {/* Rating */}
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <StarIcon key={index} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3B82F6&color=fff`
                        }}
                      />
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Join hundreds of satisfied moving companies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn-primary">
                Browse Suppliers
              </a>
              <a href="/reviews" className="btn-outline">
                Read All Reviews
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
