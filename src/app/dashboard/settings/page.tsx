// ============================================================================
// Business Vault: Settings Page with Reviewer Invitations
// app/dashboard/settings/page.tsx
// ============================================================================

'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useVaultAccess, useUserContext } from '@/lib/hooks/useVaultAccess';
import type { VaultAccess, ReviewerRole } from '@/lib/types';

// ============================================================================
// INVITE FORM COMPONENT
// ============================================================================

function InviteForm({ onInvite, isLoading }: { 
  onInvite: (email: string, name: string, role: ReviewerRole) => Promise<void>;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<ReviewerRole>('broker');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onInvite(email, name, role);
      setEmail('');
      setName('');
    } catch (err) {
      setError('Failed to send invitation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="broker@example.com"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Name (optional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ReviewerRole)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        >
          <option value="broker">Business Broker</option>
          <option value="buyer">Potential Buyer</option>
          <option value="reviewer">General Reviewer</option>
        </select>
        <p className="mt-1 text-xs text-zinc-500">
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
        className="w-full px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
      </button>
    </form>
  );
}

// ============================================================================
// REVIEWER CARD COMPONENT
// ============================================================================

function ReviewerCard({ 
  access, 
  onRevoke, 
  onDelete 
}: { 
  access: VaultAccess;
  onRevoke: () => void;
  onDelete: () => void;
}) {
  const roleLabels: Record<ReviewerRole, string> = {
    broker: 'Business Broker',
    buyer: 'Potential Buyer',
    reviewer: 'Reviewer',
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
    active: { label: 'Active', color: 'bg-green-500/20 text-green-400' },
    revoked: { label: 'Revoked', color: 'bg-red-500/20 text-red-400' },
    expired: { label: 'Expired', color: 'bg-zinc-500/20 text-zinc-400' },
  };

  const status = statusConfig[access.status];

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
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
          <p className="text-sm text-zinc-400 truncate">{access.reviewer_email}</p>
          <p className="text-xs text-zinc-500 mt-1">
            {roleLabels[access.role]} • Invited {new Date(access.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {access.status === 'active' && (
            <button
              onClick={onRevoke}
              className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Revoke
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const { context } = useUserContext();
  const { 
    reviewers, 
    activeReviewers, 
    pendingReviewers,
    inviteReviewer, 
    revokeAccess, 
    deleteAccess,
    isLoading,
    refresh 
  } = useVaultAccess();

  const [isInviting, setIsInviting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInvite = async (email: string, name: string, role: ReviewerRole) => {
    setIsInviting(true);
    setSuccessMessage('');
    
    try {
      const result = await inviteReviewer(email, name, role);
      if (result.success) {
        setSuccessMessage(`Invitation sent to ${email}`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevoke = async (accessId: string) => {
    if (confirm('Revoke access? They will no longer be able to view your vault.')) {
      await revokeAccess(accessId);
    }
  };

  const handleDelete = async (accessId: string) => {
    if (confirm('Remove this invitation record?')) {
      await deleteAccess(accessId);
    }
  };

  // Reviewer view - limited settings
  if (context?.isReviewer) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-8">Settings</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Reviewer Access</h2>
          <p className="text-zinc-400">
            You are viewing this vault as a {context.reviewerRole}. 
            You have read-only access to documented assets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-2">Settings</h1>
      <p className="text-zinc-400 mb-8">Manage vault access and preferences</p>

      {/* Invite Reviewer Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👥</span>
          <div>
            <h2 className="text-lg font-medium text-white">Invite Reviewer</h2>
            <p className="text-sm text-zinc-400">
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

        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">
            📌 Reviewers can view all documented assets but cannot make changes. 
            Your internal notes are never visible to reviewers.
          </p>
        </div>
      </div>

      {/* Active Reviewers Section */}
      {reviewers.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium text-white mb-4">
            Vault Access ({activeReviewers.length} active)
          </h2>

          {isLoading ? (
            <div className="text-center py-4 text-zinc-400">Loading...</div>
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Account</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <p className="text-white">{context?.email || 'Loading...'}</p>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}