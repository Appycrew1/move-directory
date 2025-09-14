'use client'

import Link from 'next/link'
import { ArrowRightIcon, PlusIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

export function CTASection() {
  const { user } = useAuth()

  return (
    <section className="section bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Suppliers?
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of UK moving companies who trust our directory to find 
            reliable, verified suppliers that help grow their business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* For Moving Companies */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">For Moving Companies</h3>
              <p className="text-blue-100 text-sm mb-4">
                Browse verified suppliers, compare services, and save your favorites
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-white font-medium hover:text-blue-200 transition-colors duration-200"
              >
                Browse Directory
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* For Suppliers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">For Suppliers</h3>
              <p className="text-blue-100 text-sm mb-4">
                List your services and connect with moving companies across the UK
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center text-white font-medium hover:text-blue-200 transition-colors duration-200"
              >
                Submit Your Business
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Get Started */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ArrowRightIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Get Started</h3>
              <p className="text-blue-100 text-sm mb-4">
                Create an account to save favorites and access exclusive features
              </p>
              {user ? (
                <Link
                  href="/account"
                  className="inline-flex items-center text-white font-medium hover:text-blue-200 transition-colors duration-200"
                >
                  My Account
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-white font-medium hover:text-blue-200 transition-colors duration-200"
                >
                  Sign In
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary bg-white text-blue-600 hover:bg-blue-50 border-white"
            >
              Explore Suppliers
            </Link>
            
            <Link
              href="/submit"
              className="btn-outline border-white text-white hover:bg-white hover:text-blue-600"
            >
              List Your Business
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-blue-200">Verified Suppliers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-blue-200">UK Based</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-blue-200">Support Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">Free</div>
                <div className="text-sm text-blue-200">For Moving Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}