'use client'

import Link from 'next/link'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

const navigation = {
  directory: [
    { name: 'Browse All Suppliers', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Featured Suppliers', href: '/?featured=true' },
    { name: 'Latest Suppliers', href: '/?sortBy=newest' },
  ],
  resources: [
    { name: 'Learning Center', href: '/learning' },
    { name: 'Discounts & Offers', href: '/discounts' },
    { name: 'Industry Insights', href: '/learning/insights' },
    { name: 'Moving Guides', href: '/learning/guides' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Submit a Supplier', href: '/submit' },
    { name: 'Partner With Us', href: '/partners' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' },
  ],
}

const categories = [
  { name: 'Software & CRM', href: '/categories/software' },
  { name: 'Insurance', href: '/categories/insurance' },
  { name: 'Equipment & Supplies', href: '/categories/equipment' },
  { name: 'Storage Solutions', href: '/categories/storage' },
  { name: 'Fleet & Fuel', href: '/categories/fuel' },
  { name: 'Marketing Services', href: '/categories/marketing' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  className="h-8 w-auto" 
                  src="/images/logo.svg" 
                  alt="Moving Suppliers Hub" 
                />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Moving Suppliers Hub
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 max-w-md">
                The UK's leading directory connecting moving companies with verified suppliers. 
                Find insurance, software, equipment, and services to grow your moving business.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <a 
                    href="mailto:hello@movingsuppliershub.com" 
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    hello@movingsuppliershub.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <a 
                    href="tel:+442012345678" 
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    +44 20 1234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* Directory */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Directory
              </h3>
              <ul className="space-y-3">
                {navigation.directory.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-200">
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay updated with new suppliers
              </h3>
              <p className="text-gray-600">
                Get notified when new suppliers join our directory and access exclusive discounts.
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input flex-1 min-w-0"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-500">
                Unsubscribe anytime. See our{' '}
                <Link href="/privacy" className="underline hover:text-gray-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © {currentYear} Moving Suppliers Hub. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center items-center space-x-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Quality Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}