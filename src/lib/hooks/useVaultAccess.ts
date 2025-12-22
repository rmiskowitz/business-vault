// ============================================================================
// Business Vault: Deal-Ready Hooks
// lib/hooks/useVaultAccess.ts
// ============================================================================

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { 
  VaultAccess, 
  SectionStatus, 
  VaultCompleteness,
  ReviewerRole
} from '@/lib/types'
import { calculateReadinessLevel } from '@/lib/types'

// ============================================================================
// VAULT ACCESS HOOK
// ============================================================================

export function useVaultAccess() {
  const [reviewers, setReviewers] = useState<VaultAccess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviewers = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setError('Not authenticated')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('vault_access')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setReviewers(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviewers')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const inviteReviewer = async (email: string, name?: string, role: ReviewerRole = 'reviewer') => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { data, error: insertError } = await supabase
        .from('vault_access')
        .insert({
          owner_id: session.user.id,
          owner_email: session.user.email,
          reviewer_email: email,
          reviewer_name: name,
          role,
          status: 'pending',
        })
        .select()
        .single()

      if (insertError) throw insertError

      await fetchReviewers()
      
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to invite reviewer' }
    }
  }

  const revokeAccess = async (accessId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('vault_access')
        .update({ status: 'revoked' })
        .eq('id', accessId)

      if (updateError) throw updateError

      await fetchReviewers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to revoke access' }
    }
  }

  const deleteAccess = async (accessId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vault_access')
        .delete()
        .eq('id', accessId)

      if (deleteError) throw deleteError

      await fetchReviewers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete access' }
    }
  }

  useEffect(() => {
    fetchReviewers()
  }, [fetchReviewers])

  const activeReviewers = reviewers.filter(r => r.status === 'active')
  const pendingReviewers = reviewers.filter(r => r.status === 'pending')
  const hasActiveReviewers = activeReviewers.length > 0

  return {
    reviewers,
    activeReviewers,
    pendingReviewers,
    hasActiveReviewers,
    isLoading,
    error,
    inviteReviewer,
    revokeAccess,
    deleteAccess,
    refresh: fetchReviewers,
  }
}

// ============================================================================
// SECTION STATUS HOOK
// ============================================================================

export function useSectionStatus() {
  const [sectionStatuses, setSectionStatuses] = useState<SectionStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setError('Not authenticated')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('section_status')
        .select('*')
        .eq('user_id', session.user.id)
        .order('section_id')

      if (fetchError) throw fetchError

      // Initialize missing sections
      const existingSections = new Set(data?.map(s => s.section_id) || [])
      const allStatuses: SectionStatus[] = [...(data || [])]

      for (let i = 1; i <= 5; i++) {
        if (!existingSections.has(i)) {
          // Create missing section in database
          const { data: newStatus } = await supabase
            .from('section_status')
            .insert({
              user_id: session.user.id,
              section_id: i,
              status: 'not_started',
              item_count: 0,
            })
            .select()
            .single()

          if (newStatus) {
            allStatuses.push(newStatus)
          }
        }
      }

      // Sort by section_id
      allStatuses.sort((a, b) => a.section_id - b.section_id)
      setSectionStatuses(allStatuses)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch section statuses')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSectionStatus = async (
    sectionId: number, 
    status: 'not_started' | 'in_progress' | 'complete',
    itemCount?: number
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const updateData: any = { status }
      if (itemCount !== undefined) {
        updateData.item_count = itemCount
        updateData.last_item_added_at = new Date().toISOString()
      }

      const { error: upsertError } = await supabase
        .from('section_status')
        .upsert({
          user_id: session.user.id,
          section_id: sectionId,
          ...updateData,
        }, {
          onConflict: 'user_id,section_id',
        })

      if (upsertError) throw upsertError

      await fetchStatuses()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' }
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  // Calculate completeness
  const completedCount = sectionStatuses.filter(s => s.status === 'complete').length
  const completeness: VaultCompleteness = {
    totalSections: 5,
    completedSections: completedCount,
    inProgressSections: sectionStatuses.filter(s => s.status === 'in_progress').length,
    notStartedSections: sectionStatuses.filter(s => s.status === 'not_started').length,
    overallPercentage: Math.round((completedCount / 5) * 100),
    readinessLevel: calculateReadinessLevel(completedCount, 5),
    sectionStatuses,
  }

  return {
    sectionStatuses,
    completeness,
    isLoading,
    error,
    updateSectionStatus,
    refresh: fetchStatuses,
  }
}

// ============================================================================
// USER CONTEXT HOOK
// ============================================================================

export interface UserContext {
  userId: string
  email: string
  isReviewer: boolean
  reviewerRole?: ReviewerRole
  vaultOwnerId?: string
  hasActiveReviewers: boolean
  activeReviewerCount: number
}

export function useUserContext() {
  const [context, setContext] = useState<UserContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContext() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          setContext(null)
          return
        }

        // Check if user is viewing as a reviewer
        const { data: reviewerAccess } = await supabase
          .from('vault_access')
          .select('*')
          .eq('reviewer_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle()

        // Check if user has active reviewers on their vault
        const { count } = await supabase
          .from('vault_access')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', session.user.id)
          .eq('status', 'active')

        setContext({
          userId: session.user.id,
          email: session.user.email || '',
          isReviewer: !!reviewerAccess,
          reviewerRole: reviewerAccess?.role,
          vaultOwnerId: reviewerAccess?.owner_id,
          hasActiveReviewers: (count || 0) > 0,
          activeReviewerCount: count || 0,
        })
      } catch (err) {
        console.error('Error fetching user context:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContext()
  }, [])

  return { context, isLoading }
}

// ============================================================================
// DELETE CONFIRMATION HOOK
// ============================================================================

export function useDeleteConfirmation() {
  const { context } = useUserContext()

  const getDeleteConfirmation = (itemType: string): { 
    requiresConfirmation: boolean
    message: string | null 
  } => {
    if (context?.hasActiveReviewers) {
      return {
        requiresConfirmation: true,
        message: `A broker or buyer currently has access to your vault. Deleting this ${itemType} will affect what they see. Are you sure you want to proceed?`,
      }
    }
    return {
      requiresConfirmation: false,
      message: null,
    }
  }

  return { getDeleteConfirmation, hasActiveReviewers: context?.hasActiveReviewers || false }
}