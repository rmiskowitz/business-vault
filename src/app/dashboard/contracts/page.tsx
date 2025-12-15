'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contract } from '@/lib/types'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    type: '',
    start_date: '',
    end_date: '',
    value: '',
    auto_renew: false,
    document_location: '',
    notes: '',
  })

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setContracts(data)
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
      value: formData.value ? parseFloat(formData.value) : null,
    }

    if (editingId) {
      await supabase.from('contracts').update(payload).eq('id', editingId)
    } else {
      await supabase.from('contracts').insert(payload)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', party: '', type: '', start_date: '', end_date: '', value: '', auto_renew: false, document_location: '', notes: '' })
    fetchContracts()
  }

  const handleEdit = (contract: Contract) => {
    setFormData({
      name: contract.name,
      party: contract.party,
      type: contract.type,
      start_date: contract.start_date,
      end_date: contract.end_date || '',
      value: contract.value?.toString() || '',
      auto_renew: contract.auto_renew,
      document_location: contract.document_location || '',
      notes: contract.notes || '',
    })
    setEditingId(contract.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      await supabase.from('contracts').delete().eq('id', id)
      fetchContracts()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage agreements and renewal dates</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Contract
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Contract</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Contract Name *</label>
              <input className="input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Other Party *</label>
              <input className="input" required placeholder="Company or person name" value={formData.party} onChange={(e) => setFormData({ ...formData, party: e.target.value })} />
            </div>
            <div>
              <label className="label">Type *</label>
              <input className="input" required placeholder="e.g., Lease, Service, Employment" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
            </div>
            <div>
              <label className="label">Contract Value</label>
              <input className="input" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
            </div>
            <div>
              <label className="label">Start Date *</label>
              <input className="input" type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
            </div>
            <div>
              <label className="label">End Date</label>
              <input className="input" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
            <div>
              <label className="label">Document Location</label>
              <input className="input" placeholder="Where is the contract stored?" value={formData.document_location} onChange={(e) => setFormData({ ...formData, document_location: e.target.value })} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto_renew" checked={formData.auto_renew} onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })} />
              <label htmlFor="auto_renew" className="text-sm text-gray-700">Auto-renews</label>
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Contract</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No contracts yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Contract</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{contract.name}</h3>
                  <p className="text-gray-600">{contract.party} • {contract.type}</p>
                  <p className="text-sm text-gray-500">
                    {contract.start_date} - {contract.end_date || 'Ongoing'}
                    {contract.auto_renew && ' (Auto-renews)'}
                  </p>
                  {contract.value && <p className="text-sm text-gray-500">Value: ${contract.value.toLocaleString()}</p>}
                  {contract.document_location && <p className="text-sm text-gray-500">Location: {contract.document_location}</p>}
                  {contract.notes && <p className="text-sm text-gray-500 mt-2">{contract.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(contract)} className="text-blue-600 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(contract.id)} className="text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
