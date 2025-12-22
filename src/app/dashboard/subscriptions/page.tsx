'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    monthly_cost: '',
    billing_cycle: 'monthly',
    renewal_date: '',
    credential_location: '',
    notes: '',
  })

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSubscriptions(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      monthly_cost: '',
      billing_cycle: 'monthly',
      renewal_date: '',
      credential_location: '',
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
        provider: formData.provider || null,
        monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : null,
        billing_cycle: formData.billing_cycle || null,
        renewal_date: formData.renewal_date || null,
        credential_location: formData.credential_location || null,
        notes: formData.notes || null,
      }

      if (editingId) {
        await supabase.from('subscriptions').update(payload).eq('id', editingId)
      } else {
        await supabase.from('subscriptions').insert(payload)
      }

      resetForm()
      await fetchSubscriptions()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (sub: any) => {
    setFormData({
      name: sub.name,
      provider: sub.provider || '',
      monthly_cost: sub.monthly_cost?.toString() || '',
      billing_cycle: sub.billing_cycle || 'monthly',
      renewal_date: sub.renewal_date || '',
      credential_location: sub.credential_location || '',
      notes: sub.notes || '',
    })
    setEditingId(sub.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('subscriptions').delete().eq('id', id)
    setDeleteId(null)
    await fetchSubscriptions()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
          <p className="mt-1 text-[#71717a]">
            Track software, services, and recurring subscriptions
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
          >
            <span>+</span>
            <span>Add Subscription</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8 space-y-5">
          <h2 className="text-lg font-medium text-white mb-4">
            {editingId ? 'Edit Subscription' : 'Add New Subscription'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Microsoft 365, Slack, QuickBooks"
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Provider
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Monthly Cost
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_cost}
                onChange={(e) => setFormData({ ...formData, monthly_cost: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Billing Cycle
              </label>
              <select
                value={formData.billing_cycle}
                onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Next Renewal Date
            </label>
            <input
              type="date"
              value={formData.renewal_date}
              onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Credential Location
            </label>
            <input
              type="text"
              value={formData.credential_location}
              onChange={(e) => setFormData({ ...formData, credential_location: e.target.value })}
              placeholder="e.g., 1Password > Business vault"
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
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
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 bg-[#0f0f12] rounded-xl border border-[#1e1e23]">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-white mb-2">No subscriptions yet</h3>
              <p className="text-[#71717a] mb-6">
                Track your software and service subscriptions.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
              >
                Add Your First Subscription
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{sub.name}</h3>
                      {sub.provider && (
                        <p className="text-sm text-[#71717a]">{sub.provider}</p>
                      )}
                      {sub.monthly_cost && (
                        <p className="text-sm text-[#52525b]">
                          ${sub.monthly_cost}/month
                        </p>
                      )}
                      {sub.renewal_date && (
                        <p className="text-sm text-[#52525b]">
                          Renews: {new Date(sub.renewal_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="p-2 text-[#71717a] hover:text-white"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteId(sub.id)}
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
            <h3 className="text-lg font-medium text-white mb-2">Delete Subscription</h3>
            <p className="text-[#a1a1aa] mb-4">
              Are you sure you want to delete this subscription?
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
