'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import type { FeatureFlag, FeatureFlagId } from '@/lib/types'

interface FeatureFlagContextType {
  flags: Record<string, FeatureFlag>
  isEnabled: (flagId: FeatureFlagId) => boolean
  isLoading: boolean
  refreshFlags: () => Promise<void>
  getConfig: (flagId: FeatureFlagId) => Record<string, any>
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined)

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({})
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Fetch feature flags from database
  const fetchFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')

      if (error) {
        console.error('Error fetching feature flags:', error)
        return
      }

      const flagsMap: Record<string, FeatureFlag> = {}
      data.forEach((flag) => {
        flagsMap[flag.id] = flag
      })

      setFlags(flagsMap)
    } catch (error) {
      console.error('Error fetching feature flags:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchFlags()
  }, [])

  // Subscribe to real-time changes (for admin updates)
  useEffect(() => {
    const subscription = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags',
        },
        (payload) => {
          console.log('Feature flag changed:', payload)
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const flag = payload.new as FeatureFlag
            setFlags(prev => ({
              ...prev,
              [flag.id]: flag
            }))
          } else if (payload.eventType === 'DELETE') {
            const flagId = payload.old.id
            setFlags(prev => {
              const updated = { ...prev }
              delete updated[flagId]
              return updated
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Check if a feature flag is enabled
  const isEnabled = (flagId: FeatureFlagId): boolean => {
    const flag = flags[flagId]
    return flag?.enabled ?? false
  }

  // Get feature flag configuration
  const getConfig = (flagId: FeatureFlagId): Record<string, any> => {
    const flag = flags[flagId]
    return flag?.config ?? {}
  }

  // Refresh flags manually
  const refreshFlags = async () => {
    setIsLoading(true)
    await fetchFlags()
  }

  const value: FeatureFlagContextType = {
    flags,
    isEnabled,
    isLoading,
    refreshFlags,
    getConfig,
  }

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export function useFeatureFlag(flagId: FeatureFlagId) {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider')
  }

  return {
    isEnabled: context.isEnabled(flagId),
    config: context.getConfig(flagId),
    isLoading: context.isLoading,
  }
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
  }
  return context
}

// Feature Gate Component
interface FeatureGateProps {
  flag: FeatureFlagId
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const { isEnabled } = useFeatureFlag(flag)

  if (!isEnabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
