'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    notes: '',
  })

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setContacts(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      role: '',
      email: '',
      phone: '',
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
        company: formData.company || null,
        role: formData.role || null,
        email: formData.email || null,
        phone: formData.phone || null,
        notes: formData.notes || null,
      }

      if (editingId) {
        await supabase.from('contacts').update(payload).eq('id', editingId)
      } else {
        await supabase.from('contacts').insert(payload)
      }

      resetForm()
      await fetchContacts()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (contact: any) => {
    setFormData({
      name: contact.name,
      company: contact.company || '',
      role: contact.role || '',
      email: contact.email || '',
      phone: contact.phone || '',
      notes: contact.notes || '',
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('contacts').delete().eq('id', id)
    setDeleteId(null)
    await fetchContacts()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Key Relationships</h1>
          <p className="mt-1 text-[#71717a]">
            Document important contacts, vendors, and advisors
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
          >
            <span>+</span>
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8 space-y-5">
          <h2 className="text-lg font-medium text-white mb-4">
            {editingId ? 'Edit Contact' : 'Add New Contact'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Name *
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
              Company / Organization
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
              Role / Relationship
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Accountant, Supplier, Attorney"
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none"
              />
            </div>
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
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 bg-[#0f0f12] rounded-xl border border-[#1e1e23]">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-white mb-2">No contacts yet</h3>
              <p className="text-[#71717a] mb-6">
                Add your key business relationships, vendors, and advisors.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]"
              >
                Add Your First Contact
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{contact.name}</h3>
                      {contact.role && (
                        <p className="text-sm text-[#71717a]">{contact.role}</p>
                      )}
                      {contact.company && (
                        <p className="text-sm text-[#52525b]">{contact.company}</p>
                      )}
                      {contact.email && (
                        <p className="text-sm text-[#52525b]">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-sm text-[#52525b]">{contact.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="p-2 text-[#71717a] hover:text-white"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteId(contact.id)}
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
            <h3 className="text-lg font-medium text-white mb-2">Delete Contact</h3>
            <p className="text-[#a1a1aa] mb-4">
              Are you sure you want to delete this contact?
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
