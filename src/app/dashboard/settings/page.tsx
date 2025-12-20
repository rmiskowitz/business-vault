'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#71717a]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-[#71717a] mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Email</label>
            <p className="text-white">{user?.email || 'Not available'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Account Created</label>
            <p className="text-white">
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString() 
                : 'Not available'}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Expiration Alerts</p>
              <p className="text-[#71717a] text-sm">Get notified when assets are about to expire</p>
            </div>
            <div className="text-[#f59e0b]">Coming Soon</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Weekly Summary</p>
              <p className="text-[#71717a] text-sm">Receive a weekly summary of your assets</p>
            </div>
            <div className="text-[#f59e0b]">Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Data Export</h2>
        <p className="text-[#71717a] text-sm mb-4">
          Export all your asset data for backup or reporting purposes.
        </p>
        <a 
          href="/dashboard/export"
          className="inline-block px-4 py-2 bg-[#f59e0b] text-black rounded-lg text-sm font-medium hover:bg-[#d97706] transition-colors"
        >
          Go to Export
        </a>
      </div>

      {/* 
      ============================================================
      BITWARDEN INTEGRATION - HIDDEN UNTIL PARTNERSHIP ESTABLISHED
      ============================================================
      
      This feature requires Bitwarden API access that is not currently
      available to third-party applications. The code is preserved here
      for when a partnership or API access is established.
      
      To re-enable:
      1. Uncomment the Connected Accounts section below
      2. Ensure the /api/credentials/* routes are working
      3. Update the credential mapping page at /dashboard/settings/credentials
      
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Connected Accounts</h2>
        <p className="text-[#71717a] text-sm mb-6">
          Connect your password manager to link credentials to your assets. 
        </p>
        ... Bitwarden connection UI was here ...
      </div>
      
      ============================================================
      */}

    </div>
  )
}
