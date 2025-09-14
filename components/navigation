'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon,
  ScaleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  TagIcon,
  PlusIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '@/hooks/useAuth'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { favorites, compareSuppliers } from '@/lib/utils'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Directory', href: '/', current: false },
  { name: 'Categories', href: '/categories', current: false },
  { name: 'Discounts', href: '/discounts', current: false },
  { name: 'Learning', href: '/learning', current: false },
]

const secondaryNavigation = [
  { name: 'Submit Supplier', href: '/submit', icon: PlusIcon },
  { name: 'Contact', href: '/contact', icon: PhoneIcon },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut, isLoading } = useAuth()
  const { isEnabled: reviewsEnabled } = useFeatureFlag('reviews_system')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [compareCount, setCompareCount] = useState(0)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Update counts when localStorage changes
  useEffect(() => {
    const updateCounts = () => {
      setFavoritesCount(favorites.get().length)
      setCompareCount(compareSuppliers.get().length)
    }

    // Initial count
    updateCounts()

    // Listen for storage changes
    const handleStorageChange = () => updateCounts()
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for same-tab changes
    const interval = setInterval(updateCounts, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Primary Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/images/logo.svg" 
                alt="Moving Suppliers Hub" 
              />
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                Moving Suppliers Hub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link',
                    isActive(item.href) && 'nav-link-active'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Favorites */}
            <Link
              href="/favorites"
              className={cn(
                'relative p-2 rounded-md transition-colors duration-200',
                isActive('/favorites')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              )}
              title="Favorites"
            >
              {isActive('/favorites') ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              className={cn(
                'relative p-2 rounded-md transition-colors duration-200',
                isActive('/compare')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
              )}
              title="Compare"
            >
              <ScaleIcon className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Secondary Navigation (Desktop) */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="btn-ghost btn-sm flex items-center space-x-1"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            {!isLoading && (
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    >
                      <UserCircleIcon className="h-6 w-6 text-gray-600" />
                      <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="dropdown animate-scale-in">
                          <Link
                            href="/account"
                            className="dropdown-item flex items-center space-x-2"
                          >
                            <UserCircleIcon className="h-4 w-4" />
                            <span>My Account</span>
                          </Link>
                          
                          {user.user_metadata?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="dropdown-item flex items-center space-x-2"
                            >
                              <Cog6ToothIcon className="h-4 w-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          
                          <hr className="my-1" />
                          
                          <button
                            onClick={handleSignOut}
                            className="dropdown-item w-full text-left flex items-center space-x-2 text-red-700 hover:bg-red-50"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link href="/auth/signin" className="btn-primary btn-sm">
                    Sign In
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Primary Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <hr className="my-3" />

              {/* Secondary Navigation */}
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {!user && (
                <>
                  <hr className="my-3" />
                  <div className="px-3">
                    <Link
                      href="/auth/signin"
                      className="btn-primary w-full justify-center"
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
