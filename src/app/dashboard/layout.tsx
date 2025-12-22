// ============================================================================
// Business Vault: Deal-Ready Dashboard Layout
// app/dashboard/layout.tsx
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  useSectionStatus, 
  useUserContext, 
  useVaultAccess 
} from '@/lib/hooks/useVaultAccess';
import { 
  SECTION_NAMES, 
  SECTION_ICONS,
  getReadinessColor,
  getReadinessBgColor 
} from '@/lib/types';

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

const navigation = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: '📊',
    sectionId: null 
  },
  { 
    name: 'Contracts & Legal', 
    href: '/dashboard/contracts', 
    icon: '📄',
    sectionId: 1 
  },
  { 
    name: 'Digital Infrastructure', 
    href: '/dashboard/digital', 
    icon: '🌐',
    sectionId: 2 
  },
  { 
    name: 'Physical Assets', 
    href: '/dashboard/physical', 
    icon: '🏢',
    sectionId: 3 
  },
  { 
    name: 'Subscriptions', 
    href: '/dashboard/subscriptions', 
    icon: '💳',
    sectionId: 4 
  },
  { 
    name: 'Key Relationships', 
    href: '/dashboard/contacts', 
    icon: '👥',
    sectionId: 5 
  },
];

const bottomNavigation = [
  { name: 'Download Report', href: '/dashboard/export', icon: '📥' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

// ============================================================================
// COMPLETENESS BADGE COMPONENT
// ============================================================================

function CompletenessBadge({ 
  status 
}: { 
  status: 'not_started' | 'in_progress' | 'complete' 
}) {
  const config = {
    not_started: { 
      color: 'bg-zinc-700', 
      dot: 'bg-zinc-500',
      label: '' 
    },
    in_progress: { 
      color: 'bg-yellow-500/20', 
      dot: 'bg-yellow-500',
      label: '' 
    },
    complete: { 
      color: 'bg-green-500/20', 
      dot: 'bg-green-500',
      label: '✓' 
    },
  };

  const { color, dot, label } = config[status];

  return (
    <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full ${color}`}>
      {label ? (
        <span className="text-xs text-green-400">{label}</span>
      ) : (
        <span className={`h-2 w-2 rounded-full ${dot}`} />
      )}
    </span>
  );
}

// ============================================================================
// READINESS INDICATOR COMPONENT
// ============================================================================

function ReadinessIndicator({ 
  completeness 
}: { 
  completeness: {
    completedSections: number;
    totalSections: number;
    readinessLevel: string;
    overallPercentage: number;
  }
}) {
  const { completedSections, totalSections, readinessLevel, overallPercentage } = completeness;
  
  return (
    <div className="px-4 py-3 border-b border-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-400">Deal Readiness</span>
        <span className={`text-xs font-medium ${getReadinessColor(readinessLevel as any)}`}>
          {readinessLevel}
        </span>
      </div>
      <div className="flex gap-1">
        {[...Array(totalSections)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < completedSections 
                ? 'bg-amber-500' 
                : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 text-xs text-zinc-500">
        {completedSections} of {totalSections} sections complete
      </div>
    </div>
  );
}

// ============================================================================
// REVIEWER BANNER COMPONENT
// ============================================================================

function ReviewerBanner({ 
  ownerEmail, 
  role 
}: { 
  ownerEmail: string; 
  role: string 
}) {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-amber-500">👁️</span>
        <span className="text-sm text-amber-200">
          Viewing <span className="font-medium">{ownerEmail}</span>'s vault as {role}
        </span>
      </div>
      <p className="text-xs text-amber-400/70 mt-1">
        Read-only access • Some notes may be hidden
      </p>
    </div>
  );
}

// ============================================================================
// ACTIVE REVIEWERS INDICATOR
// ============================================================================

function ActiveReviewersIndicator({ count }: { count: number }) {
  if (count === 0) return null;
  
  return (
    <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
      <div className="flex items-center gap-2">
        <span className="text-blue-400">👥</span>
        <span className="text-xs text-blue-300">
          {count} {count === 1 ? 'person has' : 'people have'} access to your vault
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { context, isLoading: contextLoading } = useUserContext();
  const { completeness, sectionStatuses, isLoading: statusLoading } = useSectionStatus();
  const { activeReviewers } = useVaultAccess();

  // Auth check
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Get section status for nav items
  const getSectionStatus = (sectionId: number | null) => {
    if (sectionId === null) return null;
    const status = sectionStatuses.find(s => s.section_id === sectionId);
    return status?.status || 'not_started';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800"
      >
        <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-4 border-b border-zinc-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <span className="font-semibold text-white">Deal-Ready Vault</span>
            </Link>
          </div>

          {/* Reviewer Banner (if viewing as reviewer) */}
          {context?.isReviewer && (
            <ReviewerBanner 
              ownerEmail={context.vaultOwnerId || 'Unknown'} 
              role={context.reviewerRole || 'reviewer'} 
            />
          )}

          {/* Active Reviewers Indicator (if owner has reviewers) */}
          {!context?.isReviewer && context?.hasActiveReviewers && (
            <ActiveReviewersIndicator count={context.activeReviewerCount} />
          )}

          {/* Readiness Indicator */}
          {!statusLoading && !context?.isReviewer && (
            <ReadinessIndicator completeness={completeness} />
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const sectionStatus = getSectionStatus(item.sectionId);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {sectionStatus && !context?.isReviewer && (
                    <CompletenessBadge status={sectionStatus as any} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-2 py-4 border-t border-zinc-800 space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                <span className="text-amber-500 text-sm">
                  {user.email?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user.email}</p>
                <p className="text-xs text-zinc-500">
                  {context?.isReviewer ? 'Reviewer' : 'Owner'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}