'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    
    if (error) {
      setMessage('Error sending reset email. Please try again.')
    } else {
      setMessage('Password reset email sent! Check your inbox.')
    }
    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.'
    )
    
    if (!confirmed) return

    const doubleConfirm = confirm(
      'This is your final warning. All your business assets, contracts, subscriptions, and contacts will be permanently deleted. Continue?'
    )

    if (!doubleConfirm) return

    // In a real app, you'd call an API endpoint to delete the user
    alert('Account deletion would be processed here. For security, this requires server-side implementation.')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Account Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Email</label>
              <p className="text-gray-900">{user?.email || 'Loading...'}</p>
            </div>
            <div>
              <label className="label">Account Created</label>
              <p className="text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Password</h2>
          <p className="text-gray-600 mb-4">
            Click below to receive a password reset email.
          </p>
          {message && (
            <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}
          <button 
            onClick={handlePasswordReset} 
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </div>

        {/* Data Export */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Data Export</h2>
          <p className="text-gray-600 mb-4">
            Download all your business asset data as a report.
          </p>
          <a href="/dashboard/export" className="btn-secondary inline-block">
            Go to Export Page
          </a>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          <p className="text-red-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
