'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AssetCounts {
  physical: number
  digital: number
  contracts: number
  subscriptions: number
  contacts: number
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<AssetCounts>({
    physical: 0,
    digital: 0,
    contracts: 0,
    subscriptions: 0,
    contacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const tables = ['physical_assets', 'digital_assets', 'contracts', 'subscriptions', 'contacts']
      const keys = ['physical', 'digital', 'contracts', 'subscriptions', 'contacts']
      
      const newCounts: AssetCounts = { physical: 0, digital: 0, contracts: 0, subscriptions: 0, contacts: 0 }
      
      for (let i = 0; i < tables.length; i++) {
        const { count } = await supabase
          .from(tables[i])
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        
        newCounts[keys[i] as keyof AssetCounts] = count || 0
      }
      
      setCounts(newCounts)
      setLoading(false)
    }
    
    fetchCounts()
  }, [])

  const cards = [
    { key: 'physical', label: 'Physical Assets', icon: '🏢', href: '/dashboard/physical', color: 'bg-orange-50 text-orange-600' },
    { key: 'digital', label: 'Digital Assets', icon: '🌐', href: '/dashboard/digital', color: 'bg-blue-50 text-blue-600' },
    { key: 'contracts', label: 'Contracts', icon: '📄', href: '/dashboard/contracts', color: 'bg-green-50 text-green-600' },
    { key: 'subscriptions', label: 'Subscriptions', icon: '💳', href: '/dashboard/subscriptions', color: 'bg-purple-50 text-purple-600' },
    { key: 'contacts', label: 'Key Contacts', icon: '👥', href: '/dashboard/contacts', color: 'bg-pink-50 text-pink-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your business assets</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading your assets...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
              <Link key={card.key} href={card.href}>
                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {counts[card.key as keyof AssetCounts]}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${card.color}`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/digital" className="btn-secondary text-center">
                + Add Digital Asset
              </Link>
              <Link href="/dashboard/contracts" className="btn-secondary text-center">
                + Add Contract
              </Link>
              <Link href="/dashboard/subscriptions" className="btn-secondary text-center">
                + Add Subscription
              </Link>
              <Link href="/dashboard/export" className="btn-primary text-center">
                Export PDF
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
