'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export default function PhysicalAssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'equipment',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    location: '',
    condition: '',
    notes: '',
  })

  const fetchAssets = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('physical_assets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setAssets(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'equipment',
      serial_number: '',
      purchase_date: '',
      purchase_price: '',
      location: '',
      condition: '',
      notes: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const payload = {
        user_id: session.user.id,
        name: formData.name,
        type: formData.type,
        serial_number: formData.serial_number || null,
        purchase_date: formData.purchase_date || null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        location: formData.location || null,
        condition: formData.condition || null,
        notes: formData.notes || null,
      }

      if (editingId) {
        await supabase.from('physical_assets').update(payload).eq('id', editingId)
      } else {
        await supabase.from('physical_assets').insert(payload)
      }

      resetForm()
      await fetchAssets()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (asset: any) => {
    setFormData({
      name: asset.name,
      type: asset.type || 'equipment',
      serial_number: asset.serial_number || '',
      purchase_date: asset.purchase_date || '',
      purchase_price: asset.purchase_price?.toString() || '',
      location: asset.location || '',
      condition: asset.condition || '',
      notes: asset.notes || '',
    })
    setEditingId(asset.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('physical_assets').delete().eq('id', id)
    setDeleteId(null)
    await fetchAssets()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Physical Assets</h1>
          <p className="mt-1 text-[#71717a]">
            Document equipment, vehicles, and other physical assets
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
          >
            <span>+</span>
            <span>Add Asset</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8 space-y-5">
          <h2 className="text-lg font-medium text-white mb-4">
            {editingId ? 'Edit Asset' : 'Add New Asset'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Asset Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Asset Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
            >
              <option value="equipment">Equipment</option>
              <option value="vehicle">Vehicle</option>
              <option value="property">Property</option>
              <option value="furniture">Furniture</option>
              <option value="inventory">Inventory</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Serial Number / ID
            </label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Purchase Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Main Office, Warehouse"
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
            >
              <option value="">Select condition</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706] disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <>
          {isLoading ? (
            <div className="text-center py-12 text-[#71717a]">Loading...</div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12 bg-[#0f0f12] rounded-xl border border-[#1e1e23]">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-white mb-2">No assets yet</h3>
              <p className="text-[#71717a] mb-6">
                Document your equipment, vehicles, and other physical assets.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
              >
                Add Your First Asset
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{asset.name}</h3>
                      <p className="text-sm text-[#71717a] capitalize">{asset.type}</p>
                      {asset.location && (
                        <p className="text-sm text-[#52525b]">Location: {asset.location}</p>
                      )}
                      {asset.serial_number && (
                        <p className="text-sm text-[#52525b]">S/N: {asset.serial_number}</p>
                      )}
                      {asset.purchase_price && (
                        <p className="text-sm text-[#52525b]">
                          Value: ${asset.purchase_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="p-2 text-[#71717a] hover:text-white"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteId(asset.id)}
                        className="p-2 text-[#71717a] hover:text-red-400"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white mb-2">Delete Asset</h3>
            <p className="text-[#a1a1aa] mb-4">
              Are you sure you want to delete this asset?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

