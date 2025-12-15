'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contact } from '@/lib/types'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    category: 'vendor' as const,
    notes: '',
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setContacts(data)
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
      await supabase.from('contacts').update(payload).eq('id', editingId)
    } else {
      await supabase.from('contacts').insert(payload)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', company: '', role: '', email: '', phone: '', category: 'vendor', notes: '' })
    fetchContacts()
  }

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      company: contact.company || '',
      role: contact.role,
      email: contact.email || '',
      phone: contact.phone || '',
      category: contact.category as any,
      notes: contact.notes || '',
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await supabase.from('contacts').delete().eq('id', id)
      fetchContacts()
    }
  }

  const categoryColors: Record<string, string> = {
    vendor: 'bg-blue-100 text-blue-700',
    client: 'bg-green-100 text-green-700',
    partner: 'bg-purple-100 text-purple-700',
    contractor: 'bg-orange-100 text-orange-700',
    other: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Key Contacts</h1>
          <p className="text-gray-600 mt-1">Vendors, partners, and critical relationships</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Contact
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Contact</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
            <div>
              <label className="label">Role/Title *</label>
              <input className="input" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}>
                <option value="vendor">Vendor</option>
                <option value="client">Client</option>
                <option value="partner">Partner</option>
                <option value="contractor">Contractor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={3} placeholder="What do they handle? Important context?" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Contact</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No contacts yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Contact</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[contact.category]}`}>
                      {contact.category}
                    </span>
                  </div>
                  <p className="text-gray-600">{contact.role}{contact.company && ` at ${contact.company}`}</p>
                  {contact.email && <p className="text-sm text-blue-600">{contact.email}</p>}
                  {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                  {contact.notes && <p className="text-sm text-gray-500 mt-2">{contact.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(contact)} className="text-blue-600 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
