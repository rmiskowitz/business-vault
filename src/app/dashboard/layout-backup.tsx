'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/physical', label: 'Physical Assets', icon: '🏢' },
  { href: '/dashboard/digital', label: 'Digital', icon: '🌐' },
  { href: '/dashboard/contracts', label: 'Contracts', icon: '📄' },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: '💳' },
  { href: '/dashboard/contacts', label: 'Contacts', icon: '👥' },
  { href: '/dashboard/export', label: 'Export', icon: '📥' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-[#a1a1aa]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f0f12] border-r border-[#1e1e23] z-10">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-serif font-semibold text-xl text-white">Business Vault</span>
          </Link>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                    : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1e1e23]">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm text-[#71717a] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[#71717a] hover:text-[#f59e0b] text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
