'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useVaultAccess, useUserContext } from '@/lib/hooks/useVaultAccess'
import type { VaultAccess, ReviewerRole } from '@/lib/types'

// ============================================================================
// INVITE FORM COMPONENT
// ============================================================================

function InviteForm({ onInvite, isLoading }: { 
  onInvite: (email: string, name: string, role: ReviewerRole) => Promise<void>
  isLoading: boolean
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<ReviewerRole>('broker')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await onInvite(email, name, role)
      setEmail('')
      setName('')
    } catch (err) {
      setError('Failed to send invitation')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email Address *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="broker@example.com"
          className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Name (optional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ReviewerRole)}
          className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] outline-none"
        >
          <option value="broker">Business Broker</option>
          <option value="buyer">Potential Buyer</option>
          <option value="reviewer">General Reviewer</option>
        </select>
        <p className="mt-1 text-xs text-[#52525b]">
          All roles have read-only access. Internal notes are always hidden.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706] transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
      </button>
    </form>
  )
}

// ============================================================================
// REVIEWER CARD COMPONENT
// ============================================================================

function ReviewerCard({ 
  access, 
  onRevoke, 
  onDelete 
}: { 
  access: VaultAccess
  onRevoke: () => void
  onDelete: () => void
}) {
  const roleLabels: Record<ReviewerRole, string> = {
    broker: 'Business Broker',
    buyer: 'Potential Buyer',
    reviewer: 'Reviewer',
  }

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
    active: { label: 'Active', color: 'bg-green-500/20 text-green-400' },
    revoked: { label: 'Revoked', color: 'bg-red-500/20 text-red-400' },
    expired: { label: 'Expired', color: 'bg-[#27272a] text-[#52525b]' },
  }

  const status = statusConfig[access.status]

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">
              {access.reviewer_name || access.reviewer_email}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-[#71717a] truncate">{access.reviewer_email}</p>
          <p className="text-xs text-[#52525b] mt-1">
            {roleLabels[access.role]} • Invited {new Date(access.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {access.status === 'active' && (
            <button
              onClick={onRevoke}
              className="px-3 py-1 text-xs bg-[#27272a] text-[#a1a1aa] rounded-lg hover:bg-[#3f3f46] transition-colors"
            >
              Revoke
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 text-[#71717a] hover:text-red-400 transition-colors"
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
  const { context } = useUserContext()
  const { 
    reviewers, 
    activeReviewers,
    inviteReviewer, 
    revokeAccess, 
    deleteAccess,
    isLoading,
  } = useVaultAccess()

  const [isInviting, setIsInviting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInvite = async (email: string, name: string, role: ReviewerRole) => {
    setIsInviting(true)
    setSuccessMessage('')
    
    try {
      const result = await inviteReviewer(email, name, role)
      if (result.success) {
        setSuccessMessage(`Invitation sent to ${email}`)
        setTimeout(() => setSuccessMessage(''), 5000)
      }
    } finally {
      setIsInviting(false)
    }
  }

  const handleRevoke = async (accessId: string) => {
    if (confirm('Revoke access? They will no longer be able to view your vault.')) {
      await revokeAccess(accessId)
    }
  }

  const handleDelete = async (accessId: string) => {
    if (confirm('Remove this invitation record?')) {
      await deleteAccess(accessId)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-2">Settings</h1>
      <p className="text-[#71717a] mb-8">Manage vault access and preferences</p>

      {/* Invite Reviewer Section */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👥</span>
          <div>
            <h2 className="text-lg font-medium text-white">Invite Reviewer</h2>
            <p className="text-sm text-[#71717a]">
              Grant read-only access to brokers or potential buyers
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">✓ {successMessage}</p>
          </div>
        )}

        <InviteForm onInvite={handleInvite} isLoading={isInviting} />

        <div className="mt-4 p-3 bg-[#18181b] rounded-lg">
          <p className="text-xs text-[#52525b]">
            📌 Reviewers can view all documented assets but cannot make changes. 
            Your internal notes are never visible to reviewers.
          </p>
        </div>
      </div>

      {/* Active Reviewers Section */}
      {reviewers.length > 0 && (
        <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium text-white mb-4">
            Vault Access ({activeReviewers.length} active)
          </h2>

          {isLoading ? (
            <div className="text-center py-4 text-[#71717a]">Loading...</div>
          ) : (
            <div className="space-y-3">
              {reviewers.map((access) => (
                <ReviewerCard
                  key={access.id}
                  access={access}
                  onRevoke={() => handleRevoke(access.id)}
                  onDelete={() => handleDelete(access.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Section */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Account</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#71717a] mb-1">Email</label>
            <p className="text-white">{context?.email || 'Loading...'}</p>
          </div>

          <div className="pt-4 border-t border-[#1e1e23]">
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}