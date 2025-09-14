'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import type { UserProfile } from '@/lib/types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string) => Promise<void>
  signUp: (email: string, userData: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check if user is admin
  const isAdmin = profile?.role === 'admin'

  // Fetch user profile
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Create user profile
  const createProfile = async (user: User, userData?: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const profileData: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        full_name: userData?.full_name || user.user_metadata?.full_name || '',
        company_name: userData?.company_name || '',
        phone: userData?.phone || '',
        location: userData?.location || '',
        role: 'user',
        email_notifications: userData?.email_notifications ?? true,
        marketing_emails: userData?.marketing_emails ?? false,
      }

      // Check if this is the bootstrap admin
      const bootstrapAdminEmail = process.env.NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAIL
      if (bootstrapAdminEmail && user.email === bootstrapAdminEmail) {
        profileData.role = 'admin'
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        } else if (session?.user) {
          setSession(session)
          setUser(session.user)
          
          // Fetch or create profile
          let userProfile = await fetchProfile(session.user.id)
          if (!userProfile) {
            userProfile = await createProfile(session.user)
          }
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch or create profile
          let userProfile = await fetchProfile(session.user.id)
          if (!userProfile) {
            userProfile = await createProfile(session.user)
          }
          setProfile(userProfile)
        } else {
          setProfile(null)
        }

        setIsLoading(false)

        // Handle auth events
        if (event === 'SIGNED_IN') {
          toast.success('Welcome back!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Signed out successfully')
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  // Sign in with magic link
  const signIn = async (email: string) => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      console.error('Error signing in:', error)
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up with profile data
  const signUp = async (email: string, userData: Partial<UserProfile>) => {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: userData, // This will be available in user_metadata
        },
      })

      if (error) {
        throw error
      }

      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      console.error('Error signing up:', error)
      toast.error(error.message || 'Failed to sign up')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
      
    } catch (error: any) {
      console.error('Error signing out:', error)
      toast.error(error.message || 'Failed to sign out')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')

    try {
      setIsLoading(true)

      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setProfile(updatedProfile)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh profile from database
  const refreshProfile = async () => {
    if (!user) return

    try {
      const userProfile = await fetchProfile(user.id)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
