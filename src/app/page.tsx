'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

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

  const storyCards = [
    {
      image: '/selling.jpg',
      title: 'Your deal stalls in diligence',
      description: 'The buyer asks for contracts, asset lists, logins, and proof of ownership. Everything lives in emails, old folders, or your head. Momentum slows. Confidence drops. The deal gets renegotiated — or dies.',
    },
    {
      image: '/employee.jpg',
      title: 'Knowledge walks out the door',
      description: 'Critical systems, subscriptions, and vendor relationships were never documented. The business keeps running — but no one knows how. Buyers notice immediately.',
    },
    {
      image: '/vendor.jpg',
      title: 'No contract. No leverage.',
      description: 'A vendor dispute surfaces during diligence. You can\'t find the agreement. The buyer flags risk. Your valuation takes a hit.',
    },
    {
      image: '/website.jpg',
      title: 'You don\'t control what you think you own',
      description: 'Domains, hosting, email, payment systems, and SaaS accounts aren\'t clearly owned or transferable. Buyers see operational risk instead of opportunity.',
    },
  ];

  const featureCategories = [
    {
      title: 'Digital Assets & Access',
      items: ['Domains', 'Hosting', 'Email', 'Payment processors', 'Social accounts', 'Admin credentials'],
    },
    {
      title: 'Contracts & Obligations',
      items: ['Vendor agreements', 'Leases', 'Insurance policies', 'Warranties'],
    },
    {
      title: 'Subscriptions & Recurring Spend',
      items: ['SaaS tools', 'Services', 'Renewals', 'Monthly commitments'],
    },
    {
      title: 'Physical Assets',
      items: ['Equipment', 'Vehicles', 'Inventory', 'Serial numbers', 'Purchase records'],
    },
    {
      title: 'Key Relationships',
      items: ['Vendors', 'Advisors', 'Partners', 'Operational contacts'],
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
      cta: 'Upgrade',
      href: '/signup',
      highlighted: false,
    },
    {
      label: 'Teams of 1–10',
      name: 'Seller + Team',
      price: billingCycle === 'monthly' ? '$19' : '$15',
      period: '/month',
      features: ['Up to 200 assets', '3 team members', 'Advanced reporting', 'Asset transfer (Coming Soon)'],
      cta: 'Upgrade',
      href: '/signup',
      highlighted: true,
    },
    {
      label: 'Scaling Teams',
      name: 'Broker Ready',
      price: billingCycle === 'monthly' ? '$39' : '$31',
      period: '/month',
      features: ['Unlimited assets', '10 team members', 'White-label exports', 'Priority support'],
      cta: 'Upgrade',
      href: '/signup',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500">
            Business Vault
          </Link>
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
          <div className="flex items-center gap-4">
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Get your business deal-ready{' '}
              <span className="text-amber-500">before due diligence starts.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
              Business Vault organizes the assets buyers ask for — digital access, contracts, subscriptions, physical assets, and key relationships — so your sale doesn't stall, drag, or fall apart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Create Your Deal-Ready Vault →
              </Link>
              <Link
                href="/brokers"
                className="border border-amber-500 text-amber-500 hover:bg-amber-500/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                For Brokers →
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-zinc-500 text-sm">Your Business Vault — All Documented</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-zinc-400 text-sm">Domains</div>
                <div className="text-2xl font-bold text-zinc-100">12</div>
                <div className="text-amber-500 text-xs mt-1">2 Expiring</div>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-zinc-400 text-sm">Contracts</div>
                <div className="text-2xl font-bold text-zinc-100">8</div>
                <div className="text-emerald-500 text-xs mt-1">Current</div>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">💳</div>
                <div className="text-zinc-400 text-sm">Monthly Spend</div>
                <div className="text-2xl font-bold text-zinc-100">$2,847</div>
                <div className="text-zinc-500 text-xs mt-1">Tracked</div>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🏢</div>
                <div className="text-zinc-400 text-sm">Physical Assets</div>
                <div className="text-2xl font-bold text-zinc-100">34</div>
                <div className="text-zinc-500 text-xs mt-1">Documented</div>
              </div>
            </div>
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
              <span className="text-amber-500">⚠️</span>
              <span className="text-amber-500 text-sm">
                <strong>Renewal Alert:</strong> acme-corp.com expires in 7 days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section id="assessment" className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How deal-ready is your business today?
          </h2>
          <p className="text-zinc-400 text-center mb-12 text-lg">
            Most owners can't confidently answer yes to all five.
          </p>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
            <p className="text-zinc-400 text-sm mb-6 text-center">
              Click each item you can confidently say yes to.
            </p>

            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => toggleCheck(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    checkedItems.has(index)
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        checkedItems.has(index)
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-zinc-600'
                      }`}
                    >
                      {checkedItems.has(index) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-semibold text-zinc-100">{item.title}</span>
                      </div>
                      <p className="text-zinc-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400">
                  {checkedItems.size} of 5
                </span>
                <span className={`font-bold text-lg ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                {getStatusMessage()}
              </p>
              <Link
                href="/signup"
                className="block w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-4 rounded-lg font-semibold text-center transition-colors"
              >
                Create Your Deal-Ready Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            When businesses aren't deal-ready,{' '}
            <span className="text-amber-500">value gets lost.</span>
          </h2>
          <p className="text-zinc-400 text-center mb-16 text-lg max-w-2xl mx-auto">
            You don't think about your documentation — until it costs you the deal.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {storyCards.map((card, index) => (
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
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-zinc-100">{card.title}</h3>
                  <p className="text-zinc-400">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What buyers ask for in due diligence
          </h2>
          <p className="text-zinc-400 text-center mb-16 text-lg max-w-2xl mx-auto">
            Business Vault organizes your business the way buyers and brokers expect to see it.
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featureCategories.map((category, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-amber-500/30 transition-colors"
              >
                <h3 className="font-bold text-amber-500 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-zinc-400 text-sm flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center mt-12 text-xl text-zinc-300 italic">
            Everything in one place. Clean. Transferable. Buyer-ready.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple Pricing. Start Free.
          </h2>
          <p className="text-zinc-400 text-center mb-8 text-lg">
            Document your first 5 assets at no cost. Upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-6 ${
                  tier.highlighted
                    ? 'bg-amber-500/10 border-amber-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-amber-500 text-sm font-semibold mb-2">Most Popular</div>
                )}
                <div className="text-zinc-400 text-sm mb-1">{tier.label}</div>
                <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-zinc-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
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
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
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

          <p className="text-center mt-8 text-zinc-400">
            Looking to standardize deal readiness across your listings?{' '}
            <Link href="/brokers" className="text-amber-500 hover:text-amber-400 font-semibold">
              Contact us about the Broker Program.
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Know what you have.{' '}
            <span className="text-amber-500">Access it when it matters.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Don't wait for due diligence to discover what's missing. Start documenting your business today.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Build Your Vault →
          </Link>
          <p className="text-zinc-500 text-sm mt-4">
            Free for up to 5 assets. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center text-zinc-500 text-sm">
          © 2025 Business Vault. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
