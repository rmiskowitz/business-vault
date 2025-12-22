'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState({
    physical: true, digital: true, contracts: true, subscriptions: true, contacts: true,
  })

  const cats = [
    { key: 'physical', label: 'Physical Assets', icon: '🏢' },
    { key: 'digital', label: 'Digital Assets', icon: '🌐' },
    { key: 'contracts', label: 'Contracts', icon: '📄' },
    { key: 'subscriptions', label: 'Subscriptions', icon: '💳' },
    { key: 'contacts', label: 'Key Contacts', icon: '👥' },
  ]

  const handleExport = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const tables: Record<string, string> = {
      physical: 'physical_assets', digital: 'digital_assets',
      contracts: 'contracts', subscriptions: 'subscriptions', contacts: 'contacts',
    }
    const data: Record<string, any[]> = {}

    for (const [k, v] of Object.entries(selected)) {
      if (v) {
        const { data: items } = await supabase.from(tables[k]).select('*').eq('user_id', user.id)
        data[k] = items || []
      }
    }

    const date = new Date().toLocaleDateString()
    let html = `<!DOCTYPE html><html><head><title>Business Vault - ${date}</title>
    <style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px}
    h1{color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:10px}
    h2{color:#3b82f6;margin-top:30px}.item{background:#f9fafb;padding:15px;margin:10px 0;border-radius:8px;border-left:4px solid #3b82f6}
    .item h3{margin:0 0 5px}.item p{margin:3px 0;color:#6b7280;font-size:14px}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px}</style>
    </head><body><h1>Business Vault Report</h1><p>Generated: ${date}</p>`

    if (data.physical?.length) {
      html += `<h2>🏢 Physical Assets (${data.physical.length})</h2>`
      data.physical.forEach((i: any) => {
        html += `<div class="item"><h3>${i.name}</h3><p>${i.category} • ${i.location}</p>
        ${i.serial_number ? `<p>S/N: ${i.serial_number}</p>` : ''}${i.notes ? `<p>${i.notes}</p>` : ''}</div>`
      })
    }
    if (data.digital?.length) {
      html += `<h2>🌐 Digital Assets (${data.digital.length})</h2>`
      data.digital.forEach((i: any) => {
        html += `<div class="item"><h3>${i.name} (${i.type})</h3>
        <p><strong>Credentials:</strong> ${i.credential_location}</p>
        ${i.url ? `<p>${i.url}</p>` : ''}${i.expires ? `<p>Expires: ${i.expires}</p>` : ''}</div>`
      })
    }
    if (data.contracts?.length) {
      html += `<h2>📄 Contracts (${data.contracts.length})</h2>`
      data.contracts.forEach((i: any) => {
        html += `<div class="item"><h3>${i.name}</h3><p>${i.party} • ${i.type}</p>
        <p>${i.start_date} - ${i.end_date || 'Ongoing'}</p>${i.notes ? `<p>${i.notes}</p>` : ''}</div>`
      })
    }
    if (data.subscriptions?.length) {
      html += `<h2>💳 Subscriptions (${data.subscriptions.length})</h2>`
      data.subscriptions.forEach((i: any) => {
        html += `<div class="item"><h3>${i.name}</h3><p>${i.provider} • $${i.cost}/${i.billing_cycle}</p>
        <p><strong>Credentials:</strong> ${i.credential_location}</p></div>`
      })
    }
    if (data.contacts?.length) {
      html += `<h2>👥 Contacts (${data.contacts.length})</h2>`
      data.contacts.forEach((i: any) => {
        html += `<div class="item"><h3>${i.name}</h3><p>${i.role}${i.company ? ` at ${i.company}` : ''}</p>
        ${i.email ? `<p>${i.email}</p>` : ''}${i.phone ? `<p>${i.phone}</p>` : ''}</div>`
      })
    }

    html += `<div class="footer"><p>Confidential - Business Vault</p></div></body></html>`
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Export Report</h1>
        <p className="text-gray-600 mt-1">Generate a printable PDF of your business assets</p>
      </div>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Categories</h2>
        <div className="space-y-3">
          {cats.map((c) => (
            <label key={c.key} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={selected[c.key as keyof typeof selected]}
                onChange={(e) => setSelected({ ...selected, [c.key]: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600" />
              <span className="text-xl">{c.icon}</span>
              <span className="text-gray-700">{c.label}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleExport} disabled={loading} className="btn-primary text-lg px-8 py-3 disabled:opacity-50">
        {loading ? 'Generating...' : '📥 Generate Report'}
      </button>
      <p className="text-gray-500 text-sm mt-4">
        Report opens in a new window. Use your browser&apos;s Print function (Ctrl+P / Cmd+P) to save as PDF.
      </p>
    </div>
  )
}
