import { Suspense } from 'react'
import { Metadata } from 'next'
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { createServerComponentClient } from '@/lib/supabase'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedSuppliers } from '@/components/home/FeaturedSuppliers'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASection } from '@/components/home/CTASection'
import { SupplierCard, SupplierCardSkeleton } from '@/components/SupplierCard'
import { FeatureGate } from '@/components/providers/FeatureFlagProvider'
import { PageErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'UK Moving Industry Suppliers Directory',
  description: 'Discover verified suppliers for moving companies. Compare insurance, software, equipment, and services. Get exclusive discounts and expert recommendations.',
  openGraph: {
    title: 'UK Moving Industry Suppliers Directory | Moving Suppliers Hub',
    description: 'Connect with verified UK suppliers for your moving business. Compare services, read reviews, and access exclusive discounts.',
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Moving Suppliers Hub - Directory of verified UK suppliers',
      },
    ],
  },
}

// Features data
const features = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Smart Search & Compare',
    description: 'Easily find and compare suppliers with AI-powered recommendations tailored to your needs.',
    color: 'blue'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified Suppliers',
    description: 'All suppliers are thoroughly vetted for business credentials, insurance, and industry compliance.',
    color: 'green'
  },
  {
    icon: SparklesIcon,
    title: 'Exclusive Discounts',
    description: 'Access member-only discounts and special offers from trusted industry partners.',
    color: 'purple'
  },
  {
    icon: UserGroupIcon,
    title: 'Expert Reviews',
    description: 'Read authentic reviews from moving company owners and make informed decisions.',
    color: 'orange'
  }
]

// Industry categories
const industryCategories = [
  {
    icon: CogIcon,
    title: 'Software & CRM',
    description: 'Fleet management, booking systems, customer relationship tools',
    count: '15+ suppliers',
    color: 'bg-blue-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Insurance',
    description: 'Liability, cargo, vehicle, and professional indemnity coverage',
    count: '12+ suppliers',
    color: 'bg-green-500'
  },
  {
    icon: TruckIcon,
    title: 'Equipment & Supplies',
    description: 'Moving trucks, packing materials, safety equipment',
    count: '18+ suppliers',
    color: 'bg-orange-500'
  },
  {
    icon: BuildingOfficeIcon,
    title: 'Storage Solutions',
    description: 'Self-storage, warehouse management, container solutions',
    count: '8+ suppliers',
    color: 'bg-purple-500'
  },
  {
    icon: ChartBarIcon,
    title: 'Marketing & Leads',
    description: 'Digital marketing, lead generation, SEO services',
    count: '10+ suppliers',
    color: 'bg-red-500'
  },
  {
    icon: CogIcon,
    title: 'Professional Services',
    description: 'Legal, accounting, HR, business consulting',
    count: '7+ suppliers',
    color: 'bg-gray-500'
  }
]

async function getHomePageData() {
  const supabase = await createServerComponentClient()

  try {
    // Get featured suppliers
    const { data: featuredSuppliers, error: featuredError } = await supabase
      .from('suppliers')
      .select(`
        *,
        category:categories(*),
        tags:supplier_tags(*)
      `)
      .eq('status', 'approved')
      .eq('featured', true)
      .order('rating_average', { ascending: false })
      .limit(8)

    // Get latest suppliers
    const { data: latestSuppliers, error: latestError } = await supabase
      .from('suppliers')
      .select(`
        *,
        category:categories(*),
        tags:supplier_tags(*)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)

    // Get categories with counts
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        *,
        suppliers:suppliers!category_id(count)
      `)
      .order('name')

    // Get basic stats
    const [
      { count: totalSuppliers },
      { count: totalCategories },
      { count: totalReviews }
    ] = await Promise.all([
      supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true })
    ])

    if (featuredError) throw featuredError
    if (latestError) throw latestError
    if (categoriesError) throw categoriesError

    return {
      featuredSuppliers: featuredSuppliers || [],
      latestSuppliers: latestSuppliers || [],
      categories: categories || [],
      stats: {
        totalSuppliers: totalSuppliers || 0,
        totalCategories: totalCategories || 0,
        totalReviews: totalReviews || 0
      }
    }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return {
      featuredSuppliers: [],
      latestSuppliers: [],
      categories: [],
      stats: {
        totalSuppliers: 0,
        totalCategories: 0,
        totalReviews: 0
      }
    }
  }
}

export default async function HomePage() {
  const { featuredSuppliers, latestSuppliers, categories, stats } = await getHomePageData()

  return (
    <PageErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalSuppliers}+
                </div>
                <div className="text-sm text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalCategories}
                </div>
                <div className="text-sm text-gray-600">Service Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalReviews}+
                </div>
                <div className="text-sm text-gray-600">Customer Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  5★
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Directory?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We make it easy to find, compare, and connect with the best suppliers 
                in the UK moving industry.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature, index) => (
                <div key={index} className="card text-center p-8">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${feature.color}-100 flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Suppliers */}
        {featuredSuppliers.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Featured Suppliers
                  </h2>
                  <p className="text-gray-600">
                    Top-rated suppliers trusted by moving companies across the UK
                  </p>
                </div>
                <a 
                  href="/?featured=true" 
                  className="btn-outline hidden md:inline-flex"
                >
                  View All Featured
                </a>
              </div>

              <div className="suppliers-grid">
                {featuredSuppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>

              <div className="text-center mt-8 md:hidden">
                <a href="/?featured=true" className="btn-outline">
                  View All Featured
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explore Categories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find suppliers across all areas of your moving business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryCategories.map((category, index) => (
                <a
                  key={index}
                  href={`/categories/${category.title.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`}
                  className="card group hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${category.color} p-3 rounded-lg text-white flex-shrink-0`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {category.description}
                      </p>
                      <p className="text-blue-600 font-medium text-sm">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="/categories" className="btn-primary">
                Browse All Categories
              </a>
            </div>
          </div>
        </section>

        {/* Latest Suppliers */}
        {latestSuppliers.length > 0 && (
          <section className="section">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Newest Suppliers
                  </h2>
                  <p className="text-gray-600">
                    Recently joined suppliers offering fresh solutions
                  </p>
                </div>
                <a href="/?sortBy=newest" className="btn-outline hidden md:inline-flex">
                  View All New
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestSuppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>

              <div className="text-center mt-8 md:hidden">
                <a href="/?sortBy=newest" className="btn-outline">
                  View All New
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <CTASection />

        {/* Testimonials */}
        <FeatureGate flag="reviews_system">
          <TestimonialsSection />
        </FeatureGate>
      </div>
    </PageErrorBoundary>
  )
}

// Loading component
export function LoadingHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="hero">
        <div className="hero-content">
          <div className="skeleton h-12 w-3/4 mx-auto mb-6" />
          <div className="skeleton h-6 w-1/2 mx-auto mb-8" />
          <div className="skeleton h-12 w-48 mx-auto" />
        </div>
      </div>

      {/* Stats skeleton */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="skeleton h-8 w-16 mx-auto mb-2" />
                <div className="skeleton h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured suppliers skeleton */}
      <section className="section">
        <div className="container">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-6 w-96 mb-8" />
          <div className="suppliers-grid">
            {[...Array(8)].map((_, i) => (
              <SupplierCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}