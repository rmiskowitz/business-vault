'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const checklistItems = [
    {
      icon: '🌐',
      title: 'Digital Assets',
      description: 'My digital assets are documented, inventoried, and access is ready-to-transfer',
    },
    {
      icon: '📅',
      title: 'Expiration Tracking',
      description: 'I know what\'s expiring in the next 90 days — domains, contracts, subscriptions',
    },
    {
      icon: '📄',
      title: 'Contracts & Compliance',
      description: 'My contracts, insurance policies, and compliance documents are organized and documented',
    },
    {
      icon: '🤝',
      title: 'Key Relationships',
      description: 'Key vendor, advisor, and partner relationships are organized and documented',
    },
    {
      icon: '🏢',
      title: 'Physical Assets',
      description: 'My physical assets are tracked and documentation is stored',
    },
  ];

  const getStatusColor = () => {
    const count = checkedItems.size;
    if (count <= 1) return 'text-red-500';
    if (count <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getStatusText = () => {
    const count = checkedItems.size;
    if (count === 0) return 'At Risk';
    if (count <= 1) return 'At Risk';
    if (count <= 3) return 'Needs Work';
    if (count <= 4) return 'Almost Ready';
    return 'Deal-Ready';
  };

  const getStatusMessage = () => {
    const count = checkedItems.size;
    if (count <= 1) return 'Your business isn\'t ready for due diligence. Gaps like these stall deals and cost you leverage.';
    if (count <= 3) return 'You\'re partially prepared, but buyers will find gaps. Close them before they cost you.';
    if (count <= 4) return 'You\'re close. One more area documented and you\'re ahead of most sellers.';
    return 'You\'re ahead of most business owners. Business Vault keeps you organized and deal-ready.';
  };

  // Traffic light state
  const getTrafficLightState = () => {
    const count = checkedItems.size;
    if (count <= 1) return 'red';
    if (count <= 3) return 'amber';
    return 'green';
  };

  const storyCards = [
    {
      image: '/selling.jpg',
      title: 'Your deal stalls in diligence',
      description: 'The buyer asks for contracts, asset lists, logins, and proof of ownership. Everything lives in emails, old folders, or your head. Momentum slows. Confidence drops. The deal gets renegotiated — or dies.',
      featured: true,
    },
    {
      image: '/employee.jpg',
      title: 'Knowledge walks out the door',
      description: 'Critical systems, subscriptions, and vendor relationships were never documented. The business keeps running — but no one knows how. Buyers notice immediately.',
      featured: false,
    },
    {
      image: '/vendor.jpg',
      title: 'No contract. No leverage.',
      description: 'A vendor dispute surfaces during diligence. You can\'t find the agreement. The buyer flags risk. Your valuation takes a hit.',
      featured: false,
    },
    {
      image: '/website.jpg',
      title: 'You don\'t control what you think you own',
      description: 'Domains, hosting, email, payment systems, and SaaS accounts aren\'t clearly owned or transferable. Buyers see operational risk instead of opportunity.',
      featured: false,
    },
  ];

  const pricingTiers = [
    {
      label: 'Getting Started',
      name: 'Deal-Ready Starter',
      price: 'Free',
      period: '',
      features: ['Up to 5 assets total', 'All 5 asset categories', 'Basic PDF export', 'Dashboard overview'],
      cta: 'Build Your Vault',
      href: '/signup',
      highlighted: false,
    },
    {
      label: 'Solo Sellers',
      name: 'Seller',
      price: billingCycle === 'monthly' ? '$9' : '$7',
      period: '/month',
      features: ['Up to 50 assets', 'Expiration alerts', 'Unlimited PDF exports', 'Email support'],
      cta: 'Build Your Vault',
      href: '/signup',
      highlighted: false,
    },
    {
      label: 'Teams of 1–10',
      name: 'Seller + Team',
      price: billingCycle === 'monthly' ? '$19' : '$15',
      period: '/month',
      features: ['Up to 200 assets', '3 team members', 'Advanced reporting', 'Asset transfer (Coming Soon)'],
      cta: 'Build Your Vault',
      href: '/signup',
      highlighted: true,
    },
    {
      label: 'Scaling Teams',
      name: 'Broker Ready',
      price: billingCycle === 'monthly' ? '$39' : '$31',
      period: '/month',
      features: ['Unlimited assets', '10 team members', 'White-label exports', 'Priority support'],
      cta: 'Build Your Vault',
      href: '/signup',
      highlighted: false,
    },
  ];

  // Readiness percentage for dashboard
  const getReadinessPercent = () => {
    return Math.round((checkedItems.size / 5) * 100);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">
            Business Vault
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Pricing
            </Link>
            <Link href="#assessment" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Assessment
            </Link>
            <Link href="/brokers" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
              For Brokers
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Build Your Vault
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-4">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Features
            </Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Pricing
            </Link>
            <Link href="#assessment" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Assessment
            </Link>
            <Link href="/brokers" onClick={() => setMobileMenuOpen(false)} className="block text-amber-500 hover:text-amber-400 transition-colors font-medium py-2">
              For Brokers
            </Link>
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Build Your Vault
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6">
              Get Your Business Deal-Ready{' '}
              <span className="text-amber-500">Before Due Diligence Starts</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl">
              Business Vault organizes the exact assets buyers need — contracts, financial and legal records, digital access, subscriptions, physical assets, and key relationships — so deals move faster and don't stall, drag, or collapse under scrutiny.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 sm:px-8 py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors text-center"
              >
                Create Your Deal-Ready Vault →
              </Link>
              <Link
                href="/brokers"
                className="border border-amber-500 text-amber-500 hover:bg-amber-500/10 px-6 sm:px-8 py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors text-center"
              >
                For Brokers →
              </Link>
            </div>
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="mt-12 sm:mt-16 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Window Chrome */}
            <div className="bg-zinc-800/50 px-4 py-3 flex items-center justify-between border-b border-zinc-700/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1 rounded-md">
                <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-zinc-500 text-xs">businessvault.io/dashboard</span>
              </div>
              <div className="w-16"></div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-4 sm:p-6">
              {/* Header with Readiness Badge */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Your Deal-Ready Vault</h3>
                  <p className="text-zinc-500 text-sm">Acme Corp — Last updated today</p>
                </div>
                {/* Readiness Badge */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Readiness</div>
                    <div className="text-2xl font-bold text-emerald-500">87%</div>
                  </div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="87, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-500 sm:hidden">87%</span>
                      <svg className="w-5 h-5 text-emerald-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl sm:text-2xl">🌐</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Ready</span>
                  </div>
                  <div className="text-zinc-400 text-xs sm:text-sm">Digital Assets</div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-100">12</div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl sm:text-2xl">📄</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Ready</span>
                  </div>
                  <div className="text-zinc-400 text-xs sm:text-sm">Contracts</div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-100">8</div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl sm:text-2xl">💳</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">2 Expiring</span>
                  </div>
                  <div className="text-zinc-400 text-xs sm:text-sm">Subscriptions</div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-100">$2,847<span className="text-sm text-zinc-500">/mo</span></div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl sm:text-2xl">🏢</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Ready</span>
                  </div>
                  <div className="text-zinc-400 text-xs sm:text-sm">Physical Assets</div>
                  <div className="text-xl sm:text-2xl font-bold text-zinc-100">34</div>
                </div>
              </div>

              {/* Alert Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 text-lg">⚠️</span>
                  <div>
                    <span className="text-amber-500 text-sm font-medium">Action Required</span>
                    <span className="text-zinc-400 text-sm hidden sm:inline"> — </span>
                    <span className="text-zinc-400 text-sm hidden sm:inline">acme-corp.com expires in 7 days</span>
                    <span className="text-zinc-400 text-xs sm:hidden block">acme-corp.com — 7 days</span>
                  </div>
                </div>
                <button className="text-amber-500 text-sm font-medium hover:text-amber-400 hidden sm:block">
                  Renew Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            How deal-ready is your business today?
          </h2>
          <p className="text-zinc-400 text-center mb-8 sm:mb-12 text-base sm:text-lg">
            Most owners can't confidently answer yes to all five.
          </p>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 sm:p-8">
            {/* Assessment Content with Traffic Light */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Checklist */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 lg:hidden">
                  <span className="text-zinc-500 text-sm">Tap each item you have documented</span>
                </div>
                <div className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCheck(index)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all ${
                        checkedItems.has(index)
                          ? 'bg-emerald-500/10 border-emerald-500/50'
                          : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 active:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            checkedItems.has(index)
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-zinc-600'
                          }`}
                        >
                          {checkedItems.has(index) && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base sm:text-lg">{item.icon}</span>
                            <span className="font-semibold text-zinc-100 text-sm sm:text-base">{item.title}</span>
                          </div>
                          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Traffic Light - Desktop (Vertical) */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <div className="text-zinc-500 text-sm mb-3">← Click to select</div>
                <div className="bg-zinc-800 rounded-2xl p-3 border border-zinc-700">
                  <div className="flex flex-col gap-3">
                    {/* Red Light */}
                    <div className="relative">
                      <div 
                        className={`w-12 h-12 rounded-full transition-all duration-500 ${
                          getTrafficLightState() === 'red' 
                            ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
                            : 'bg-red-500/20'
                        }`}
                      />
                      {getTrafficLightState() === 'red' && (
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                      )}
                    </div>
                    {/* Amber Light */}
                    <div className="relative">
                      <div 
                        className={`w-12 h-12 rounded-full transition-all duration-500 ${
                          getTrafficLightState() === 'amber' 
                            ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                            : 'bg-amber-500/20'
                        }`}
                      />
                      {getTrafficLightState() === 'amber' && (
                        <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-30" />
                      )}
                    </div>
                    {/* Green Light */}
                    <div className="relative">
                      <div 
                        className={`w-12 h-12 rounded-full transition-all duration-500 ${
                          getTrafficLightState() === 'green' 
                            ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]' 
                            : 'bg-emerald-500/20'
                        }`}
                      />
                      {getTrafficLightState() === 'green' && (
                        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                      )}
                    </div>
                  </div>
                </div>
                <div className={`mt-3 font-bold text-lg ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
                <div className="text-zinc-500 text-sm">
                  {checkedItems.size} of 5
                </div>
              </div>
            </div>

            {/* Traffic Light - Mobile (Horizontal) */}
            <div className="lg:hidden mt-6 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700 flex items-center gap-3">
                  {/* Red */}
                  <div className="relative">
                    <div 
                      className={`w-8 h-8 rounded-full transition-all duration-500 ${
                        getTrafficLightState() === 'red' 
                          ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' 
                          : 'bg-red-500/20'
                      }`}
                    />
                  </div>
                  {/* Amber */}
                  <div className="relative">
                    <div 
                      className={`w-8 h-8 rounded-full transition-all duration-500 ${
                        getTrafficLightState() === 'amber' 
                          ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                          : 'bg-amber-500/20'
                      }`}
                    />
                  </div>
                  {/* Green */}
                  <div className="relative">
                    <div 
                      className={`w-8 h-8 rounded-full transition-all duration-500 ${
                        getTrafficLightState() === 'green' 
                          ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' 
                          : 'bg-emerald-500/20'
                      }`}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className={`font-bold text-lg ${getStatusColor()}`}>
                    {getStatusText()}
                  </div>
                  <div className="text-zinc-500 text-sm">{checkedItems.size} of 5</div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-zinc-400 text-sm mb-6 text-center lg:text-left">
                {getStatusMessage()}
              </p>
              <Link
                href="/signup"
                className="block w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 sm:py-4 rounded-lg font-semibold text-center transition-colors"
              >
                Create Your Deal-Ready Vault →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            What happens when you're{' '}
            <span className="text-amber-500">not ready.</span>
          </h2>
          <p className="text-zinc-400 text-center mb-10 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            You don't think about your documentation — until it costs you the deal.
          </p>

          {/* Featured Story Card */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-zinc-900 rounded-2xl border-2 border-amber-500/30 overflow-hidden hover:border-amber-500/50 transition-colors">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-zinc-800 relative">
                  <img
                    src={storyCards[0].image}
                    alt={storyCards[0].title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-transparent to-transparent md:bg-gradient-to-t"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-2 py-1 rounded">
                      #1 Deal Killer
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-zinc-100">{storyCards[0].title}</h3>
                  <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{storyCards[0].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Story Cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {storyCards.slice(1).map((card, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="aspect-video bg-zinc-800 relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg font-bold mb-2 text-zinc-100">{card.title}</h3>
                  <p className="text-zinc-400 text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Due Diligence Reality Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            The gap between what buyers need{' '}
            <span className="text-amber-500">and what sellers have.</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            This is where deals slow down, get renegotiated, or fall apart.
          </p>

          {/* Two Column Comparison */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left Column - What Buyers Need */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100">What Buyers Need</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-zinc-300 text-sm sm:text-base">
                  Signed contracts and agreements
                </li>
                <li className="text-zinc-300 text-sm sm:text-base">
                  Financial and legal records
                </li>
                <li className="text-zinc-300 text-sm sm:text-base">
                  Proof of digital ownership and access
                </li>
                <li className="text-zinc-300 text-sm sm:text-base">
                  Active subscriptions and systems
                </li>
                <li className="text-zinc-300 text-sm sm:text-base">
                  Physical asset inventory
                </li>
                <li className="text-zinc-300 text-sm sm:text-base">
                  Key relationships and dependencies
                </li>
              </ul>
            </div>

            {/* Right Column - What Sellers Usually Have */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-400">What Sellers Usually Have</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-zinc-500 text-sm sm:text-base">
                  Files scattered across drives and inboxes
                </li>
                <li className="text-zinc-500 text-sm sm:text-base">
                  Passwords tied to individuals
                </li>
                <li className="text-zinc-500 text-sm sm:text-base">
                  Subscriptions no one fully tracks
                </li>
                <li className="text-zinc-500 text-sm sm:text-base">
                  Outdated or incomplete asset lists
                </li>
                <li className="text-zinc-500 text-sm sm:text-base">
                  Critical relationships undocumented
                </li>
                <li className="text-zinc-500 text-sm sm:text-base italic">
                  &nbsp;
                </li>
              </ul>
            </div>

          </div>

          {/* Bridge Statement */}
          <div className="mt-10 sm:mt-12 text-center">
            <p className="text-zinc-300 text-base sm:text-lg mb-6">
              Business Vault closes this gap — before buyers ever ask.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors"
            >
              Build Your Vault →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Simple Pricing. Start Free.
          </h2>
          <p className="text-zinc-400 text-center mb-6 sm:mb-8 text-base sm:text-lg">
            Document your first 5 assets at no cost. Upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                billingCycle === 'monthly'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                billingCycle === 'annual'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-5 sm:p-6 relative ${
                  tier.highlighted
                    ? 'bg-amber-500/10 border-amber-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-zinc-400 text-xs sm:text-sm mb-1">{tier.label}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{tier.name}</h3>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold">{tier.price}</span>
                  <span className="text-zinc-400 text-sm sm:text-base">{tier.period}</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className={feature.includes('Coming Soon') ? 'text-zinc-500' : 'text-emerald-500'}>
                        {feature.includes('Coming Soon') ? '◦' : '✓'}
                      </span>
                      <span className={feature.includes('Coming Soon') ? 'text-zinc-500' : 'text-zinc-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block w-full py-2.5 sm:py-3 rounded-lg font-semibold text-center transition-colors text-sm sm:text-base ${
                    tier.highlighted
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Broker CTA */}
          <div className="mt-8 sm:mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Are you a business broker?</h3>
            <p className="text-zinc-400 text-sm sm:text-base mb-4">
              Standardize deal readiness across your listings. Get priority support and white-label options.
            </p>
            <Link 
              href="/brokers" 
              className="inline-block bg-amber-500/10 border border-amber-500 text-amber-500 hover:bg-amber-500/20 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn About the Broker Program →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Know what you have.{' '}
            <span className="text-amber-500">Access it when it matters.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-6 sm:mb-8">
            Don't wait for due diligence to discover what's missing. Start documenting your business today.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors"
          >
            Build Your Vault →
          </Link>
          <p className="text-zinc-500 text-xs sm:text-sm mt-4">
            Free for up to 5 assets. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-zinc-500 text-xs sm:text-sm">
            © 2025 Business Vault. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-zinc-500 text-xs sm:text-sm">
            <span className="hidden sm:inline">Patent Pending</span>
            <Link href="/brokers" className="hover:text-zinc-300 transition-colors">
              For Brokers
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
