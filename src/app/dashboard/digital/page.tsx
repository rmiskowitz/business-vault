'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DigitalAsset } from '@/lib/types'

export default function DigitalAssetsPage() {
  const [assets, setAssets] = useState<DigitalAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'domain' as const,
    url: '',
    registrar: '',
    credential_location: '',
    expires: '',
    auto_renew: false,
    notes: '',
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAssets(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      ...formData,
      user_id: user.id,
    }

    if (editingId) {
      await supabase.from('digital_assets').update(payload).eq('id', editingId)
    } else {
      await supabase.from('digital_assets').insert(payload)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', type: 'domain', url: '', registrar: '', credential_location: '', expires: '', auto_renew: false, notes: '' })
    fetchAssets()
  }

  const handleEdit = (asset: DigitalAsset) => {
    setFormData({
      name: asset.name,
      type: asset.type,
      url: asset.url || '',
      registrar: asset.registrar || '',
      credential_location: asset.credential_location,
      expires: asset.expires || '',
      auto_renew: asset.auto_renew,
      notes: asset.notes || '',
    })
    setEditingId(asset.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await supabase.from('digital_assets').delete().eq('id', id)
      fetchAssets()
    }
  }

  const typeColors: Record<string, string> = {
    domain: 'bg-blue-100 text-blue-700',
    hosting: 'bg-green-100 text-green-700',
    social_media: 'bg-pink-100 text-pink-700',
    software: 'bg-purple-100 text-purple-700',
    other: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Assets</h1>
          <p className="text-gray-600 mt-1">Domains, hosting, and credential locations</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Asset
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Digital Asset</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Type *</label>
              <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
                <option value="domain">Domain</option>
                <option value="hosting">Hosting</option>
                <option value="social_media">Social Media</option>
                <option value="software">Software</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">URL</label>
              <input className="input" type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            </div>
            <div>
              <label className="label">Registrar/Provider</label>
              <input className="input" placeholder="e.g., GoDaddy, AWS, Google" value={formData.registrar} onChange={(e) => setFormData({ ...formData, registrar: e.target.value })} />
            </div>
            <div>
              <label className="label">Credential Location *</label>
              <input className="input" required placeholder="Where are login credentials stored?" value={formData.credential_location} onChange={(e) => setFormData({ ...formData, credential_location: e.target.value })} />
            </div>
            <div>
              <label className="label">Expires</label>
              <input className="input" type="date" value={formData.expires} onChange={(e) => setFormData({ ...formData, expires: e.target.value })} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto_renew" checked={formData.auto_renew} onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })} />
              <label htmlFor="auto_renew" className="text-sm text-gray-700">Auto-renew enabled</label>
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Asset</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading assets...</p>
      ) : assets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No digital assets yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Asset</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">{asset.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${typeColors[asset.type]}`}>
                      {asset.type.replace('_', ' ')}
                    </span>
                  </div>
                  {asset.url && <p className="text-blue-600 text-sm">{asset.url}</p>}
                  <p className="text-gray-600">Credentials: {asset.credential_location}</p>
                  {asset.registrar && <p className="text-sm text-gray-500">Provider: {asset.registrar}</p>}
                  {asset.expires && <p className="text-sm text-gray-500">Expires: {asset.expires} {asset.auto_renew && '(Auto-renew)'}</p>}
                  {asset.notes && <p className="text-sm text-gray-500 mt-2">{asset.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(asset)} className="text-blue-600 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
