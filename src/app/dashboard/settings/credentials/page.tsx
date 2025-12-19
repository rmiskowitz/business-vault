'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface VaultItem {
  id: string
  name: string
  url: string | null
  username: string | null
  mapping: { asset_type: string; asset_id: string } | null
}

interface Asset {
  id: string
  name: string
  type: string
  table: string
}

export default function CredentialMappingsPage() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [revealedCredentials, setRevealedCredentials] = useState<{[key: string]: any}>({})
  const [revealing, setRevealing] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch vault items
      const itemsResponse = await fetch('/api/credentials/items', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!itemsResponse.ok) {
        const data = await itemsResponse.json()
        setError(data.error || 'Failed to fetch vault items')
        setLoading(false)
        return
      }

      const itemsData = await itemsResponse.json()
      setVaultItems(itemsData.items || [])
      setConnectionId(itemsData.connection_id)

      // Fetch all assets from all tables
      const [digital, physical, contracts, subscriptions] = await Promise.all([
        supabase.from('digital_assets').select('id, name').eq('user_id', session.user.id),
        supabase.from('physical_assets').select('id, name').eq('user_id', session.user.id),
        supabase.from('contracts').select('id, name').eq('user_id', session.user.id),
        supabase.from('subscriptions').select('id, name').eq('user_id', session.user.id),
      ])

      const allAssets: Asset[] = [
        ...(digital.data || []).map(a => ({ ...a, type: 'Digital Asset', table: 'digital_assets' })),
        ...(physical.data || []).map(a => ({ ...a, type: 'Physical Asset', table: 'physical_assets' })),
        ...(contracts.data || []).map(a => ({ ...a, type: 'Contract', table: 'contracts' })),
        ...(subscriptions.data || []).map(a => ({ ...a, type: 'Subscription', table: 'subscriptions' })),
      ]

      setAssets(allAssets)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleMapping = async (item: VaultItem, assetTable: string, assetId: string) => {
    if (!connectionId) return
    
    setSaving(item.id)
    setError('')
    setSuccess('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/credentials/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          connectionId,
          providerItemId: item.id,
          providerItemName: item.name,
          providerItemUrl: item.url,
          assetType: assetTable,
          assetId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save mapping')
        return
      }

      setSuccess(`Linked "${item.name}" to asset`)
      
      // Update local state
      setVaultItems(prev => prev.map(v => 
        v.id === item.id 
          ? { ...v, mapping: { asset_type: assetTable, asset_id: assetId } }
          : v
      ))
    } catch (err) {
      setError('Failed to save mapping')
    } finally {
      setSaving(null)
    }
  }

  const handleUnlink = async (item: VaultItem) => {
    setSaving(item.id)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get mapping ID first
      const mappingsResponse = await fetch(
        `/api/credentials/mappings?assetType=${item.mapping?.asset_type}&assetId=${item.mapping?.asset_id}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      )

      const mappingsData = await mappingsResponse.json()
      const mapping = mappingsData.mappings?.find((m: any) => m.provider_item_id === item.id)

      if (mapping) {
        await fetch(`/api/credentials/mappings?id=${mapping.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })
      }

      // Update local state
      setVaultItems(prev => prev.map(v => 
        v.id === item.id ? { ...v, mapping: null } : v
      ))

      setSuccess('Credential unlinked')
    } catch (err) {
      setError('Failed to unlink')
    } finally {
      setSaving(null)
    }
  }

  const handleReveal = async (itemId: string) => {
    setRevealing(itemId)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/credentials/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to reveal credentials')
        return
      }

      const data = await response.json()
      setRevealedCredentials(prev => ({ ...prev, [itemId]: data }))

      // Auto-hide after 30 seconds
      setTimeout(() => {
        setRevealedCredentials(prev => {
          const updated = { ...prev }
          delete updated[itemId]
          return updated
        })
      }, 30000)

    } catch (err) {
      setError('Failed to reveal credentials')
    } finally {
      setRevealing(null)
    }
  }

  const filteredItems = vaultItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#71717a]">Loading vault items...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#71717a] mb-2">
            <Link href="/dashboard/settings" className="hover:text-white">Settings</Link>
            <span>/</span>
            <span className="text-white">Credential Mappings</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Link Credentials to Assets</h1>
          <p className="text-[#71717a] mt-1">
            Connect your Bitwarden vault items to Business Vault assets
          </p>
        </div>
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

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search vault items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-[#09090b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
        />
        <svg className="absolute left-3 top-3.5 w-5 h-5 text-[#52525b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Vault Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-8 text-center">
            <p className="text-[#71717a]">
              {vaultItems.length === 0 
                ? 'No login items found in your Bitwarden vault'
                : 'No items match your search'
              }
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const linkedAsset = item.mapping 
              ? assets.find(a => a.table === item.mapping?.asset_type && a.id === item.mapping?.asset_id)
              : null
            const revealed = revealedCredentials[item.id]

            return (
              <div 
                key={item.id} 
                className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{item.name}</h3>
                    {item.url && (
                      <p className="text-[#71717a] text-sm truncate">{item.url}</p>
                    )}
                    {item.username && (
                      <p className="text-[#52525b] text-sm">User: {item.username}</p>
                    )}
                    
                    {/* Revealed Credentials */}
                    {revealed && (
                      <div className="mt-3 p-3 bg-[#09090b] border border-[#f59e0b]/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#f59e0b] text-xs font-medium">CREDENTIALS (auto-hides in 30s)</span>
                          <button
                            onClick={() => setRevealedCredentials(prev => {
                              const updated = { ...prev }
                              delete updated[item.id]
                              return updated
                            })}
                            className="text-[#71717a] hover:text-white text-xs"
                          >
                            Hide
                          </button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-[#71717a]">Username:</span> <span className="text-white font-mono">{revealed.username || 'N/A'}</span></p>
                          <p><span className="text-[#71717a]">Password:</span> <span className="text-white font-mono">{revealed.password || 'N/A'}</span></p>
                        </div>
                      </div>
                    )}

                    {/* Linked Asset Badge */}
                    {linkedAsset && (
                      <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs">
                        <span>✓ Linked to:</span>
                        <span className="font-medium">{linkedAsset.name}</span>
                        <span className="text-green-400/60">({linkedAsset.type})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Reveal Button */}
                    {!revealed && (
                      <button
                        onClick={() => handleReveal(item.id)}
                        disabled={revealing === item.id}
                        className="px-3 py-2 bg-[#27272a] text-white rounded-lg text-sm hover:bg-[#3f3f46] transition-colors disabled:opacity-50"
                      >
                        {revealing === item.id ? '...' : '👁️ Reveal'}
                      </button>
                    )}

                    {/* Link/Unlink */}
                    {linkedAsset ? (
                      <button
                        onClick={() => handleUnlink(item)}
                        disabled={saving === item.id}
                        className="px-3 py-2 bg-[#27272a] text-white rounded-lg text-sm hover:bg-[#3f3f46] transition-colors disabled:opacity-50"
                      >
                        {saving === item.id ? '...' : 'Unlink'}
                      </button>
                    ) : (
                      <select
                        onChange={(e) => {
                          const [table, id] = e.target.value.split('::')
                          if (table && id) {
                            handleMapping(item, table, id)
                          }
                        }}
                        disabled={saving === item.id}
                        className="px-3 py-2 bg-[#f59e0b] text-black rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {saving === item.id ? 'Saving...' : 'Link to Asset →'}
                        </option>
                        {assets.length === 0 ? (
                          <option disabled>No assets found</option>
                        ) : (
                          <>
                            <optgroup label="Digital Assets">
                              {assets.filter(a => a.table === 'digital_assets').map(a => (
                                <option key={a.id} value={`${a.table}::${a.id}`}>{a.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Subscriptions">
                              {assets.filter(a => a.table === 'subscriptions').map(a => (
                                <option key={a.id} value={`${a.table}::${a.id}`}>{a.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Contracts">
                              {assets.filter(a => a.table === 'contracts').map(a => (
                                <option key={a.id} value={`${a.table}::${a.id}`}>{a.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Physical Assets">
                              {assets.filter(a => a.table === 'physical_assets').map(a => (
                                <option key={a.id} value={`${a.table}::${a.id}`}>{a.name}</option>
                              ))}
                            </optgroup>
                          </>
                        )}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Stats */}
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#71717a]">
            {vaultItems.filter(v => v.mapping).length} of {vaultItems.length} credentials linked
          </span>
          <Link 
            href="/dashboard/settings" 
            className="text-[#f59e0b] hover:underline"
          >
            ← Back to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
