'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSectionStatus, useUserContext, useVaultAccess } from '@/lib/hooks/useVaultAccess'
import { getReadinessColor } from '@/lib/types'

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊', sectionId: null },
  { href: '/dashboard/contracts', label: 'Contracts & Legal', icon: '📄', sectionId: 1 },
  { href: '/dashboard/digital', label: 'Digital', icon: '🌐', sectionId: 2 },
  { href: '/dashboard/physical', label: 'Physical Assets', icon: '🏢', sectionId: 3 },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: '💳', sectionId: 4 },
  { href: '/dashboard/contacts', label: 'Key Relationships', icon: '👥', sectionId: 5 },
  { href: '/dashboard/export', label: 'Download Report', icon: '📥', sectionId: null },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️', sectionId: null },
]

// ============================================================================
// COMPLETENESS BADGE COMPONENT
// ============================================================================

function CompletenessBadge({ status }: { status: 'not_started' | 'in_progress' | 'complete' }) {
  if (status === 'complete') {
    return (
      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
        <span className="text-xs text-green-400">✓</span>
      </span>
    )
  }
  if (status === 'in_progress') {
    return (
      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
      </span>
    )
  }
  return null
}

// ============================================================================
// READINESS INDICATOR COMPONENT
// ============================================================================

function ReadinessIndicator({ completeness }: { 
  completeness: {
    completedSections: number
    totalSections: number
    readinessLevel: string
  }
}) {
  const { completedSections, totalSections, readinessLevel } = completeness
  
  return (
    <div className="px-4 py-3 border-b border-[#1e1e23]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#71717a]">Deal Readiness</span>
        <span className={`text-xs font-medium ${getReadinessColor(readinessLevel as any)}`}>
          {readinessLevel}
        </span>
      </div>
      <div className="flex gap-1">
        {[...Array(totalSections)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < completedSections ? 'bg-[#f59e0b]' : 'bg-[#27272a]'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 text-xs text-[#52525b]">
        {completedSections} of {totalSections} sections complete
      </div>
    </div>
  )
}

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { context } = useUserContext()
  const { completeness, sectionStatuses } = useSectionStatus()
  const { activeReviewers } = useVaultAccess()

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

  // Get section status for nav items
  const getSectionStatus = (sectionId: number | null) => {
    if (sectionId === null) return null
    const status = sectionStatuses.find(s => s.section_id === sectionId)
    return status?.status || 'not_started'
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
            <span className="text-xl">🔒</span>
            <span className="font-serif font-semibold text-xl text-white">Deal-Ready Vault</span>
          </Link>
        </div>

        {/* Active Reviewers Indicator */}
        {context?.hasActiveReviewers && (
          <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">👥</span>
              <span className="text-xs text-blue-300">
                {context.activeReviewerCount} {context.activeReviewerCount === 1 ? 'person has' : 'people have'} access
              </span>
            </div>
          </div>
        )}

        {/* Readiness Indicator */}
        {!context?.isReviewer && sectionStatuses.length > 0 && (
          <ReadinessIndicator completeness={completeness} />
        )}
        
        <nav className="px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const sectionStatus = getSectionStatus(item.sectionId)
            
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
                <span className="font-medium flex-1">{item.label}</span>
                {sectionStatus && !context?.isReviewer && (
                  <CompletenessBadge status={sectionStatus as any} />
                )}
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