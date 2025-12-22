'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BrokersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    listings: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Formspree submission
    try {
      await fetch('https://formspree.io/f/xeoyywya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const painPoints = [
    {
      title: 'Deals drag on',
      description: 'Buyers request documentation. Sellers scramble. Weeks pass while everyone waits.',
      icon: '⏱️'
    },
    {
      title: 'Deals fall apart',
      description: 'Missing contracts, unclear ownership, inaccessible accounts. Buyers walk.',
      icon: '💔'
    },
    {
      title: 'You chase instead of close',
      description: 'Hours spent requesting asset lists, logins, and contracts that should already exist.',
      icon: '🔄'
    },
    {
      title: 'Valuations get renegotiated',
      description: 'Documentation gaps signal risk. Buyers use it as leverage to lower their offer.',
      icon: '📉'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Seller Onboarding',
      description: 'Send your seller a branded invite. They document their business in a guided workflow — digital assets, contracts, subscriptions, physical assets, key relationships.',
      visual: 'onboard'
    },
    {
      step: '02',
      title: 'Readiness Dashboard',
      description: 'Track documentation progress across all your listings. See which sellers are deal-ready and which need follow-up — at a glance.',
      visual: 'dashboard'
    },
    {
      step: '03',
      title: 'Due Diligence Package',
      description: 'Generate professional, white-labeled reports for buyers. Everything organized the way buyers expect to see it.',
      visual: 'export'
    },
    {
      step: '04',
      title: 'Clean Transfer',
      description: 'When the deal closes, assets transfer smoothly. No scrambling, no surprises, no post-close chaos.',
      visual: 'transfer'
    }
  ];

  const features = [
    {
      title: 'White-Label Reports',
      description: 'Export branded due diligence packages with your logo and contact info.',
      icon: '📄'
    },
    {
      title: 'Multi-Listing Dashboard',
      description: 'Track readiness across all your active listings in one view.',
      icon: '📊'
    },
    {
      title: 'Seller Invitations',
      description: 'Send branded invites that guide sellers through documentation.',
      icon: '✉️'
    },
    {
      title: 'Expiration Alerts',
      description: 'Get notified before domains, contracts, or subscriptions lapse mid-deal.',
      icon: '🔔'
    },
    {
      title: 'Secure Credential Handoff',
      description: 'Transfer access credentials without exposing them in emails or spreadsheets.',
      icon: '🔐'
    },
    {
      title: 'Priority Support',
      description: 'Direct line to our team when deals are on the line.',
      icon: '💬'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">
            Business Vault
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Pricing
            </Link>
            <Link href="/#assessment" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Assessment
            </Link>
            <span className="text-amber-500 font-medium border-b-2 border-amber-500 pb-1">
              For Brokers
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Log In
            </Link>
            <Link
              href="#contact"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
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
            <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Features
            </Link>
            <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Pricing
            </Link>
            <Link href="/#assessment" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
              Assessment
            </Link>
            <span className="block text-amber-500 font-medium py-2">
              For Brokers
            </span>
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-zinc-400 hover:text-zinc-100 transition-colors py-2">
                Log In
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-amber-500 text-sm font-medium">For Business Brokers & M&A Advisors</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6">
              Stop losing deals to{' '}
              <span className="text-amber-500">documentation chaos.</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Business Vault gives your sellers a system to document what buyers need — before diligence starts. Faster closes. Fewer surprises. Better outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Request Broker Access →
              </Link>
              <Link
                href="#how-it-works"
                className="border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero Visual - Multi-Listing Dashboard Preview */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
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
                  <span className="text-zinc-500 text-xs">businessvault.io/broker/dashboard</span>
                </div>
                <div className="w-16"></div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Your Listings</h3>
                    <p className="text-zinc-500 text-sm">Acme Business Brokers — 12 Active Listings</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-zinc-400">8 Deal-Ready</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-zinc-400">3 In Progress</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-zinc-400">1 At Risk</span>
                    </div>
                  </div>
                </div>

                {/* Listings Table */}
                <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-800/50 border-b border-zinc-700/50 text-xs text-zinc-500 uppercase tracking-wide">
                    <div className="col-span-4 sm:col-span-3">Business</div>
                    <div className="col-span-3 sm:col-span-2 hidden sm:block">Asking</div>
                    <div className="col-span-4 sm:col-span-4">Readiness</div>
                    <div className="col-span-4 sm:col-span-3 text-right">Status</div>
                  </div>
                  
                  {/* Table Rows */}
                  {[
                    { name: 'Coastal HVAC Services', asking: '$1.2M', readiness: 94, status: 'Deal-Ready', statusColor: 'emerald' },
                    { name: 'Metro Print & Copy', asking: '$450K', readiness: 87, status: 'Deal-Ready', statusColor: 'emerald' },
                    { name: 'Summit Landscaping', asking: '$680K', readiness: 62, status: 'In Progress', statusColor: 'amber' },
                    { name: 'Brightside Daycare', asking: '$890K', readiness: 23, status: 'At Risk', statusColor: 'red' },
                  ].map((listing, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-700/30 hover:bg-zinc-800/30 transition-colors items-center">
                      <div className="col-span-4 sm:col-span-3">
                        <div className="font-medium text-zinc-100 text-sm truncate">{listing.name}</div>
                      </div>
                      <div className="col-span-3 sm:col-span-2 hidden sm:block text-zinc-400 text-sm">{listing.asking}</div>
                      <div className="col-span-4 sm:col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                listing.statusColor === 'emerald' ? 'bg-emerald-500' :
                                listing.statusColor === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${listing.readiness}%` }}
                            ></div>
                          </div>
                          <span className="text-zinc-400 text-xs w-8">{listing.readiness}%</span>
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-3 text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          listing.statusColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                          listing.statusColor === 'amber' ? 'bg-amber-500/20 text-amber-400' : 
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <span>+</span> Invite Seller
                  </button>
                  <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <span>📄</span> Export Reports
                  </button>
                  <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <span>⚙️</span> Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            You've seen it happen.{' '}
            <span className="text-red-500">Every broker has.</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            Documentation problems don't just slow deals down — they kill them.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-red-500/30 transition-colors group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{point.icon}</div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{point.title}</h3>
                <p className="text-zinc-400 text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            How Business Vault works{' '}
            <span className="text-amber-500">for brokers</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            A simple workflow that makes documentation a standard part of your listing process.
          </p>

          <div className="space-y-8 sm:space-y-12">
            {workflowSteps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}>
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="text-amber-500 text-sm font-bold bg-amber-500/10 px-3 py-1 rounded-full">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-zinc-100">{step.title}</h3>
                  <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full max-w-lg">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                    {step.visual === 'onboard' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">✉️</div>
                          <div>
                            <div className="text-sm font-medium text-zinc-100">Seller Invitation</div>
                            <div className="text-xs text-zinc-500">Sent 2 hours ago</div>
                          </div>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                          <div className="text-sm text-zinc-300 mb-2">To: owner@coastalhvac.com</div>
                          <div className="text-sm text-zinc-400">
                            "You've been invited to document your business assets for sale preparation. Click below to get started..."
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium">
                            Start Documentation →
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {step.visual === 'dashboard' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-zinc-400">Listing Readiness</span>
                          <span className="text-xs text-zinc-500">Updated live</span>
                        </div>
                        {[
                          { name: 'Coastal HVAC', progress: 94, color: 'emerald' },
                          { name: 'Metro Print', progress: 67, color: 'amber' },
                          { name: 'Summit Land.', progress: 34, color: 'red' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-zinc-400 w-24 truncate">{item.name}</span>
                            <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full bg-${item.color}-500`}
                                style={{ width: `${item.progress}%`, backgroundColor: item.color === 'emerald' ? '#10b981' : item.color === 'amber' ? '#f59e0b' : '#ef4444' }}
                              ></div>
                            </div>
                            <span className="text-xs text-zinc-400 w-8">{item.progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {step.visual === 'export' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 text-zinc-900">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-bold text-amber-600">ACME BUSINESS BROKERS</div>
                            <div className="text-xs text-zinc-500">Confidential</div>
                          </div>
                          <div className="text-sm font-bold mb-1">Due Diligence Package</div>
                          <div className="text-xs text-zinc-600 mb-3">Coastal HVAC Services</div>
                          <div className="space-y-1 text-xs text-zinc-500">
                            <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Digital Assets (12)</div>
                            <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Contracts (8)</div>
                            <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Physical Assets (34)</div>
                            <div className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Key Relationships (6)</div>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>📄</span> Download PDF
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {step.visual === 'transfer' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">CS</div>
                            <span className="text-sm text-zinc-300">Seller</span>
                          </div>
                          <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-amber-500 to-emerald-500 rounded relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-2">
                              <span className="text-emerald-500">→</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-300">Buyer</span>
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">NB</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2 text-center">
                            <span className="text-emerald-400">✓</span> Domains Transferred
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2 text-center">
                            <span className="text-emerald-400">✓</span> Contracts Assigned
                          </div>
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2 text-center">
                            <span className="text-emerald-400">✓</span> Credentials Shared
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 text-center">
                            <span className="text-amber-400">⏳</span> Final Review
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Built for how brokers{' '}
            <span className="text-amber-500">actually work</span>
          </h2>
          <p className="text-zinc-400 text-center mb-12 sm:mb-16 text-base sm:text-lg max-w-2xl mx-auto">
            Every feature designed to make your deals close faster and cleaner.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/30 transition-colors group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-zinc-100">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-amber-500 text-sm font-medium">Early Access Program</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              We're working with a small group of brokers to get this right.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
              Business Vault was built from real conversations with business owners, brokers, and M&A advisors. We're refining the broker workflow with early partners before wider release.
            </p>
            <p className="text-zinc-500 text-sm">
              Interested in shaping the product? <Link href="#contact" className="text-amber-500 hover:text-amber-400">Join the early access program →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Broker Program Pricing
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Volume pricing for brokerages. Pay per active listing, not per seat.
          </p>

          <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-amber-500 text-sm font-semibold mb-2">BROKER PROGRAM</div>
                <div className="text-3xl sm:text-4xl font-bold mb-2">$29<span className="text-lg text-zinc-400">/listing/month</span></div>
                <p className="text-zinc-400 text-sm">Minimum 5 listings. Volume discounts available.</p>
              </div>
              <div className="text-left">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-500">✓</span> Unlimited assets per listing
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-500">✓</span> White-label reports
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-500">✓</span> Multi-listing dashboard
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-500">✓</span> Priority support
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-500">✓</span> Secure credential transfer
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-zinc-500 text-sm">
            Custom enterprise pricing available for 50+ listings.{' '}
            <Link href="#contact" className="text-amber-500 hover:text-amber-400">Contact us</Link>
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Get started with{' '}
            <span className="text-amber-500">the Broker Program</span>
          </h2>
          <p className="text-zinc-400 text-center mb-8 text-base sm:text-lg">
            Tell us about your brokerage and we'll set you up with a demo.
          </p>

          {formSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Request Received</h3>
              <p className="text-zinc-400">
                Thanks for your interest! We'll be in touch within 1 business day to schedule your demo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="john@brokerage.com"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Brokerage Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="Acme Business Brokers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Active Listings</label>
                  <select
                    required
                    value={formData.listings}
                    onChange={(e) => setFormData({ ...formData, listings: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="1-10">1-10 listings</option>
                    <option value="11-25">11-25 listings</option>
                    <option value="26-50">26-50 listings</option>
                    <option value="50+">50+ listings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Anything else we should know?</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your biggest documentation challenges..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Request Broker Access →
              </button>
              
              <p className="text-center text-zinc-500 text-sm">
                We'll respond within 1 business day.
              </p>
            </form>
          )}
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
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              For Business Owners
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
