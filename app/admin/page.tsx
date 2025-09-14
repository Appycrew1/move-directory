import { Suspense } from 'react'
import { 
  BuildingOfficeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { createServerComponentClient } from '@/lib/supabase'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { PendingReviews } from '@/components/admin/PendingReviews'
import { QuickActions } from '@/components/admin/QuickActions'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { FeatureGate } from '@/components/providers/FeatureFlagProvider'
import { formatDate } from '@/lib/utils'

async function getDashboardData() {
  const supabase = await createServerComponentClient()

  try {
    // Get basic counts
    const [
      { count: totalSuppliers },
      { count: approvedSuppliers },
      { count: pendingSuppliers },
      { count: totalUsers },
      { count: totalReviews },
      { count: pendingReviews },
      { count: totalQuotes },
      { count: totalMessages },
      { count: unreadMessages }
    ] = await Promise.all([
      supabase.from('suppliers').select('*', { count: 'exact', head: true }),
      supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('verified', false),
      supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new')
    ])

    // Get recent suppliers
    const { data: recentSuppliers } = await supabase
      .from('suppliers')
      .select(`
        id, name, status, created_at,
        category:categories(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent quote requests
    const { data: recentQuotes } = await supabase
      .from('quote_requests')
      .select(`
        id, requester_name, company_name, status, created_at,
        supplier:suppliers(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent contact messages
    const { data: recentMessages } = await supabase
      .from('contact_messages')
      .select(`
        id, name, company, subject, status, created_at,
        supplier:suppliers(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      stats: {
        totalSuppliers: totalSuppliers || 0,
        approvedSuppliers: approvedSuppliers || 0,
        pendingSuppliers: pendingSuppliers || 0,
        totalUsers: totalUsers || 0,
        totalReviews: totalReviews || 0,
        pendingReviews: pendingReviews || 0,
        totalQuotes: totalQuotes || 0,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0
      },
      recentSuppliers: recentSuppliers || [],
      recentQuotes: recentQuotes || [],
      recentMessages: recentMessages || []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      stats: {
        totalSuppliers: 0,
        approvedSuppliers: 0,
        pendingSuppliers: 0,
        totalUsers: 0,
        totalReviews: 0,
        pendingReviews: 0,
        totalQuotes: 0,
        totalMessages: 0,
        unreadMessages: 0
      },
      recentSuppliers: [],
      recentQuotes: [],
      recentMessages: []
    }
  }
}

export default async function AdminDashboard() {
  const { stats, recentSuppliers, recentQuotes, recentMessages } = await getDashboardData()

  const statCards = [
    {
      title: 'Total Suppliers',
      value: stats.totalSuppliers,
      change: '+12%',
      trend: 'up',
      icon: BuildingOfficeIcon,
      color: 'blue'
    },
    {
      title: 'Approved Suppliers',
      value: stats.approvedSuppliers,
      change: '+8%',
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Pending Review',
      value: stats.pendingSuppliers,
      change: '+3',
      trend: 'neutral',
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+5%',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'purple'
    }
  ]

  const alertCards = [
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      subtitle: 'Total requests',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      subtitle: 'Need attention',
      icon: ChatBubbleLeftRightIcon,
      color: stats.unreadMessages > 0 ? 'red' : 'gray'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      subtitle: 'Need verification',
      icon: ExclamationTriangleIcon,
      color: stats.pendingReviews > 0 ? 'orange' : 'gray'
    }
  ]

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your directory.
        </p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className={`ml-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {alertCards.map((alert, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{alert.value}</h3>
                <p className="text-sm text-gray-600">{alert.title}</p>
                <p className="text-xs text-gray-500">{alert.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full bg-${alert.color}-100`}>
                <alert.icon className={`h-6 w-6 text-${alert.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Suppliers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Suppliers</h2>
            <a href="/admin/suppliers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all →
            </a>
          </div>
          
          {recentSuppliers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent suppliers</p>
          ) : (
            <div className="space-y-4">
              {recentSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">{supplier.category?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(supplier.created_at)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    supplier.status === 'approved' ? 'bg-green-100 text-green-800' :
                    supplier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quote Requests */}
        <FeatureGate flag="quote_requests">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quote Requests</h2>
              <a href="/admin/quotes" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all →
              </a>
            </div>
            
            {recentQuotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent quotes</p>
            ) : (
              <div className="space-y-4">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{quote.requester_name}</h3>
                      <p className="text-sm text-gray-600">
                        {quote.company_name} → {quote.supplier?.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quote.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'responded' ? 'bg-green-100 text-green-800' :
                      quote.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FeatureGate>
      </div>

      {/* Recent Messages */}
      <div className="mt-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contact Messages</h2>
            <a href="/admin/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all →
            </a>
          </div>
          
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent messages</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {message.subject || 'General Inquiry'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {message.supplier?.name || 'General'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="/admin/suppliers?status=pending" className="card p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Review Pending</p>
              <p className="text-xs text-gray-500">{stats.pendingSuppliers} suppliers</p>
            </div>
          </div>
        </a>

        <a href="/admin/messages?status=new" className="card p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">New Messages</p>
              <p className="text-xs text-gray-500">{stats.unreadMessages} unread</p>
            </div>
          </div>
        </a>

        <a href="/admin/reviews?verified=false" className="card p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Verify Reviews</p>
              <p className="text-xs text-gray-500">{stats.pendingReviews} pending</p>
            </div>
          </div>
        </a>

        <a href="/admin/settings" className="card p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cog6ToothIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Settings</p>
              <p className="text-xs text-gray-500">Feature flags & config</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
