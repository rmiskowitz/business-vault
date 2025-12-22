'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserContext, useDeleteConfirmation, useSectionStatus } from '@/lib/hooks/useVaultAccess'
import { ContractType, CONTRACT_TYPE_LABELS, CONTRACT_TYPE_CATEGORIES, SECTIONS } from '@/lib/types'

function DeleteModal({ isOpen, onClose, onConfirm, itemName, hasReviewers }: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  hasReviewers: boolean
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-white mb-2">Delete Document</h3>
        <p className="text-[#a1a1aa] mb-4">Are you sure you want to delete "{itemName}"?</p>
        {hasReviewers && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400">A broker or buyer has access to your vault.</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#18181b] text-[#a1a1aa] rounded-lg hover:bg-[#27272a]">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function ContractsPage() {
  const { context } = useUserContext()
  const { hasActiveReviewers } = useDeleteConfirmation()
  const { updateSectionStatus } = useSectionStatus()

  const [contracts, setContracts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; contract: any | null }>({ isOpen: false, contract: null })
  const [filter, setFilter] = useState<'all' | 'contracts' | 'ownership' | 'financial'>('all')

  const [formData, setFormData] = useState({
    name: '',
    type: 'other_contract' as ContractType,
    counterparty: '',
    effective_date: '',
    expiration_date: '',
    renewal_terms: '',
    document_location: '',
    key_terms: '',
    monthly_cost: '',
    internal_notes: ''
  })

  const isReviewer = context?.isReviewer || false

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
      
      if (!isReviewer) {
        const count = data?.length || 0
        const status = count === 0 ? 'not_started' : count >= 5 ? 'complete' : 'in_progress'
        await updateSectionStatus(SECTIONS.CONTRACTS_LEGAL, status, count)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isReviewer, updateSectionStatus])

  useEffect(() => { fetchContracts() }, [fetchContracts])

  const resetForm = () => {
    setFormData({ name: '', type: 'other_contract', counterparty: '', effective_date: '', expiration_date: '', renewal_terms: '', document_location: '', key_terms: '', monthly_cost: '', internal_notes: '' })
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
        renewal_terms: formData.renewal_terms || null,
        document_location: formData.document_location || null,
        key_terms: formData.key_terms || null,
        monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : null,
        internal_notes: formData.internal_notes || null,
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
      renewal_terms: contract.renewal_terms || '',
      document_location: contract.document_location || '',
      key_terms: contract.key_terms || '',
      monthly_cost: contract.monthly_cost?.toString() || '',
      internal_notes: contract.internal_notes || ''
    })
    setEditingId(contract.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteModal.contract) return
    await supabase.from('contracts').delete().eq('id', deleteModal.contract.id)
    setDeleteModal({ isOpen: false, contract: null })
    await fetchContracts()
  }

  const filteredContracts = contracts.filter((c) => {
    if (filter === 'all') return true
    if (filter === 'contracts') return CONTRACT_TYPE_CATEGORIES.contracts.includes(c.type)
    if (filter === 'ownership') return CONTRACT_TYPE_CATEGORIES.ownership.includes(c.type)
    if (filter === 'financial') return CONTRACT_TYPE_CATEGORIES.financial.includes(c.type)
    return true
  })

  const isFinancial = CONTRACT_TYPE_CATEGORIES.financial.includes(formData.type)
  const isContract = CONTRACT_TYPE_CATEGORIES.contracts.includes(formData.type)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contracts & Legal</h1>
          <p className="mt-1 text-[#71717a]">Document contracts, ownership, and financial records</p>
        </div>
        {!isReviewer && !showForm && (
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
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Document Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ContractType })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white">
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

          {isContract && (
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Counterparty</label>
              <input type="text" value={formData.counterparty} onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">{isFinancial ? 'Document Date' : 'Effective Date'}</label>
              <input type="date" value={formData.effective_date} onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white" />
            </div>
            {!isFinancial && (
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Expiration Date</label>
                <input type="date" value={formData.expiration_date} onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Document Location</label>
            <input type="text" value={formData.document_location} onChange={(e) => setFormData({ ...formData, document_location: e.target.value })} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">{isFinancial ? 'Key Figures' : 'Key Terms'}</label>
            <textarea value={formData.key_terms} onChange={(e) => setFormData({ ...formData, key_terms: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-white resize-none" />
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
              {!isReviewer && <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706]">Document Your First Item</button>}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div key={contract.id} className="bg-[#0f0f12] border border-[#1e1e23] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-white">{contract.name}</h3>
                      <p className="text-sm text-[#71717a]">{CONTRACT_TYPE_LABELS[contract.type as ContractType] || contract.type}</p>
                      {contract.expiration_date && <p className="text-sm text-[#52525b]">Expires: {new Date(contract.expiration_date).toLocaleDateString()}</p>}
                    </div>
                    {!isReviewer && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(contract)} className="p-2 text-[#71717a] hover:text-white">✏️</button>
                        <button onClick={() => setDeleteModal({ isOpen: true, contract })} className="p-2 text-[#71717a] hover:text-red-400">🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <DeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, contract: null })} onConfirm={handleDelete} itemName={deleteModal.contract?.name || ''} hasReviewers={hasActiveReviewers} />
    </div>
  )
}