'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSectionStatus, useUserContext } from '@/lib/hooks/useVaultAccess'
import { getReadinessColor, getReadinessBgColor } from '@/lib/types'

// ============================================================================
// SECTION CARD COMPONENT
// ============================================================================

interface SectionCardProps {
  name: string
  icon: string
  href: string
  itemCount: number
  status: 'not_started' | 'in_progress' | 'complete'
}

function SectionCard({ name, icon, href, itemCount, status }: SectionCardProps) {
  const statusConfig = {
    not_started: {
      label: 'Not Started',
      bg: 'bg-[#18181b]',
      border: 'border-[#27272a]',
      text: 'text-[#52525b]',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
    },
    complete: {
      label: 'Complete',
      bg: 'bg-green-500/5',
      border: 'border-green-500/20',
      text: 'text-green-500',
    },
  }

  const config = statusConfig[status]

  return (
    <Link
      href={href}
      className={`block p-5 rounded-xl border transition-all duration-200 hover:border-[#f59e0b]/30 hover:bg-[#f59e0b]/5 ${config.bg} ${config.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl">{icon}</span>
          <h3 className="mt-3 font-medium text-white">{name}</h3>
          <p className="mt-1 text-sm text-[#71717a]">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} documented
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      </div>
    </Link>
  )
}

// ============================================================================
// READINESS SUMMARY COMPONENT
// ============================================================================

function ReadinessSummary({ completeness }: { 
  completeness: {
    completedSections: number
    totalSections: number
    readinessLevel: string
    inProgressSections: number
  }
}) {
  const { completedSections, totalSections, readinessLevel, inProgressSections } = completeness
  
  return (
    <div className={`rounded-xl border p-6 ${getReadinessBgColor(readinessLevel as any)} border-[#27272a]`}>
      <div className="flex items-center gap-4">
        <div className={`text-4xl ${getReadinessColor(readinessLevel as any)}`}>
          {readinessLevel === 'Deal-Ready' && '✓'}
          {readinessLevel === 'Almost Ready' && '◐'}
          {readinessLevel === 'In Progress' && '○'}
          {readinessLevel === 'Not Started' && '○'}
        </div>
        <div>
          <h2 className={`text-xl font-semibold ${getReadinessColor(readinessLevel as any)}`}>
            {readinessLevel}
          </h2>
          <p className="text-sm text-[#71717a] mt-1">
            {completedSections} of {totalSections} sections complete
            {inProgressSections > 0 && ` • ${inProgressSections} in progress`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex gap-1">
        {[...Array(totalSections)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < completedSections ? 'bg-[#f59e0b]' : 'bg-[#27272a]'
            }`}
          />
        ))}
      </div>

      {readinessLevel !== 'Deal-Ready' && (
        <p className="mt-4 text-sm text-[#71717a]">
          {readinessLevel === 'Not Started' && 'Start documenting your business assets to prepare for due diligence.'}
          {readinessLevel === 'In Progress' && 'Keep documenting! Complete all sections to be fully deal-ready.'}
          {readinessLevel === 'Almost Ready' && "You're almost there! Complete the remaining sections to be fully prepared."}
        </p>
      )}

      {readinessLevel === 'Deal-Ready' && (
        <p className="mt-4 text-sm text-green-400">
          Your vault is complete and ready for due diligence. You can invite a broker or buyer to review.
        </p>
      )}
    </div>
  )
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
  const { context } = useUserContext()
  const { completeness, sectionStatuses } = useSectionStatus()
  
  const [sectionCounts, setSectionCounts] = useState({
    contracts: 0,
    digital: 0,
    physical: 0,
    subscriptions: 0,
    contacts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch section counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        const [contracts, digital, physical, subscriptions, contacts] = await Promise.all([
          supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('digital_assets').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('physical_assets').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
          supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
        ])

        setSectionCounts({
          contracts: contracts.count || 0,
          digital: digital.count || 0,
          physical: physical.count || 0,
          subscriptions: subscriptions.count || 0,
          contacts: contacts.count || 0,
        })
      } catch (err) {
        console.error('Error fetching counts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCounts()
  }, [])

  const isReviewer = context?.isReviewer || false

  // Section configuration
  const sections = [
    { sectionId: 1, name: 'Contracts & Legal', icon: '📄', href: '/dashboard/contracts', itemCount: sectionCounts.contracts },
    { sectionId: 2, name: 'Digital Infrastructure', icon: '🌐', href: '/dashboard/digital', itemCount: sectionCounts.digital },
    { sectionId: 3, name: 'Physical Assets', icon: '🏢', href: '/dashboard/physical', itemCount: sectionCounts.physical },
    { sectionId: 4, name: 'Subscriptions', icon: '💳', href: '/dashboard/subscriptions', itemCount: sectionCounts.subscriptions },
    { sectionId: 5, name: 'Key Relationships', icon: '👥', href: '/dashboard/contacts', itemCount: sectionCounts.contacts },
  ]

  const getSectionStatus = (sectionId: number) => {
    const status = sectionStatuses.find(s => s.section_id === sectionId)
    return status?.status || 'not_started'
  }

  const totalItems = Object.values(sectionCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          {isReviewer ? 'Vault Review' : 'Your Deal-Ready Vault'}
        </h1>
        <p className="mt-1 text-[#71717a]">
          {isReviewer 
            ? 'Review documented business assets for due diligence' 
            : 'Document what buyers will request during due diligence'
          }
        </p>
      </div>

      {/* Readiness Summary */}
      {!isReviewer && sectionStatuses.length > 0 && (
        <div className="mb-8">
          <ReadinessSummary completeness={completeness} />
        </div>
      )}

      {/* Quick Actions */}
      {!isReviewer && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/dashboard/contracts"
            className="flex items-center gap-3 p-4 bg-[#0f0f12] rounded-xl border border-[#1e1e23] hover:border-[#f59e0b]/30 transition-colors"
          >
            <span className="text-xl">➕</span>
            <span className="text-sm text-[#a1a1aa]">Document Item</span>
          </Link>
          <Link
            href="/dashboard/export"
            className="flex items-center gap-3 p-4 bg-[#0f0f12] rounded-xl border border-[#1e1e23] hover:border-[#f59e0b]/30 transition-colors"
          >
            <span className="text-xl">📥</span>
            <span className="text-sm text-[#a1a1aa]">Download Report</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-4 bg-[#0f0f12] rounded-xl border border-[#1e1e23] hover:border-[#f59e0b]/30 transition-colors"
          >
            <span className="text-xl">👥</span>
            <span className="text-sm text-[#a1a1aa]">Invite Reviewer</span>
          </Link>
        </div>
      )}

      {/* Section Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[#71717a] mb-4">
          {isReviewer ? 'Documented Sections' : 'Your Sections'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <SectionCard
              key={section.sectionId}
              name={section.name}
              icon={section.icon}
              href={section.href}
              itemCount={section.itemCount}
              status={getSectionStatus(section.sectionId) as any}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && totalItems === 0 && !isReviewer && (
        <div className="text-center py-12 bg-[#0f0f12] rounded-xl border border-[#1e1e23]">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-white mb-2">Nothing documented yet</h3>
          <p className="text-[#71717a] mb-6 max-w-md mx-auto">
            Start building your deal-ready vault by documenting your business assets, 
            contracts, and key relationships.
          </p>
          <Link
            href="/dashboard/contracts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706] transition-colors"
          >
            Document Your First Item
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Deal-Ready CTA */}
      {!isReviewer && completeness.readinessLevel === 'Deal-Ready' && (
        <div className="mt-8 p-6 bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 rounded-xl border border-[#f59e0b]/20">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🎉</div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Your vault is Deal-Ready!</h3>
              <p className="text-sm text-[#71717a] mt-1">
                Invite a broker or potential buyer to review your documented assets.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 bg-[#f59e0b] text-black font-medium rounded-lg hover:bg-[#d97706] transition-colors"
            >
              Invite Reviewer
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}