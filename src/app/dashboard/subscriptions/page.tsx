'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Subscription } from '@/lib/types'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    cost: '',
    billing_cycle: 'monthly' as const,
    next_billing: '',
    credential_location: '',
    cancellation_terms: '',
    notes: '',
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setSubscriptions(data)
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
      cost: parseFloat(formData.cost),
    }

    if (editingId) {
      await supabase.from('subscriptions').update(payload).eq('id', editingId)
    } else {
      await supabase.from('subscriptions').insert(payload)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', provider: '', cost: '', billing_cycle: 'monthly', next_billing: '', credential_location: '', cancellation_terms: '', notes: '' })
    fetchSubscriptions()
  }

  const handleEdit = (sub: Subscription) => {
    setFormData({
      name: sub.name,
      provider: sub.provider,
      cost: sub.cost.toString(),
      billing_cycle: sub.billing_cycle as any,
      next_billing: sub.next_billing || '',
      credential_location: sub.credential_location,
      cancellation_terms: sub.cancellation_terms || '',
      notes: sub.notes || '',
    })
    setEditingId(sub.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await supabase.from('subscriptions').delete().eq('id', id)
      fetchSubscriptions()
    }
  }

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    if (sub.billing_cycle === 'monthly') return sum + sub.cost
    if (sub.billing_cycle === 'quarterly') return sum + (sub.cost / 3)
    if (sub.billing_cycle === 'annual') return sum + (sub.cost / 12)
    return sum
  }, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Monitor SaaS and recurring services</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Subscription
        </button>
      </div>

      {subscriptions.length > 0 && (
        <div className="card mb-6 bg-purple-50">
          <p className="text-purple-600 text-sm">Estimated Monthly Cost</p>
          <p className="text-3xl font-bold text-purple-700">${totalMonthly.toFixed(2)}</p>
        </div>
      )}

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Subscription</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Service Name *</label>
              <input className="input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Provider *</label>
              <input className="input" required value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} />
            </div>
            <div>
              <label className="label">Cost *</label>
              <input className="input" type="number" step="0.01" required value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
            </div>
            <div>
              <label className="label">Billing Cycle *</label>
              <select className="input" value={formData.billing_cycle} onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as any })}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="label">Next Billing Date</label>
              <input className="input" type="date" value={formData.next_billing} onChange={(e) => setFormData({ ...formData, next_billing: e.target.value })} />
            </div>
            <div>
              <label className="label">Credential Location *</label>
              <input className="input" required placeholder="Where are login credentials stored?" value={formData.credential_location} onChange={(e) => setFormData({ ...formData, credential_location: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Cancellation Terms</label>
              <input className="input" placeholder="e.g., 30 day notice, annual commitment" value={formData.cancellation_terms} onChange={(e) => setFormData({ ...formData, cancellation_terms: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Subscription</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No subscriptions yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Subscription</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{sub.name}</h3>
                  <p className="text-gray-600">{sub.provider}</p>
                  <p className="text-lg font-medium text-purple-600">${sub.cost} / {sub.billing_cycle}</p>
                  <p className="text-sm text-gray-500">Credentials: {sub.credential_location}</p>
                  {sub.next_billing && <p className="text-sm text-gray-500">Next billing: {sub.next_billing}</p>}
                  {sub.cancellation_terms && <p className="text-sm text-gray-500">Cancellation: {sub.cancellation_terms}</p>}
                  {sub.notes && <p className="text-sm text-gray-500 mt-2">{sub.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(sub)} className="text-blue-600 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
