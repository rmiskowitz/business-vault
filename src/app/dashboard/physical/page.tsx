'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PhysicalAsset } from '@/lib/types'

export default function PhysicalAssetsPage() {
  const [assets, setAssets] = useState<PhysicalAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    warranty_expires: '',
    notes: '',
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('physical_assets')
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
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
    }

    if (editingId) {
      await supabase.from('physical_assets').update(payload).eq('id', editingId)
    } else {
      await supabase.from('physical_assets').insert(payload)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', category: '', location: '', serial_number: '', purchase_date: '', purchase_price: '', warranty_expires: '', notes: '' })
    fetchAssets()
  }

  const handleEdit = (asset: PhysicalAsset) => {
    setFormData({
      name: asset.name,
      category: asset.category,
      location: asset.location,
      serial_number: asset.serial_number || '',
      purchase_date: asset.purchase_date || '',
      purchase_price: asset.purchase_price?.toString() || '',
      warranty_expires: asset.warranty_expires || '',
      notes: asset.notes || '',
    })
    setEditingId(asset.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await supabase.from('physical_assets').delete().eq('id', id)
      fetchAssets()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Physical Assets</h1>
          <p className="text-gray-600 mt-1">Track equipment, vehicles, and property</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Asset
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Physical Asset</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category *</label>
              <input className="input" required placeholder="e.g., Equipment, Vehicle, Furniture" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div>
              <label className="label">Location *</label>
              <input className="input" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <label className="label">Serial Number</label>
              <input className="input" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} />
            </div>
            <div>
              <label className="label">Purchase Date</label>
              <input className="input" type="date" value={formData.purchase_date} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} />
            </div>
            <div>
              <label className="label">Purchase Price</label>
              <input className="input" type="number" step="0.01" value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} />
            </div>
            <div>
              <label className="label">Warranty Expires</label>
              <input className="input" type="date" value={formData.warranty_expires} onChange={(e) => setFormData({ ...formData, warranty_expires: e.target.value })} />
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
          <p className="text-gray-500 mb-4">No physical assets yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Asset</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{asset.name}</h3>
                  <p className="text-gray-600">{asset.category} • {asset.location}</p>
                  {asset.serial_number && <p className="text-sm text-gray-500">S/N: {asset.serial_number}</p>}
                  {asset.warranty_expires && <p className="text-sm text-gray-500">Warranty: {asset.warranty_expires}</p>}
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
