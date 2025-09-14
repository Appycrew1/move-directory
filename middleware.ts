import { createMiddlewareClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)
    
    // Check if we have a session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware auth error:', error)
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
    const isAccountPage = request.nextUrl.pathname.startsWith('/account')
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage && session) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    
    // Protect admin routes
    if (isAdminPage) {
      if (!session) {
        // Redirect to sign in with return URL
        const redirectUrl = new URL('/auth/signin', request.url)
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
      
      // Check if user has admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (!profile || profile.role !== 'admin') {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    
    // Protect account routes
    if (isAccountPage && !session) {
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|manifest.json).*)',
  ],
}