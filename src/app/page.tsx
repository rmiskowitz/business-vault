'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

function AnimatedStat({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [end])
  
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600">
        {count}{suffix}
      </div>
      <div className="text-gray-600 mt-1">{label}</div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Business Vault</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Under every business is a layer of digital infrastructure.
          </h1>
          <p className="mt-4 text-2xl text-gray-600">
            Domains. Hosting. Logins. Contracts.
          </p>
          <p className="mt-2 text-2xl text-blue-600 font-semibold">
            Can you access them quickly and easily?
          </p>
          
          <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">
            As your business grows, so does your digital footprint. Employee emails tied to critical accounts. 
            Domains registered years ago. Hosting credentials scattered across sticky notes and shared drives. 
            Business Vault brings it all together.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">
              Start Protecting Your Business
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <AnimatedStat end={67} label="of businesses lack documented access" suffix="%" />
          <AnimatedStat end={23} label="average accounts per small business" suffix="+" />
          <AnimatedStat end={4} label="hours saved monthly with proper documentation" suffix="+" />
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            One Place for Everything That Keeps Your Business Running
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏢', title: 'Physical Assets', desc: 'Equipment, vehicles, and property documentation' },
              { icon: '🌐', title: 'Digital Infrastructure', desc: 'Domains, hosting, and credential locations' },
              { icon: '📄', title: 'Contracts', desc: 'Agreements, renewals, and key terms' },
              { icon: '💳', title: 'Subscriptions', desc: 'SaaS tools and recurring services' },
              { icon: '👥', title: 'Key Contacts', desc: 'Vendors, partners, and critical relationships' },
              { icon: '📊', title: 'Export Reports', desc: 'Generate comprehensive PDF documentation' },
            ].map((feature, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Business Infrastructure?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join businesses that have taken control of their digital assets. 
            Start documenting today.
          </p>
          <Link href="/signup" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-gray-900">Business Vault</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Business Vault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
