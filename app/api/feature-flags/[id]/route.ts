import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { handleApiError } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    const { data: flag, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (!flag) {
      return NextResponse.json({
        success: false,
        error: 'Feature flag not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: flag,
      enabled: flag.enabled
    })

  } catch (error) {
    console.error('Error fetching feature flag:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Check authentication and admin role
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

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

    // Update feature flag
    const { data: flag, error } = await supabase
      .from('feature_flags')
      .update({
        enabled: body.enabled,
        description: body.description,
        config: body.config || {},
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Log admin action
    await supabase.from('admin_logs').insert([{
      admin_id: session.user.id,
      action: 'feature_flag_updated',
      target_type: 'feature_flag',
      target_id: params.id,
      details: { 
        flag_id: params.id,
        enabled: body.enabled 
      }
    }])

    return NextResponse.json({
      success: true,
      data: flag,
      message: `Feature flag ${body.enabled ? 'enabled' : 'disabled'}`
    })

  } catch (error) {
    console.error('Error updating feature flag:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}
