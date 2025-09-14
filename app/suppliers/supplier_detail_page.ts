import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  HeartIcon,
  ScaleIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  TagIcon,
  StarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import { createServerComponentClient } from '@/lib/supabase'
import { SupplierActions } from '@/components/suppliers/SupplierActions'
import { SupplierReviews } from '@/components/suppliers/SupplierReviews'
import { QuoteRequestForm } from '@/components/suppliers/QuoteRequestForm'
import { ContactSupplierForm } from '@/components/suppliers/ContactSupplierForm'
import { RelatedSuppliers } from '@/components/suppliers/RelatedSuppliers'
import { FeatureGate } from '@/components/providers/FeatureFlagProvider'
import { PageErrorBoundary } from '@/components/ErrorBoundary'
import { getSupplierLogoUrl, formatRating, formatDate, formatRelativeTime } from '@/lib/utils'
import type { Supplier } from '@/lib/types'

interface SupplierPageProps {
  params: { slug: string }
}

async function getSupplier(slug: string) {
  const supabase = await createServerComponentClient()

  try {
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        category:categories(*),
        tags:supplier_tags(*),
        reviews:reviews(
          *,
          user_profile:user_profiles(full_name, company_name)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'approved')
      .single()

    if (error || !supplier) {
      return null
    }

    // Increment view count
    await supabase
      .from('suppliers')
      .update({ view_count: supplier.view_count + 1 })
      .eq('id', supplier.id)

    return supplier
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return null
  }
}

export async function generateMetadata({ params }: SupplierPageProps): Promise<Metadata> {
  const supplier = await getSupplier(params.slug)

  if (!supplier) {
    return {
      title: 'Supplier Not Found',
      description: 'The requested supplier could not be found.'
    }
  }

  return {
    title: `${supplier.name} - ${supplier.category?.name || 'Supplier'}`,
    description: supplier.short_summary || supplier.description || `${supplier.name} provides ${supplier.category?.name?.toLowerCase() || 'services'} for moving companies in the UK.`,
    openGraph: {
      title: `${supplier.name} | Moving Suppliers Hub`,
      description: supplier.short_summary || supplier.description || '',
      images: supplier.logo_url ? [
        {
          url: supplier.logo_url,
          width: 400,
          height: 400,
          alt: `${supplier.name} logo`,
        },
      ] : undefined,
    },
  }
}

export default async function SupplierDetailPage({ params }: SupplierPageProps) {
  const supplier = await getSupplier(params.slug)

  if (!supplier) {
    notFound()
  }

  const averageRating = supplier.rating_average || 0
  const reviewCount = supplier.rating_count || 0

  return (
    <PageErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Logo and Basic Info */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={getSupplierLogoUrl(supplier.logo_url)}
                    alt={`${supplier.name} logo`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/default-logo.png'
                    }}
                  />
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {supplier.name}
                      </h1>
                      
                      {/* Badges */}
                      <div className="flex items-center space-x-2">
                        {supplier.featured && (
                          <span className="badge-primary">Featured</span>
                        )}
                        {supplier.has_discount && (
                          <span className="badge badge-error flex items-center">
                            <TagIcon className="h-3 w-3 mr-1" />
                            Discount Available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category and Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      {supplier.category && (
                        <div className="flex items-center text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                          <span>{supplier.category.name}</span>
                        </div>
                      )}

                      <FeatureGate flag="reviews_system">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <StarIconSolid
                                key={index}
                                className={`h-5 w-5 ${
                                  index < Math.floor(averageRating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {reviewCount > 0 
                              ? `${formatRating(averageRating)} (${reviewCount} reviews)`
                              : 'No reviews yet'
                            }
                          </span>
                        </div>
                      </FeatureGate>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center space-x-4 mb-4">
                      {supplier.verified_business && (
                        <div className="flex items-center text-green-600">
                          <CheckBadgeIcon className="h-5 w-5 mr-2" />
                          <span className="text-sm">Verified Business</span>
                        </div>
                      )}
                      {supplier.verified_insurance && (
                        <div className="flex items-center text-blue-600">
                          <ShieldCheckIcon className="h-5 w-5 mr-2" />
                          <span className="text-sm">Insurance Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Short Summary */}
                    {supplier.short_summary && (
                      <p className="text-lg text-gray-700 mb-4">
                        {supplier.short_summary}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>{supplier.view_count} views</span>
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        <span>{supplier.contact_count} contacts</span>
                      </div>
                      {supplier.founded_year && (
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>Since {supplier.founded_year}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <SupplierActions supplier={supplier} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {supplier.description && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About {supplier.name}
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {supplier.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Services & Tags */}
              {supplier.tags && supplier.tags.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Services & Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {supplier.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Discount Information */}
              {supplier.has_discount && supplier.discount_description && (
                <div className="card p-6 bg-red-50 border-red-200">
                  <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
                    <TagIcon className="h-5 w-5 mr-2" />
                    Exclusive Discount
                  </h2>
                  <p className="text-red-800 mb-3">{supplier.discount_description}</p>
                  {supplier.discount_code && (
                    <div className="bg-white rounded-lg p-3 border border-red-300">
                      <p className="text-sm text-red-700 mb-1">Discount Code:</p>
                      <code className="text-lg font-mono text-red-900 bg-red-100 px-2 py-1 rounded">
                        {supplier.discount_code}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews */}
              <FeatureGate flag="reviews_system">
                <SupplierReviews supplier={supplier} />
              </FeatureGate>

              {/* Related Suppliers */}
              <RelatedSuppliers currentSupplier={supplier} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  {supplier.website_url && (
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <a
                        href={supplier.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {supplier.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {supplier.contact_email && (
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <a
                        href={`mailto:${supplier.contact_email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {supplier.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {supplier.contact_phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <a
                        href={`tel:${supplier.contact_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {supplier.contact_phone}
                      </a>
                    </div>
                  )}
                  
                  {supplier.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{supplier.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Details */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Details
                </h2>
                <div className="space-y-3">
                  {supplier.founded_year && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Founded:</span>
                      <span className="text-gray-900">{supplier.founded_year}</span>
                    </div>
                  )}
                  
                  {supplier.employee_count && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="text-gray-900">{supplier.employee_count}</span>
                    </div>
                  )}
                  
                  {supplier.pricing_model && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing:</span>
                      <span className="text-gray-900">{supplier.pricing_model}</span>
                    </div>
                  )}

                  {/* Service Areas */}
                  {supplier.service_areas && supplier.service_areas.length > 0 && (
                    <div>
                      <span className="text-gray-600">Service Areas:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {supplier.service_areas.map((area, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quote Request Form */}
              <FeatureGate flag="quote_requests">
                {supplier.accepts_quotes && (
                  <QuoteRequestForm supplier={supplier} />
                )}
              </FeatureGate>

              {/* Contact Form */}
              <ContactSupplierForm supplier={supplier} />
            </div>
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  )
}