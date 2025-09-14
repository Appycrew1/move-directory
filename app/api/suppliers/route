import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { supplierFilterSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'
import type { SupplierFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Parse and validate query parameters
    const rawFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      location: searchParams.get('location') || undefined,
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
      hasDiscount: searchParams.get('hasDiscount') === 'true',
      featured: searchParams.get('featured') === 'true',
      tags: searchParams.getAll('tags'),
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    }

    const filters = supplierFilterSchema.parse(rawFilters)

    // Build the query
    let query = supabase
      .from('suppliers')
      .select(`
        *,
        category:categories(*),
        tags:supplier_tags(*),
        reviews:reviews(rating)
      `, { count: 'exact' })
      .eq('status', 'approved')

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,short_summary.ilike.%${filters.search}%`)
    }

    if (filters.category) {
      // Handle category by ID or slug
      if (filters.category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        query = query.eq('category_id', filters.category)
      } else {
        // Join with categories table to filter by slug
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single()

        if (category) {
          query = query.eq('category_id', category.id)
        }
      }
    }

    if (filters.location) {
      query = query.or(`location.ilike.%${filters.location}%,service_areas.cs.{${filters.location}}`)
    }

    if (filters.rating) {
      query = query.gte('rating_average', filters.rating)
    }

    if (filters.hasDiscount) {
      query = query.eq('has_discount', true)
    }

    if (filters.featured) {
      query = query.eq('featured', true)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        query = query.order('rating_average', { ascending: filters.sortOrder === 'asc' })
        break
      case 'newest':
        query = query.order('created_at', { ascending: filters.sortOrder === 'asc' })
        break
      case 'popular':
        query = query.order('view_count', { ascending: filters.sortOrder === 'asc' })
        break
      default:
        query = query.order('name', { ascending: filters.sortOrder === 'asc' })
    }

    // Apply pagination
    const from = (filters.page - 1) * filters.limit
    const to = from + filters.limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: suppliers, error, count } = await query

    if (error) {
      throw error
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / filters.limit)
    const pagination = {
      page: filters.page,
      limit: filters.limit,
      total: count || 0,
      totalPages,
      hasNext: filters.page < totalPages,
      hasPrev: filters.page > 1,
    }

    // Filter suppliers by tags if specified
    let filteredSuppliers = suppliers || []
    if (filters.tags && filters.tags.length > 0) {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.tags?.some((tag: any) => filters.tags?.includes(tag.tag))
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredSuppliers,
      pagination,
    })

  } catch (error) {
    console.error('Error fetching suppliers:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Create supplier
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert([{
        ...body,
        created_by: session.user.id,
        status: 'approved' // Admins can create approved suppliers directly
      }])
      .select(`
        *,
        category:categories(*),
        tags:supplier_tags(*)
      `)
      .single()

    if (error) {
      throw error
    }

    // Log admin action
    await supabase.from('admin_logs').insert([{
      admin_id: session.user.id,
      action: 'supplier_created',
      target_type: 'supplier',
      target_id: supplier.id,
      details: { name: supplier.name }
    }])

    return NextResponse.json({
      success: true,
      data: supplier,
      message: 'Supplier created successfully'
    })

  } catch (error) {
    console.error('Error creating supplier:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}
