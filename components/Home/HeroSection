'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'software', label: 'Software & CRM' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'equipment', label: 'Equipment & Supplies' },
    { value: 'storage', label: 'Storage Solutions' },
    { value: 'fuel', label: 'Fleet & Fuel' },
    { value: 'marketing', label: 'Marketing Services' },
    { value: 'professional', label: 'Professional Services' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }

    const queryString = params.toString()
    router.push(`/${queryString ? `?${queryString}` : ''}`)
  }

  const quickSearches = [
    'CRM Software',
    'Moving Insurance',
    'Packing Supplies',
    'Fleet Management',
    'Storage Solutions'
  ]

  return (
    <section className="hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="hero-content relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <SparklesIcon className="h-4 w-4 text-blue-200" />
            <span className="text-blue-100 text-sm font-medium">
              50+ Verified UK Suppliers
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Find the Perfect
            <span className="text-blue-200"> Suppliers </span>
            for Your Moving Business
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto text-balance">
            Connect with verified UK suppliers for insurance, software, equipment, and more. 
            Compare options, read reviews, and get exclusive discounts.
          </p>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for suppliers, services, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:ring-0 focus:outline-none placeholder-gray-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-4 text-lg border-0 rounded-xl focus:ring-0 focus:outline-none bg-white text-gray-700"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap"
                >
                  Search Suppliers
                </button>
              </div>
            </form>
          </div>

          {/* Quick Searches */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-blue-200 text-sm">Popular searches:</span>
            {quickSearches.map((search, index) => (
              <button
                key={search}
                onClick={() => {
                  setSearchQuery(search)
                  const params = new URLSearchParams({ search })
                  router.push(`/?${params.toString()}`)
                }}
                className="text-blue-100 hover:text-white text-sm underline underline-offset-2 hover:no-underline transition-colors duration-200"
              >
                {search}
                {index < quickSearches.length - 1 && ','}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-blue-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
