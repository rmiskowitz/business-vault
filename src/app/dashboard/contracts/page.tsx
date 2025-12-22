
'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ContractType, CONTRACT_TYPE_LABELS, CONTRACT_TYPE_CATEGORIES } from '@/lib/types'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'contracts' | 'ownership' | 'financial'>('all')

  const [formData, setFormData] = useState({
    name: '',
    type: 'other_contract' as ContractType,
    counterparty: '',
    effective_date: '',
    expiration_date: '',
    document_location: '',
    key_terms: '',
  })

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setContracts(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchContracts() }, [fetchContracts])

  const resetForm = () => {
    setFormData({ name: '', type: 'other_contract', counterparty: '', effective_date: '', expiration_date: '', document_location: '', key_terms: '' })
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
        counterparty: formData.counterparty || null,
        effective_date: formData.effective_date || null,
        expiration_date: formData.expiration_date || null,
        document_location: formData.document_location || null,
        key_terms: formData.key_terms || null,
      }

      if (editingId) {
        await supabase.from('contracts').update(payload).eq('id', editingId)
      } else {
        await supabase.from('contracts').insert(payload)
      }

      resetForm()
      await fetchContracts()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (contract: any) => {
    setFormData({
      name: contract.name,
      type: contract.type as ContractType,
      counterparty: contract.counterparty || '',
      effective_date: contract.effective_date || '',
      expiration_date: contract.expiration_date || '',
      document_location: contract.document_location || '',
      key_terms: contract.key_terms || '',
    })
    setEditingId(contract.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('contracts').delete().eq('id', id)
    setDeleteId(null)
    await fetchContracts()
  }

  const filteredContracts = contracts.filter((c) => {
    if (filter === 'all') return true
    if (filter === 'contracts') return CONTRACT_TYPE_CATEGORIES.contracts.includes(c.type)
    if (filter === 'ownership') return CONTRACT_TYPE_CATEGORIES.ownership.includes(c.type)
    if (filter === 'financial') return CONTRACT_TYPE_CATEGORIES.financial.includes(c.type)
    return true
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contracts & Legal</h1>
          <p className="mt-1 text-[#71717a]">Document contracts, ownership, and financial records</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]">
            <span>+</span><span>Document Item</span>
          </button>
        )}
      </div>

      {!showForm && contracts.length > 0 && (
        <div className="flex gap-2 mb-6">
          {(['all', 'contracts', 'ownership', 'financial'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm rounded-lg ${filter === f ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#18181b] text-[#71717a] hover:bg-[#27272a]'}`}>
              {f === 'all' ? 'All' : f === 'contracts' ? 'Contracts' : f === 'ownership' ? 'Ownership' : 'Financial'}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 mb-8 space-y-5">
          <h2 className="text-lg font-medium text-white mb-4">{editingId ? 'Edit Document' : 'Document New Item'}</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Document Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Document Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractType })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none">
              <optgroup label="Contracts">
                {CONTRACT_TYPE_CATEGORIES.contracts.map((type) => (<option key={type} value={type}>{CONTRACT_TYPE_LABELS[type as ContractType]}</option>))}
              </optgroup>
              <optgroup label="Ownership & Legal">
                {CONTRACT_TYPE_CATEGORIES.ownership.map((type) => (<option key={type} value={type}>{CONTRACT_TYPE_LABELS[type as ContractType]}</option>))}
              </optgroup>
              <optgroup label="Financial">
                {CONTRACT_TYPE_CATEGORIES.financial.map((type) => (<option key={type} value={type}>{CONTRACT_TYPE_LABELS[type as ContractType]}</option>))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Counterparty</label>
            <input type="text" value={formData.counterparty} onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Effective Date</label>
              <input type="date" value={formData.effective_date} onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Expiration Date</label>
              <input type="date" value={formData.expiration_date} onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white focus:border-[#f59e0b] outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Document Location</label>
            <input type="text" value={formData.document_location} onChange={(e) => setFormData({ ...formData, document_location: e.target.value })} placeholder="e.g., Google Drive > Contracts folder" className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Key Terms</label>
            <textarea value={formData.key_terms} onChange={(e) => setFormData({ ...formData, key_terms: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder-[#52525b] focus:border-[#f59e0b] outline-none resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a]">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706] disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      )}

      {!showForm && (
        <>
          {isLoading ? (
            <div className="text-center py-12 text-[#71717a]">Loading...</div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12 bg-[#0f0f12] rounded-xl border border-[#1e1e23]">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-white mb-2">Nothing documented yet</h3>
              <p className="text-[#71717a] mb-6">Start by documenting your contracts and legal documents.</p>
              <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]">Document Your First Item</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div key={contract.id} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{contract.name}</h3>
                      <p className="text-sm text-[#71717a]">{CONTRACT_TYPE_LABELS[contract.type as ContractType] || contract.type}</p>
                      {contract.counterparty && <p className="text-sm text-[#52525b]">Party: {contract.counterparty}</p>}
                      {contract.expiration_date && <p className="text-sm text-[#52525b]">Expires: {new Date(contract.expiration_date).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(contract)} className="p-2 text-[#71717a] hover:text-white">✏️</button>
                      <button onClick={() => setDeleteId(contract.id)} className="p-2 text-[#71717a] hover:text-red-400">🗑️</button>
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
            <h3 className="text-lg font-medium text-white mb-2">Delete Document</h3>
            <p className="text-[#a1a1aa] mb-4">Are you sure you want to delete this document?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a]">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}