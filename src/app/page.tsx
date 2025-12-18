'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false])
  const [isAnnual, setIsAnnual] = useState(false)
  const [showHint, setShowHint] = useState(true)

  const score = checkedItems.filter(Boolean).length

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems]
    newChecked[index] = !newChecked[index]
    setCheckedItems(newChecked)
    setShowHint(false)
  }

  const getStatus = () => {
    if (score >= 4) return { light: 'green', label: 'Well Prepared', labelClass: 'text-[#22c55e]', message: 'Impressive. Business Vault helps you maintain this and catch what you might miss.' }
    if (score >= 2) return { light: 'yellow', label: 'Getting There', labelClass: 'text-[#f59e0b]', message: 'You have some coverage, but gaps remain. Business Vault fills them.' }
    return { light: 'red', label: 'At Risk', labelClass: 'text-[#ef4444]', message: 'Your business infrastructure is vulnerable. One unexpected event could leave you scrambling.' }
  }

  const status = getStatus()

  const assessmentItems = [
    { icon: '🌐', title: 'Domain Ownership', desc: 'I know where my domain(s) are registered and have the credentials to access them.' },
    { icon: '🖥️', title: 'Hosting & Website Access', desc: 'I know where my website is hosted and can access it as well as the back-end of my website.' },
    { icon: '💳', title: 'Critical Software', desc: 'I know which tools (accounting, inventory, shipping, payment processing) my business depends on and have easy access to them.' },
    { icon: '📱', title: 'Social Media Control', desc: 'I have administrative level access to all of my social media accounts and can access them easily.' },
    { icon: '🔑', title: 'Business Continuity', desc: 'If my key employee quit tomorrow, I can immediately access everything I need to run my business.' },
  ]

  const scenarios = [
    { img: '/website.jpg', title: 'Your website vanishes.', desc: "The domain expired. The renewal went to an email you don't control. Now someone else owns it — and wants $10,000 to sell it back." },
    { img: '/vendor.jpg', title: 'Your vendor ghosted.', desc: "The freelancer who built your site is gone. You don't know where anything is registered, what the logins are, or how to make changes." },
    { img: '/employee.jpg', title: 'An employee walked out.', desc: "Your Instagram, Google Business, and email admin credentials went with them. You're locked out of your own business." },
    { img: '/selling.jpg', title: "You're selling — unprepared.", desc: "Due diligence starts. The buyer wants a list of digital assets. You can't prove what they're buying — and the deal stalls." },
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        :root {
          --bg-primary: #0a0a0a;
          --bg-elevated: #0f0f0f;
          --bg-card: #151515;
          --text-primary: #ffffff;
          --text-secondary: #a8a8a8;
          --text-muted: #606060;
          --accent: #f59e0b;
          --accent-hover: #fbbf24;
          --accent-glow: rgba(245, 158, 11, 0.12);
          --accent-soft: rgba(245, 158, 11, 0.06);
          --border: #1f1f1f;
          --border-hover: #2a2a2a;
          --success: #22c55e;
          --success-soft: rgba(34, 197, 94, 0.12);
          --warning: #f59e0b;
          --warning-soft: rgba(245, 158, 11, 0.12);
          --danger: #ef4444;
          --danger-soft: rgba(239, 68, 68, 0.12);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; -webkit-font-smoothing: antialiased; }
        .font-serif { font-family: 'Instrument Serif', Georgia, serif; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce-hint { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
      `}</style>

      <div className="min-h-screen">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 bg-[rgba(10,10,10,0.9)] backdrop-blur-xl border-b border-[#1f1f1f]">
          <div className="max-w-[1200px] mx-auto flex justify-between items-center">
            <Link href="/" className="font-serif text-2xl text-white no-underline">Business Vault</Link>
            <div className="flex gap-10 items-center">
              <a href="#features" className="text-[#a8a8a8] no-underline text-sm font-medium hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-[#a8a8a8] no-underline text-sm font-medium hover:text-white transition-colors">Pricing</a>
              <a href="#assessment" className="text-[#a8a8a8] no-underline text-sm font-medium hover:text-white transition-colors">Assessment</a>
              <Link href="/login" className="text-[#a8a8a8] no-underline text-sm font-medium hover:text-white transition-colors">Log In</Link>
              <Link href="/signup" className="bg-[#f59e0b] text-[#0a0a0a] px-5 py-2.5 rounded-md font-semibold text-sm no-underline">Build Your Vault</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex items-center pt-32 pb-20 px-8 relative">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-[radial-gradient(ellipse_at_80%_20%,rgba(245,158,11,0.06)_0%,transparent_55%)] pointer-events-none" />
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-16 items-center w-full">
            <div className="relative z-10">
              <h1 className="font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] font-normal leading-[1.1] mb-5">
                Your Business Assets. One System. <em className="text-[#f59e0b] italic">Zero Surprises.</em>
              </h1>
              <p className="text-lg text-[#a8a8a8] leading-relaxed mb-10 max-w-[500px]">
                Track and manage physical assets, digital tools, contracts, insurance policies, and renewals in one secure business vault.
              </p>
              <div className="flex gap-4 flex-wrap mb-10">
                <Link href="/signup" className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-8 py-4 rounded-lg font-semibold text-base no-underline transition-all hover:bg-[#fbbf24] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_rgba(245,158,11,0.35)]">
                  Build Your Vault →
                </Link>
                <a href="#assessment" className="inline-flex items-center gap-2 bg-transparent text-white px-8 py-4 rounded-lg font-medium text-base no-underline border border-[#2a2a2a] transition-all hover:bg-[#151515] hover:border-[#606060]">
                  Take the Assessment
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex">
                  {['JM', 'KL', 'AR', '+'].map((initials, i) => (
                    <div key={i} className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] border-2 border-[#0a0a0a] -mr-2.5 flex items-center justify-center text-[0.7rem] font-semibold text-[#0a0a0a]">
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-[#a8a8a8]">Join business owners taking control</span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-[#151515] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_80px_-20px_rgba(245,158,11,0.12)]">
              <div className="flex items-center gap-1.5 px-5 py-3.5 bg-[#0f0f0f] border-b border-[#1f1f1f]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold">Your Business Vault</span>
                  <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-[#22c55e] bg-[rgba(34,197,94,0.12)] px-3 py-1.5 rounded-full uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full" />
                    All Documented
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🌐', label: 'Domains', tag: '2 Expiring', tagClass: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b]', value: '12', valueClass: 'text-[#f59e0b]' },
                    { icon: '📄', label: 'Contracts', tag: 'Current', tagClass: 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]', value: '8', valueClass: '' },
                    { icon: '💳', label: 'Monthly Spend', tag: '', tagClass: '', value: '$2,847', valueClass: '' },
                    { icon: '🏢', label: 'Physical Assets', tag: '', tagClass: '', value: '34', valueClass: '' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4">
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-[#606060]">{stat.label}</span>
                        {stat.tag && <span className={`text-[0.65rem] px-1.5 py-0.5 rounded font-semibold ${stat.tagClass}`}>{stat.tag}</span>}
                      </div>
                      <div className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.2)] rounded-xl p-3.5 flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <div className="text-[0.7rem] font-semibold text-[#f59e0b] uppercase tracking-wide mb-0.5">Renewal Alert</div>
                    <div className="text-sm text-[#a8a8a8]"><strong className="text-white">acme-corp.com</strong> expires in 7 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Section */}
        <section id="assessment" className="py-24 px-8 bg-[#0a0a0a]">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-[1fr_360px] gap-16 items-start">
              <div>
                <div className="mb-8">
                  <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] mb-3">How Secure Is Your Business Infrastructure?</h2>
                  <p className="text-[#a8a8a8] text-lg">Click each item you already have documented, current, and easy to access.</p>
                </div>
                <div className="flex flex-col gap-3 relative">
                  {showHint && (
                    <div className="absolute -left-[70px] top-5 text-sm text-[#f59e0b] font-semibold animate-[bounce-hint_1s_ease-in-out_infinite] whitespace-nowrap">
                      Click →
                    </div>
                  )}
                  {assessmentItems.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => toggleCheck(index)}
                      className={`bg-[#151515] border rounded-xl p-5 flex items-start gap-4 cursor-pointer transition-all select-none ${
                        checkedItems[index]
                          ? 'border-[#22c55e] bg-[rgba(34,197,94,0.12)]'
                          : index === 0
                          ? 'border-[#f59e0b] shadow-[0_0_20px_-5px_rgba(245,158,11,0.12)]'
                          : 'border-[#1f1f1f] hover:border-[#2a2a2a]'
                      }`}
                    >
                      <div className={`w-[22px] h-[22px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                        checkedItems[index]
                          ? 'bg-[#22c55e] border-[#22c55e]'
                          : index === 0
                          ? 'border-[#f59e0b]'
                          : 'border-[#2a2a2a]'
                      }`}>
                        {checkedItems[index] && <span className="text-white text-[0.7rem] font-bold">✓</span>}
                      </div>
                      <div>
                        <h4 className="text-[1.05rem] font-semibold mb-1">{item.icon} {item.title}</h4>
                        <p className="text-[0.95rem] text-[#a8a8a8] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Light */}
              <div className="bg-[#151515] border border-[#1f1f1f] rounded-2xl p-8 text-center sticky top-[100px]">
                <div className="w-[90px] bg-[#111] rounded-[50px] p-3.5 mx-auto mb-6 flex flex-col gap-2.5 border-[3px] border-[#222]">
                  <div className={`w-[52px] h-[52px] rounded-full mx-auto transition-all ${status.light === 'red' ? 'bg-[#ef4444] shadow-[0_0_25px_#ef4444,0_0_50px_rgba(239,68,68,0.25)]' : 'bg-[#2d1111]'}`} />
                  <div className={`w-[52px] h-[52px] rounded-full mx-auto transition-all ${status.light === 'yellow' ? 'bg-[#f59e0b] shadow-[0_0_25px_#f59e0b,0_0_50px_rgba(245,158,11,0.25)]' : 'bg-[#2d2511]'}`} />
                  <div className={`w-[52px] h-[52px] rounded-full mx-auto transition-all ${status.light === 'green' ? 'bg-[#22c55e] shadow-[0_0_25px_#22c55e,0_0_50px_rgba(34,197,94,0.25)]' : 'bg-[#112d14]'}`} />
                </div>
                <div className="text-4xl font-bold mb-1">{score} of 5</div>
                <div className={`text-base font-semibold mb-2 ${status.labelClass}`}>{status.label}</div>
                <p className="text-sm text-[#606060] mb-6 leading-relaxed">{status.message}</p>
                <Link href="/signup" className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-8 py-4 rounded-lg font-semibold text-base no-underline transition-all hover:bg-[#fbbf24]">
                  Build Your Vault
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios Section */}
        <section className="py-24 px-8 bg-[#0f0f0f]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] mb-2">Then One Day, It Happens.</h2>
              <p className="text-[#a8a8a8] text-lg">You don&apos;t think about your infrastructure — <em className="text-[#f59e0b] italic">until it disappears.</em></p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {scenarios.map((scenario, i) => (
                <div key={i} className="bg-[#151515] border border-[#1f1f1f] rounded-2xl overflow-hidden transition-all hover:border-[#2a2a2a] hover:-translate-y-1">
                  <img src={scenario.img} alt={scenario.title} className="w-full h-[180px] object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-sm text-[#a8a8a8] leading-relaxed">{scenario.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="py-24 px-8 bg-[#0a0a0a]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-[clamp(2rem,3.5vw,2.75rem)] mb-4">Track Every Asset That Matters</h2>
              <p className="text-[#a8a8a8] text-lg max-w-[650px] mx-auto">A secure command center for everything your business owns, uses, and depends on — in one place.</p>
            </div>

            {/* Transformation */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-stretch mb-16">
              <div className="bg-[#151515] border border-[rgba(239,68,68,0.3)] rounded-2xl p-8">
                <div className="text-xs font-bold uppercase tracking-widest text-[#ef4444] mb-6 pb-4 border-b border-[#1f1f1f]">Without Business Vault</div>
                <div className="flex flex-col gap-4">
                  {[
                    'Disorganized spreadsheets, email threads, sticky notes and misplaced documentation',
                    'Scrambling (panic) when someone leaves',
                    'Risking your business continuity'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-[0.95rem] text-[#a8a8a8] leading-relaxed">
                      <span className="text-[#ef4444] text-lg font-semibold leading-relaxed">×</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center text-4xl text-[#f59e0b] font-light">→</div>

              <div className="bg-[#151515] border border-[rgba(34,197,94,0.3)] rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(34,197,94,0.15)]">
                <div className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-6 pb-4 border-b border-[#1f1f1f]">With Business Vault</div>
                <div className="flex flex-col gap-4">
                  {[
                    'A complete accounting of the critical infrastructure that runs your business',
                    'Export-ready reports for sales, audits, transitions, or emergencies',
                    "Control in your hands, not someone else's"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-[0.95rem] text-[#a8a8a8] leading-relaxed">
                      <span className="text-[#22c55e] text-sm font-bold leading-relaxed">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Categories */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { title: 'Physical Assets', items: ['Vehicles', 'Equipment', 'Property', 'Serial numbers', 'Warranties'] },
                { title: 'Digital Assets', items: ['Domains', 'Websites', 'SaaS tools', 'Logins', 'Social media'] },
                { title: 'Business & Financial', items: ['Insurance policies', 'Contracts', 'Renewal dates', 'Vendors', 'Key contacts'] },
              ].map((category, i) => (
                <div key={i} className="bg-[#151515] border border-[#1f1f1f] rounded-2xl p-8 transition-all hover:border-[#f59e0b]">
                  <h3 className="text-lg font-semibold mb-5 text-[#f59e0b]">{category.title}</h3>
                  <ul className="flex flex-col gap-2.5">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-[0.95rem] text-[#a8a8a8]">
                        <span className="text-[#22c55e] font-bold text-sm">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-8 bg-[#0f0f0f]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] mb-2">Simple Pricing. Start Free.</h2>
              <p className="text-[#a8a8a8] text-lg">Document your first 5 assets at no cost. Upgrade when you&apos;re ready.</p>
            </div>

            <div className="flex justify-center gap-1.5 mb-10 bg-[#151515] p-1 rounded-xl w-fit mx-auto">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${!isAnnual ? 'bg-[#f59e0b] text-[#0a0a0a]' : 'text-[#a8a8a8]'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${isAnnual ? 'bg-[#f59e0b] text-[#0a0a0a]' : 'text-[#a8a8a8]'}`}
              >
                Annual (Save 20%)
              </button>
            </div>

            <div className="grid grid-cols-4 gap-5">
              {[
                { tier: 'Getting Started', name: 'Starter', price: 'Free', period: '', features: ['Up to 5 assets total', 'All 5 asset categories', 'Basic PDF export', 'Dashboard overview'], cta: 'Build Your Vault', primary: true },
                { tier: 'Solo & Freelance', name: 'Solopreneur', price: isAnnual ? '$7' : '$9', period: '/month', features: ['Up to 50 assets', 'Expiration alerts', 'Unlimited PDF exports', 'Email support'], cta: 'Upgrade', primary: false },
                { tier: 'Teams of 1–10', name: 'Small Business', price: isAnnual ? '$15' : '$19', period: '/month', features: ['Up to 200 assets', '3 team members', 'Advanced reporting', { text: 'Asset transfer (Coming Soon)', coming: true }], cta: 'Upgrade', primary: true, featured: true },
                { tier: 'Scaling Teams', name: 'Growing Business', price: isAnnual ? '$31' : '$39', period: '/month', features: ['Unlimited assets', '10 team members', 'White-label exports', 'Priority support'], cta: 'Upgrade', primary: false },
              ].map((plan, i) => (
                <div key={i} className={`bg-[#151515] border rounded-2xl p-7 relative transition-all hover:-translate-y-1 ${plan.featured ? 'border-[#f59e0b] shadow-[0_0_50px_-15px_rgba(245,158,11,0.12)]' : 'border-[#1f1f1f]'}`}>
                  {plan.featured && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-[#0a0a0a] px-3.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}
                  <div className="text-[0.7rem] text-[#606060] uppercase tracking-wide mb-1">{plan.tier}</div>
                  <div className="text-lg font-semibold mb-4">{plan.name}</div>
                  <div className="flex items-baseline gap-0.5 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-[#606060] text-sm">{plan.period}</span>
                  </div>
                  <ul className="mb-6">
                    {plan.features.map((feature, j) => {
                      const isObject = typeof feature === 'object'
                      return (
                        <li key={j} className={`flex items-start gap-2.5 py-2 border-b border-[#1f1f1f] last:border-0 text-sm ${isObject && feature.coming ? 'text-[#606060]' : 'text-[#a8a8a8]'}`}>
                          <span className={`flex-shrink-0 text-xs font-semibold ${isObject && feature.coming ? 'text-[#606060]' : 'text-[#22c55e]'}`}>
                            {isObject && feature.coming ? '◦' : '✓'}
                          </span>
                          {isObject ? feature.text : feature}
                        </li>
                      )
                    })}
                  </ul>
                  <Link
                    href="/signup"
                    className={`w-full text-center py-3 rounded-lg font-semibold text-sm no-underline transition-all block ${
                      plan.primary
                        ? 'bg-[#f59e0b] text-[#0a0a0a] hover:bg-[#fbbf24]'
                        : 'bg-[#0a0a0a] text-white border border-[#1f1f1f]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-center mt-8 text-sm text-[#606060]">
              Need a custom solution for your agency or enterprise?{' '}
              <a href="mailto:partners@businessvault.com" className="text-[#f59e0b] no-underline">Let&apos;s talk</a>
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 px-8 bg-[#0a0a0a] text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.06)_0%,transparent_65%)] pointer-events-none" />
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-normal mb-4 relative z-10">
            Know what you have. <em className="text-[#f59e0b] italic">Access it when it matters.</em>
          </h2>
          <p className="text-[#a8a8a8] text-lg mb-8 relative z-10">Don&apos;t wait for a crisis. Start documenting your business infrastructure today.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a0a0a] px-10 py-4 rounded-lg font-semibold text-lg no-underline transition-all hover:bg-[#fbbf24] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_rgba(245,158,11,0.35)] relative z-10">
            Build Your Vault →
          </Link>
          <p className="mt-4 text-sm text-[#606060] relative z-10">Free for up to 5 assets. No credit card required.</p>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 border-t border-[#1f1f1f] text-center text-[#606060] text-xs bg-[#0a0a0a]">
          <p>© 2025 Business Vault. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
