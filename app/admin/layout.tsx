'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: HomeIcon,
    count: null
  },
  {
    name: 'Suppliers',
    href: '/admin/suppliers',
    icon: BuildingOfficeIcon,
    count: null
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FolderIcon,
    count: null
  },
  {
    name: 'Reviews',
    href: '/admin/reviews',
    icon: ChatBubbleLeftRightIcon,
    count: null
  },
  {
    name: 'Quote Requests',
    href: '/admin/quotes',
    icon: DocumentTextIcon,
    count: null
  },
  {
    name: 'Contact Messages',
    href: '/admin/messages',
    icon: ChatBubbleLeftRightIcon,
    count: null
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UserGroupIcon,
    count: null
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    count: null
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    count: null
  }
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut, profile } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/images/logo.svg" 
                alt="Moving Suppliers Hub" 
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Admin
              </span>
            </Link>
            
            <button
              type="button"
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  )} />
                  <span className="flex-1">{item.name}</span>
                  {item.count && (
                    <span className={cn(
                      'ml-2 px-2 py-0.5 text-xs rounded-full',
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                    )}>
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              <h1 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900">
                {navigation.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
                {/* Notification dot */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400" />
              </button>

              {/* Quick actions */}
              <Link
                href="/"
                className="btn-outline btn-sm hidden sm:inline-flex"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
