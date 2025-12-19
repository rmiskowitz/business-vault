'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Connection {
  id: string
  provider: string
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/credentials/connect', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
      }
    } catch (err) {
      console.error('Error fetching connections:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setConnecting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Please log in to continue')
        return
      }

      const response = await fetch('/api/credentials/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          provider: 'bitwarden',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to connect')
        return
      }

      setSuccess('Bitwarden connected successfully!')
      setShowConnectModal(false)
      setClientId('')
      setClientSecret('')
      fetchConnections()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async (provider: string) => {
    if (!confirm('Are you sure you want to disconnect? All credential mappings will be removed.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/credentials/disconnect?provider=${provider}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        setSuccess('Provider disconnected')
        fetchConnections()
      }
    } catch (err) {
      setError('Failed to disconnect')
    }
  }

  const bitwardenConnected = connections.some(c => c.provider === 'bitwarden')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-[#71717a] mt-1">Manage your account and integrations</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
          {success}
        </div>
      )}

      {/* Connected Accounts Section */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">Connected Accounts</h2>
        <p className="text-[#71717a] text-sm mb-6">
          Connect your password manager to link credentials to your assets. 
          Your master password is never stored — we use secure API tokens.
        </p>

        {loading ? (
          <div className="text-[#71717a]">Loading...</div>
        ) : (
          <div className="space-y-4">
            {/* Bitwarden Connection Card */}
            <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#175DDC] rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Bitwarden</h3>
                    <p className="text-[#71717a] text-sm">
                      {bitwardenConnected ? (
                        <span className="text-green-400">Connected</span>
                      ) : (
                        'Not connected'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {bitwardenConnected ? (
                    <>
                      <Link
                        href="/dashboard/settings/credentials"
                        className="px-4 py-2 bg-[#f59e0b] text-black rounded-lg text-sm font-medium hover:bg-[#d97706] transition-colors"
                      >
                        Manage Mappings
                      </Link>
                      <button
                        onClick={() => handleDisconnect('bitwarden')}
                        className="px-4 py-2 bg-[#27272a] text-white rounded-lg text-sm font-medium hover:bg-[#3f3f46] transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowConnectModal(true)}
                      className="px-4 py-2 bg-[#f59e0b] text-black rounded-lg text-sm font-medium hover:bg-[#d97706] transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 1Password - Coming Soon */}
            <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1A8CFF] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl font-bold">1P</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">1Password</h3>
                    <p className="text-[#71717a] text-sm">Coming soon</p>
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-[#27272a] text-[#71717a] rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4">How Credential Integration Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="text-white font-medium mb-1">Secure Connection</h3>
            <p className="text-[#71717a] text-sm">
              Connect using API credentials from your Bitwarden settings. Your master password is never shared.
            </p>
          </div>
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="text-white font-medium mb-1">Link to Assets</h3>
            <p className="text-[#71717a] text-sm">
              Map your vault items to Business Vault assets. Know exactly which credentials go with which services.
            </p>
          </div>
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4">
            <div className="text-2xl mb-2">👁️</div>
            <h3 className="text-white font-medium mb-1">Reveal On-Demand</h3>
            <p className="text-[#71717a] text-sm">
              Passwords are fetched in real-time when you need them, displayed briefly, and never stored in Business Vault.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Connect Bitwarden</h2>
            
            <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 mb-6">
              <p className="text-[#71717a] text-sm mb-3">
                To get your API credentials:
              </p>
              <ol className="text-[#71717a] text-sm space-y-2 list-decimal list-inside">
                <li>Log into <a href="https://vault.bitwarden.com" target="_blank" rel="noopener" className="text-[#f59e0b] hover:underline">vault.bitwarden.com</a></li>
                <li>Go to <strong className="text-white">Settings → Security → Keys</strong></li>
                <li>Scroll to <strong className="text-white">API Key</strong></li>
                <li>Click <strong className="text-white">View API Key</strong></li>
                <li>Copy your Client ID and Client Secret</li>
              </ol>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="user.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false)
                    setError('')
                    setClientId('')
                    setClientSecret('')
                  }}
                  className="flex-1 px-4 py-3 bg-[#27272a] text-white rounded-lg font-medium hover:bg-[#3f3f46] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="flex-1 px-4 py-3 bg-[#f59e0b] text-black rounded-lg font-medium hover:bg-[#d97706] transition-colors disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
