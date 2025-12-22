// ============================================================================
// Business Vault: Deal-Ready Hooks
// lib/hooks/useVaultAccess.ts
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { 
  VaultAccess, 
  SectionStatus, 
  VaultCompleteness,
  UserContext,
  calculateReadinessLevel,
  SECTIONS 
} from '../types';

const supabase = createClientComponentClient();

// ============================================================================
// VAULT ACCESS HOOK
// ============================================================================

export function useVaultAccess() {
  const [reviewers, setReviewers] = useState<VaultAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('vault_access')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setReviewers(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviewers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inviteReviewer = async (email: string, name?: string, role: 'reviewer' | 'buyer' | 'broker' = 'reviewer') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('vault_access')
        .insert({
          owner_id: user.id,
          owner_email: user.email,
          reviewer_email: email,
          reviewer_name: name,
          role,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh the list
      await fetchReviewers();
      
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to invite reviewer' };
    }
  };

  const revokeAccess = async (accessId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('vault_access')
        .update({ status: 'revoked' })
        .eq('id', accessId);

      if (updateError) throw updateError;

      await fetchReviewers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to revoke access' };
    }
  };

  const deleteAccess = async (accessId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vault_access')
        .delete()
        .eq('id', accessId);

      if (deleteError) throw deleteError;

      await fetchReviewers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete access' };
    }
  };

  useEffect(() => {
    fetchReviewers();
  }, [fetchReviewers]);

  const activeReviewers = reviewers.filter(r => r.status === 'active');
  const pendingReviewers = reviewers.filter(r => r.status === 'pending');
  const hasActiveReviewers = activeReviewers.length > 0;

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
  };
}

// ============================================================================
// SECTION STATUS HOOK
// ============================================================================

export function useSectionStatus() {
  const [sectionStatuses, setSectionStatuses] = useState<SectionStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('section_status')
        .select('*')
        .eq('user_id', user.id)
        .order('section_id');

      if (fetchError) throw fetchError;

      // Initialize missing sections
      const existingSections = new Set(data?.map(s => s.section_id) || []);
      const missingStatuses: SectionStatus[] = [];

      for (let i = 1; i <= 5; i++) {
        if (!existingSections.has(i)) {
          missingStatuses.push({
            id: `temp-${i}`,
            user_id: user.id,
            section_id: i,
            status: 'not_started',
            item_count: 0,
            last_item_added_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      // If there are missing sections, create them in the database
      if (missingStatuses.length > 0) {
        const { data: insertedData } = await supabase
          .from('section_status')
          .insert(missingStatuses.map(s => ({
            user_id: user.id,
            section_id: s.section_id,
            status: 'not_started',
            item_count: 0,
          })))
          .select();

        setSectionStatuses([...(data || []), ...(insertedData || missingStatuses)]);
      } else {
        setSectionStatuses(data || []);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch section statuses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSectionStatus = async (
    sectionId: number, 
    status: 'not_started' | 'in_progress' | 'complete',
    itemCount?: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData: Partial<SectionStatus> = { status };
      if (itemCount !== undefined) {
        updateData.item_count = itemCount;
        updateData.last_item_added_at = new Date().toISOString();
      }

      const { error: upsertError } = await supabase
        .from('section_status')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          ...updateData,
        }, {
          onConflict: 'user_id,section_id',
        });

      if (upsertError) throw upsertError;

      await fetchStatuses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' };
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Calculate completeness
  const completeness: VaultCompleteness = {
    totalSections: 5,
    completedSections: sectionStatuses.filter(s => s.status === 'complete').length,
    inProgressSections: sectionStatuses.filter(s => s.status === 'in_progress').length,
    notStartedSections: sectionStatuses.filter(s => s.status === 'not_started').length,
    overallPercentage: Math.round((sectionStatuses.filter(s => s.status === 'complete').length / 5) * 100),
    readinessLevel: calculateReadinessLevel(
      sectionStatuses.filter(s => s.status === 'complete').length,
      5
    ),
    sectionStatuses,
  };

  return {
    sectionStatuses,
    completeness,
    isLoading,
    error,
    updateSectionStatus,
    refresh: fetchStatuses,
  };
}

// ============================================================================
// USER CONTEXT HOOK
// ============================================================================

export function useUserContext() {
  const [context, setContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContext() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setContext(null);
          return;
        }

        // Check if user is viewing as a reviewer
        const { data: reviewerAccess } = await supabase
          .from('vault_access')
          .select('*')
          .eq('reviewer_id', user.id)
          .eq('status', 'active')
          .single();

        // Check if user has active reviewers on their vault
        const { data: ownReviewers, count } = await supabase
          .from('vault_access')
          .select('*', { count: 'exact' })
          .eq('owner_id', user.id)
          .eq('status', 'active');

        setContext({
          userId: user.id,
          email: user.email || '',
          isReviewer: !!reviewerAccess,
          reviewerRole: reviewerAccess?.role,
          vaultOwnerId: reviewerAccess?.owner_id,
          hasActiveReviewers: (count || 0) > 0,
          activeReviewerCount: count || 0,
        });
      } catch (err) {
        console.error('Error fetching user context:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContext();
  }, []);

  return { context, isLoading };
}

// ============================================================================
// DELETE CONFIRMATION HOOK
// ============================================================================

export function useDeleteConfirmation() {
  const { context } = useUserContext();

  const getDeleteConfirmation = (itemType: string): { 
    requiresConfirmation: boolean; 
    message: string | null 
  } => {
    if (context?.hasActiveReviewers) {
      return {
        requiresConfirmation: true,
        message: `A broker or buyer currently has access to your vault. Deleting this ${itemType} will affect what they see. Are you sure you want to proceed?`,
      };
    }
    return {
      requiresConfirmation: false,
      message: null,
    };
  };

  return { getDeleteConfirmation, hasActiveReviewers: context?.hasActiveReviewers || false };
}

// Helper function for calculating readiness (duplicated from types for hook use)
function calculateReadinessLevel(completed: number, total: number): 'Not Started' | 'In Progress' | 'Almost Ready' | 'Deal-Ready' {
  const percentage = (completed / total) * 100;
  if (percentage === 0) return 'Not Started';
  if (percentage < 60) return 'In Progress';
  if (percentage < 100) return 'Almost Ready';
  return 'Deal-Ready';
}

