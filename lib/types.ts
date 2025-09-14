import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './types'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client component client (for use in client components)
export const createClientClient = () => 
  createClientComponentClient<Database>()

// Server component client (for use in server components)
export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })

// Admin client with service role (for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to get user session
export const getSession = async () => {
  const supabase = createServerClient()
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Helper function to get user profile
export const getUserProfile = async () => {
  const session = await getSession()
  if (!session?.user?.id) return null

  const supabase = createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return profile
}

// Helper function to check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  const profile = await getUserProfile()
  return profile?.role === 'admin'
}

// Helper function to get feature flags
export const getFeatureFlags = async () => {
  const supabase = createServerClient()
  const { data: flags } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('is_active', true)

  return flags || []
}

// Helper function to check if a feature is enabled
export const isFeatureEnabled = async (featureName: string): Promise<boolean> => {
  const flags = await getFeatureFlags()
  return flags.some(flag => flag.name === featureName && flag.is_active)
}
