import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const response = NextResponse.redirect(new URL(next, requestUrl.origin))
    const supabase = createRouteHandlerClient(request, response)

    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          new URL(`/auth/signin?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
      }

      if (session?.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        // Create profile if it doesn't exist
        if (profileError && profileError.code === 'PGRST116') {
          const userData = session.user.user_metadata || {}
          
          // Check if this is the bootstrap admin
          const bootstrapAdminEmail = process.env.NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAIL
          const isBootstrapAdmin = bootstrapAdminEmail && session.user.email === bootstrapAdminEmail

          const { error: createError } = await supabase
            .from('user_profiles')
            .insert([{
              id: session.user.id,
              email: session.user.email!,
              full_name: userData.full_name || '',
              company_name: userData.company_name || '',
              role: isBootstrapAdmin ? 'admin' : 'user',
              email_notifications: true,
              marketing_emails: userData.marketing_emails || false,
            }])

          if (createError) {
            console.error('Error creating user profile:', createError)
            // Don't fail the auth flow for profile creation errors
          }
        }
      }

      return response
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(
        new URL('/auth/signin?error=Authentication failed', requestUrl.origin)
      )
    }
  }

  // No code provided, redirect to sign in
  return NextResponse.redirect(
    new URL('/auth/signin?error=No authentication code provided', requestUrl.origin)
  )
}
