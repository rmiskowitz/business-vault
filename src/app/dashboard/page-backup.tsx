'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    physical: 0,
    digital: 0,
    contracts: 0,
    subscriptions: 0,
    contacts: 0,
    totalValue: 0,
    monthlySpend: 0,
  })
  const [expiring, setExpiring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const userId = session.user.id

      // Fetch counts from each table
      const [physical, digital, contracts, subscriptions, contacts] = await Promise.all([
        supabase.from('physical_assets').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('digital_assets').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('contracts').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('subscriptions').select('*', { count: 'exact' }).eq('user_id', userId),
        supabase.from('key_contacts').select('*', { count: 'exact' }).eq('user_id', userId),
      ])

      // Calculate total value from physical assets
      const totalValue = physical.data?.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0) || 0

      // Calculate monthly spend from subscriptions
      const monthlySpend = subscriptions.data?.reduce((sum, item) => {
        const cost = parseFloat(item.cost) || 0
        if (item.billing_cycle === 'yearly') return sum + (cost / 12)
        if (item.billing_cycle === 'quarterly') return sum + (cost / 3)
        return sum + cost
      }, 0) || 0

      // Get expiring items (next 30 days)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      const today = new Date().toISOString().split('T')[0]
      const futureDate = thirtyDaysFromNow.toISOString().split('T')[0]

      const expiringItems: any[] = []

      // Check digital assets for expiring domains/certs
      digital.data?.forEach(item => {
        if (item.expiration_date && item.expiration_date >= today && item.expiration_date <= futureDate) {
          expiringItems.push({
            type: 'Digital',
            name: item.name,
            date: item.expiration_date,
            icon: '🌐'
          })
        }
      })

      // Check contracts for expiring agreements
      contracts.data?.forEach(item => {
        if (item.end_date && item.end_date >= today && item.end_date <= futureDate) {
          expiringItems.push({
            type: 'Contract',
            name: item.contract_name,
            date: item.end_date,
            icon: '📄'
          })
        }
      })

      // Check subscriptions for renewals
      subscriptions.data?.forEach(item => {
        if (item.renewal_date && item.renewal_date >= today && item.renewal_date <= futureDate) {
          expiringItems.push({
            type: 'Subscription',
            name: item.service_name,
            date: item.renewal_date,
            icon: '💳'
          })
        }
      })

      // Sort by date
      expiringItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setStats({
        physical: physical.count || 0,
        digital: digital.count || 0,
        contracts: contracts.count || 0,
        subscriptions: subscriptions.count || 0,
        contacts: contacts.count || 0,
        totalValue,
        monthlySpend,
      })
      setExpiring(expiringItems.slice(0, 5))
      setLoading(false)
    }

    fetchData()
  }, [])

  const totalAssets = stats.physical + stats.digital + stats.contracts + stats.subscriptions + stats.contacts

  const statCards = [
    { label: 'Total Assets', value: totalAssets, icon: '📊', href: '#', color: 'rgba(245,158,11,0.15)' },
    { label: 'Physical Assets', value: stats.physical, icon: '🏢', href: '/dashboard/physical', color: 'rgba(168,85,247,0.15)' },
    { label: 'Digital Assets', value: stats.digital, icon: '🌐', href: '/dashboard/digital', color: 'rgba(59,130,246,0.15)' },
    { label: 'Contracts', value: stats.contracts, icon: '📄', href: '/dashboard/contracts', color: 'rgba(34,197,94,0.15)' },
    { label: 'Subscriptions', value: stats.subscriptions, icon: '💳', href: '/dashboard/subscriptions', color: 'rgba(236,72,153,0.15)' },
    { label: 'Key Contacts', value: stats.contacts, icon: '👥', href: '/dashboard/contacts', color: 'rgba(14,165,233,0.15)' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#a1a1aa]">Loading your assets...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#a1a1aa]">Overview of your business assets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] hover:translate-y-[-2px] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-sm text-[#a1a1aa] mb-1">{stat.label}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </Link>
        ))}
      </div>

      {/* Financial Summary & Expiring Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#27272a]">
              <span className="text-[#a1a1aa]">Total Asset Value</span>
              <span className="text-xl font-bold text-white">
                ${totalAssets > 0 ? stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[#a1a1aa]">Monthly Subscriptions</span>
              <span className="text-xl font-bold text-white">
                ${stats.monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Expiring Soon</h2>
          {expiring.length > 0 ? (
            <div className="space-y-3">
              {expiring.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#27272a] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-xs text-[#71717a]">{item.type}</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#f59e0b] font-medium">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#71717a] text-sm">No items expiring in the next 30 days.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-[#18181b] border border-[#27272a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/physical" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all">
            <span className="text-2xl">➕</span>
            <span className="text-sm text-[#a1a1aa]">Add Asset</span>
          </Link>
          <Link href="/dashboard/digital" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all">
            <span className="text-2xl">🌐</span>
            <span className="text-sm text-[#a1a1aa]">Add Domain</span>
          </Link>
          <Link href="/dashboard/contracts" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all">
            <span className="text-2xl">📄</span>
            <span className="text-sm text-[#a1a1aa]">Add Contract</span>
          </Link>
          <Link href="/dashboard/export" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 transition-all">
            <span className="text-2xl">📥</span>
            <span className="text-sm text-[#a1a1aa]">Export PDF</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
