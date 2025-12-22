'use client';

import Link from 'next/link';

export default function BrokersPage() {
  const brokerBenefits = [
    'Faster time to market',
    'Fewer stalled or renegotiated deals',
    'Less chasing sellers for documentation',
    'Cleaner buyer handoffs',
    'Stronger reputation with buyers',
  ];

  const sellerBenefits = [
    'Confidence entering diligence',
    'Fewer fire drills',
    'Better leverage in negotiations',
    'Smoother transition',
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Seller completes their Deal-Ready Vault',
      description: 'Assets, contracts, subscriptions, access, and relationships documented in one place',
    },
    {
      step: '2',
      title: 'You review readiness before going to market',
      description: 'No surprises during diligence',
    },
    {
      step: '3',
      title: 'Buyers receive a clean, organized diligence view',
      description: 'Confidence stays high. Deals move faster.',
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
            <Link href="/#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Pricing
            </Link>
            <Link href="/#assessment" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Assessment
            </Link>
            <Link href="/brokers" className="text-amber-500 font-medium">
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            For Business Brokers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            A Deal-Ready Vault{' '}
            <span className="text-amber-500">for business brokers</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Standardize seller intake. Reduce deal friction. Close cleaner.
          </p>
          <Link
            href="mailto:partners@businessvault.com?subject=Broker Demo Request"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Book a Broker Demo
          </Link>
          <p className="text-zinc-500 text-sm mt-4">
            Built for boutique and independent brokers. No tech overhead.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The problem brokers face
          </h2>
          
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 md:p-12">
            <p className="text-2xl md:text-3xl font-bold text-center mb-6">
              Most deals don't fail because of price.
            </p>
            <p className="text-xl text-zinc-400 text-center mb-8">
              They fail because sellers aren't prepared for diligence.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
              {['Missing documents', 'Unclear ownership', 'Endless follow-ups', 'Lost momentum'].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-zinc-400">
                  <span className="text-red-500">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The solution
          </h2>
          <p className="text-xl md:text-2xl text-amber-500 font-semibold mb-4">
            Business Vault becomes your required Deal-Ready Vault before listing.
          </p>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Not another tool to sell. A standard your sellers must meet.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-amber-500 text-zinc-950 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-16 w-full h-0.5 bg-zinc-800">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-zinc-600 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Broker Benefits */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
              <h3 className="text-2xl font-bold mb-6 text-amber-500">Benefits for Brokers</h3>
              <ul className="space-y-4">
                {brokerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-emerald-500 text-lg">✓</span>
                    <span className="text-zinc-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Benefits */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
              <h3 className="text-2xl font-bold mb-6 text-amber-500">Benefits for Sellers</h3>
              <ul className="space-y-4">
                {sellerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-emerald-500 text-lg">✓</span>
                    <span className="text-zinc-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to standardize your intake process?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            See how Business Vault can reduce deal friction and help you close cleaner.
          </p>
          <Link
            href="mailto:partners@businessvault.com?subject=Broker Demo Request"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Book a Broker Demo
          </Link>
          <p className="text-zinc-500 text-sm mt-4">
            Built for boutique and independent brokers. No tech overhead.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-500 text-sm">
            © 2025 Business Vault. All rights reserved.
          </div>
          <Link href="/" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
            ← Back to main site
          </Link>
        </div>
      </footer>
    </div>
  );
}
