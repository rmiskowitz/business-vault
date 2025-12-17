'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [quizState, setQuizState] = useState([false, false, false, false, false])
  const [isAnnual, setIsAnnual] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlan, setModalPlan] = useState({ name: '', price: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    plan: 'Solopreneur',
    name: '',
    email: '',
    company: '',
    billing: 'monthly'
  })

  const score = quizState.filter(Boolean).length
  
  const getScoreStatus = () => {
    if (score <= 1) return { class: 'low', badge: 'at-risk', icon: '⚠️', text: 'At Risk', message: "Your business infrastructure is vulnerable. One unexpected event could leave you scrambling." }
    if (score <= 3) return { class: 'medium', badge: 'vulnerable', icon: '⚡', text: 'Vulnerable', message: "You've got gaps. Most business owners are here — but that doesn't make it safe." }
    return { class: 'high', badge: 'secure', icon: '✓', text: 'Secure', message: "Impressive. You're more prepared than most. Business Vault helps you stay that way." }
  }

  const status = getScoreStatus()

  const toggleQuizCard = (index: number) => {
    const newState = [...quizState]
    newState[index] = !newState[index]
    setQuizState(newState)
  }

  const openUpgradeModal = (planName: string, price: string) => {
    setModalPlan({ name: planName, price })
    setFormData(prev => ({ ...prev, plan: planName, billing: isAnnual ? 'annual' : 'monthly' }))
    setFormSubmitted(false)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('https://formspree.io/f/xeoyywya', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormSubmitted(true)
      }
    } catch (error) {
      setFormSubmitted(true) // Show success anyway for demo
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const quizQuestions = [
    { icon: '🌐', title: 'Domain Ownership', desc: 'I know exactly where every business domain is registered and have the login credentials.' },
    { icon: '🖥️', title: 'Website Hosting and Access', desc: 'I know where my website is hosted and have the credentials to access it.' },
    { icon: '💳', title: 'Software', desc: 'I know the critical software that runs my business and have the proper access to manage it.' },
    { icon: '📱', title: 'Social Media Control', desc: 'I know who has access to my social media and I have the proper admin access to secure it.' },
    { icon: '🔑', title: 'Business Continuity', desc: 'If my Office Manager quit tomorrow, I could access all the critical components of my business easily.' },
  ]

  const scenarios = [
    { img: '/scenario1-website-vanishes.svg', title: 'Your website vanishes.', desc: "The domain expired. The renewal notice went to an email you don't control. Now someone else owns it — and wants $10,000 to sell it back." },
    { img: '/scenario2-vendor-ghosted.svg', title: 'Your vendor ghosted.', desc: "The freelancer who built your site is gone. You don't know where your domain is registered, what the hosting login is, or how to make a single change." },
    { img: '/scenario3-employee-left.svg', title: 'An employee walked out.', desc: "Your Instagram login, Google Business Profile, and email admin credentials went with them. You're locked out of your own business." },
    { img: '/scenario4-selling-unprepared.svg', title: "You're selling — unprepared.", desc: "Due diligence starts. The buyer wants a list of digital assets. You realize you can't prove what they're buying — and the deal stalls." },
  ]

  const features = [
    { icon: '🌐', title: 'Digital Infrastructure', desc: 'Domains, hosting, email services, social media accounts — and where each credential is stored.' },
    { icon: '📄', title: 'Contracts & Agreements', desc: 'Leases, vendor agreements, insurance policies. Track terms, renewals, and key dates.' },
    { icon: '🏢', title: 'Physical Assets', desc: 'Equipment, vehicles, inventory. Serial numbers, warranties, and documentation.' },
    { icon: '💳', title: 'Subscriptions', desc: 'SaaS tools, memberships, recurring services. Know what you pay for and when it renews.' },
    { icon: '👥', title: 'Key Contacts', desc: 'Vendors, advisors, partners. The relationships that keep your business running.' },
    { icon: '📊', title: 'Export & Reports', desc: 'Generate PDF reports for insurance, due diligence, or business transitions.' },
  ]

  return (
    <>
      <style jsx global>{`
        :root {
          --black: #09090b;
          --white: #fafafa;
          --gray-100: #f4f4f5;
          --gray-200: #e4e4e7;
          --gray-400: #a1a1aa;
          --gray-500: #71717a;
          --gray-600: #52525b;
          --gray-700: #3f3f46;
          --gray-800: #27272a;
          --gray-900: #18181b;
          --amber: #f59e0b;
          --amber-dark: #d97706;
          --red: #ef4444;
          --green: #22c55e;
        }
        
        html { scroll-behavior: smooth; }
        
        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: var(--black);
          color: var(--white);
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <div className="min-h-screen bg-[#09090b] text-[#fafafa]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 px-6 lg:px-12 py-6 z-50 bg-gradient-to-b from-[#09090b]/90 to-transparent">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            <Link href="/" className="font-serif font-semibold text-2xl tracking-tight text-white">
              Business Vault
            </Link>
            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors">Pricing</a>
              <a href="#quiz" className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors">Assessment</a>
              <Link href="/login" className="text-[#a1a1aa] hover:text-white text-sm font-medium transition-colors">Log In</Link>
              <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-40 pb-24 px-6 lg:px-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[radial-gradient(ellipse_at_center_top,rgba(245,158,11,0.08)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative">
            <div className="animate-[fadeUp_1s_ease-out]">
              <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-[pulse_2s_infinite]" />
                Business Infrastructure
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-7">
                Your business runs on things you <em className="italic text-[#f59e0b]">can't find.</em>
              </h1>
              <p className="text-xl text-[#a1a1aa] leading-relaxed mb-10 max-w-xl">
                Domains. Hosting. Logins. Contracts. Scattered across inboxes, sticky notes, and former employees. Document everything in one place — before you need it desperately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all">
                  Start Free →
                </Link>
                <a href="#quiz" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold bg-transparent text-white border border-[#27272a] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all">
                  Take the Assessment
                </a>
              </div>
              <div className="flex items-center gap-4 text-[#71717a] text-sm">
                <div className="flex">
                  {['JM', 'KL', 'AR', '+'].map((initials, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-[#27272a] border-2 border-[#09090b] -ml-2 first:ml-0 flex items-center justify-center text-xs">
                      {initials}
                    </span>
                  ))}
                </div>
                <span>Join business owners who've taken control</span>
              </div>
            </div>

            {/* Dashboard Mock */}
            <div className="relative animate-[fadeUp_1s_ease-out_0.2s_both]">
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
                <div className="bg-[#27272a] px-5 py-3.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: '🌐', iconBg: 'rgba(59,130,246,0.15)', label: 'Domains', value: '12', badge: '2 Expiring', badgeType: 'warning' },
                      { icon: '📄', iconBg: 'rgba(34,197,94,0.15)', label: 'Contracts', value: '8', badge: 'Current', badgeType: 'success' },
                      { icon: '💳', iconBg: 'rgba(245,158,11,0.15)', label: 'Monthly Spend', value: '$2,847' },
                      { icon: '🏢', iconBg: 'rgba(168,85,247,0.15)', label: 'Physical Assets', value: '34' },
                    ].map((card, i) => (
                      <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 hover:border-[#3f3f46] hover:translate-y-[-2px] transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: card.iconBg }}>
                            {card.icon}
                          </div>
                          {card.badge && (
                            <span className={`text-[0.7rem] px-2 py-1 rounded-full font-semibold ${
                              card.badgeType === 'warning' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' : 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                            }`}>
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs text-[#a1a1aa] font-medium mb-1">{card.label}</h4>
                        <div className="text-3xl font-bold">{card.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Alert */}
              <div className="absolute -top-5 -right-8 bg-[#18181b] border border-[#ef4444] rounded-xl px-5 py-4 flex items-center gap-3 shadow-[0_20px_40px_rgba(239,68,68,0.2)] animate-[float_3s_ease-in-out_infinite] hidden lg:flex">
                <div className="w-9 h-9 bg-[rgba(239,68,68,0.15)] rounded-lg flex items-center justify-center text-[#ef4444]">
                  ⚠️
                </div>
                <div>
                  <h5 className="text-xs font-semibold">Domain Expiring</h5>
                  <p className="text-xs text-[#71717a]">acme-corp.com in 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section id="quiz" className="py-32 px-6 lg:px-12 bg-gradient-to-br from-[#0c0c10] via-[#141418] to-[#0c0c10] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(245,158,11,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(239,68,68,0.04)_0%,transparent_50%)] pointer-events-none" />
          
          <div className="max-w-[1300px] mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
                How secure is your business infrastructure?
              </h2>
              <p className="text-lg text-[#a1a1aa] mb-3">Most owners can't honestly check more than 2 of these.</p>
              <div className="inline-flex items-center gap-2 text-sm text-[#f59e0b] bg-[rgba(245,158,11,0.1)] px-4 py-2 rounded-full border border-[rgba(245,158,11,0.2)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                </svg>
                Click each item you can confidently say "yes" to
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center">
              {/* Quiz Questions */}
              <div className="flex flex-col gap-4">
                {quizQuestions.map((q, i) => (
                  <div
                    key={i}
                    onClick={() => toggleQuizCard(i)}
                    className={`bg-[rgba(24,24,27,0.8)] border rounded-2xl p-6 cursor-pointer transition-all flex items-center gap-5 ${
                      quizState[i] ? 'border-[#22c55e] bg-[rgba(34,197,94,0.05)]' : 'border-[#27272a] hover:border-[#3f3f46] hover:bg-[rgba(24,24,27,1)]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      quizState[i] ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#3f3f46]'
                    }`}>
                      {quizState[i] && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#27272a] flex items-center justify-center text-2xl flex-shrink-0 hidden sm:flex">
                      {q.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{q.title}</h4>
                      <p className="text-sm text-[#71717a] leading-relaxed">{q.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score Panel */}
              <div className="bg-gradient-to-br from-[rgba(24,24,27,0.9)] to-[rgba(9,9,11,0.95)] border border-[#27272a] rounded-3xl p-10 text-center max-w-[400px] mx-auto lg:mx-0">
                <div className="relative w-[200px] h-[200px] mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-[#27272a]" />
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(#ef4444 0deg, #f59e0b 120deg, #22c55e 240deg, #22c55e 360deg)',
                      mask: `conic-gradient(#000 0deg, #000 ${(score / 5) * 360}deg, transparent ${(score / 5) * 360}deg)`,
                      WebkitMask: `conic-gradient(#000 0deg, #000 ${(score / 5) * 360}deg, transparent ${(score / 5) * 360}deg)`,
                      transition: 'all 0.5s ease-out'
                    }}
                  />
                  <div className="absolute inset-5 bg-[#09090b] rounded-full flex flex-col items-center justify-center">
                    <div className={`font-serif text-6xl font-bold leading-none ${
                      status.class === 'low' ? 'text-[#ef4444]' : status.class === 'medium' ? 'text-[#f59e0b]' : 'text-[#22c55e]'
                    }`}>
                      {score}
                    </div>
                    <div className="text-sm text-[#71717a] uppercase tracking-widest mt-1">of 5</div>
                  </div>
                </div>

                <div className="mb-8">
                  <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm ${
                    status.badge === 'at-risk' ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.3)]' :
                    status.badge === 'vulnerable' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)]' :
                    'bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]'
                  }`}>
                    <span>{status.icon}</span>
                    <span>{status.text}</span>
                  </span>
                </div>

                <p className="text-[#a1a1aa] mb-8 min-h-[50px]">{status.message}</p>

                <Link href="/signup" className="w-full inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all">
                  Start Documenting — Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-32 px-6 lg:px-12 bg-[#09090b]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">Then one day, it happens.</h2>
              <p className="text-xl text-[#a1a1aa]">You don't think about your digital infrastructure — until it disappears.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {scenarios.map((s, i) => (
                <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#3f3f46] transition-all">
                  <div className="w-full h-[220px] overflow-hidden bg-[#09090b]">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-semibold mb-3">{s.title}</h3>
                    <p className="text-[#a1a1aa] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 lg:px-12 bg-[#18181b]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">One place for everything that runs your business.</h2>
              <p className="text-xl text-[#a1a1aa]">Document it now. Access it when it matters.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-2xl p-8 hover:border-[#3f3f46] hover:translate-y-[-4px] transition-all">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 bg-gradient-to-br from-[#27272a] to-[#18181b] border border-[#3f3f46]">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 lg:px-12 bg-[#09090b] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.05)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">Simple pricing. Start free.</h2>
              <p className="text-xl text-[#a1a1aa]">Document your first 5 assets at no cost. Upgrade when you're ready.</p>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-[#71717a]'}`}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`w-14 h-7 rounded-full relative transition-colors ${isAnnual ? 'bg-[#f59e0b]' : 'bg-[#27272a]'}`}
                >
                  <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : ''}`} />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-white' : 'text-[#71717a]'}`}>Annual</span>
                <span className="bg-[rgba(34,197,94,0.15)] text-[#22c55e] text-xs font-semibold px-3 py-1 rounded-full border border-[rgba(34,197,94,0.3)]">
                  Save 20%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {/* Free Tier */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 flex flex-col hover:border-[#3f3f46] hover:translate-y-[-4px] transition-all">
                <div className="pb-6 mb-6 border-b border-[#27272a]">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#71717a] mb-2">Starter</div>
                  <div className="font-serif text-2xl font-semibold mb-4">Getting Started</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold">Free</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3.5 mb-8">
                  {['Up to 5 assets total', 'All 5 asset categories', 'Basic PDF export', 'Dashboard overview'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#a1a1aa]">
                      <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-transparent text-white border border-[#27272a] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all">
                  Get Started
                </Link>
              </div>

              {/* Solopreneur */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 flex flex-col hover:border-[#3f3f46] hover:translate-y-[-4px] transition-all">
                <div className="pb-6 mb-6 border-b border-[#27272a]">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#71717a] mb-2">Solopreneur</div>
                  <div className="font-serif text-2xl font-semibold mb-4">Solo & Freelance</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-[#a1a1aa]">$</span>
                    <span className="font-serif text-5xl font-bold">{isAnnual ? '7' : '9'}</span>
                    <span className="text-sm text-[#71717a]">/month</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3.5 mb-8">
                  {['Up to 50 assets', 'Expiration alerts', 'Unlimited PDF exports', 'Email support'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#a1a1aa]">
                      <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openUpgradeModal('Solopreneur', isAnnual ? '$7/mo' : '$9/mo')} className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-transparent text-white border border-[#27272a] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all">
                  Upgrade
                </button>
              </div>

              {/* Small Business - Popular */}
              <div className="bg-gradient-to-br from-[rgba(245,158,11,0.05)] to-[#18181b] border border-[#f59e0b] rounded-2xl p-8 flex flex-col relative hover:translate-y-[-4px] transition-all">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-[#09090b] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
                <div className="pb-6 mb-6 border-b border-[#27272a]">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#f59e0b] mb-2">Small Business</div>
                  <div className="font-serif text-2xl font-semibold mb-4">Teams of 1–10</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-[#a1a1aa]">$</span>
                    <span className="font-serif text-5xl font-bold">{isAnnual ? '15' : '19'}</span>
                    <span className="text-sm text-[#71717a]">/month</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3.5 mb-8">
                  {[
                    { text: 'Up to 200 assets', coming: false },
                    { text: '3 team members', coming: false },
                    { text: 'Advanced reporting', coming: false },
                    { text: 'Asset transfer workflow', coming: true },
                  ].map((item, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${item.coming ? 'text-[#71717a]' : 'text-[#a1a1aa]'}`}>
                      {item.coming ? (
                        <svg className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path strokeLinecap="round" d="M12 6v6l4 2"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                      {item.text}
                      {item.coming && <span className="text-[0.65rem] bg-[rgba(245,158,11,0.15)] text-[#f59e0b] px-2 py-0.5 rounded font-semibold ml-1">Coming Soon</span>}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openUpgradeModal('Small Business', isAnnual ? '$15/mo' : '$19/mo')} className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-[#f59e0b] text-[#09090b] hover:shadow-[0_20px_40px_rgba(245,158,11,0.25)] transition-all">
                  Upgrade
                </button>
              </div>

              {/* Growing Business */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 flex flex-col hover:border-[#3f3f46] hover:translate-y-[-4px] transition-all">
                <div className="pb-6 mb-6 border-b border-[#27272a]">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#71717a] mb-2">Growing Business</div>
                  <div className="font-serif text-2xl font-semibold mb-4">Scaling Teams</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-[#a1a1aa]">$</span>
                    <span className="font-serif text-5xl font-bold">{isAnnual ? '31' : '39'}</span>
                    <span className="text-sm text-[#71717a]">/month</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-3.5 mb-8">
                  {['Unlimited assets', '10 team members', 'White-label exports', 'Priority support'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#a1a1aa]">
                      <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openUpgradeModal('Growing Business', isAnnual ? '$31/mo' : '$39/mo')} className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-transparent text-white border border-[#27272a] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all">
                  Upgrade
                </button>
              </div>
            </div>

            <p className="text-center mt-12 text-sm text-[#71717a]">
              Need a custom solution for your agency or enterprise?{' '}
              <a href="mailto:businessvault@clickstartbiz.com" className="text-[#f59e0b] hover:underline">Let's talk</a>
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 lg:px-12 bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#18181b] text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.1)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="max-w-[800px] mx-auto relative">
            <h2 className="font-serif text-4xl lg:text-6xl font-semibold leading-tight mb-6 tracking-tight">
              Know what you have.<br/><em className="italic text-[#f59e0b]">Access it when it matters.</em>
            </h2>
            <p className="text-xl text-[#a1a1aa] mb-10">Don't wait for a crisis. Start documenting your business infrastructure today.</p>
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all">
              Start Free →
            </Link>
            <p className="mt-6 text-sm text-[#52525b]">Free for up to 5 assets. No credit card required.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-12 bg-[#09090b] border-t border-[#18181b] text-center">
          <p className="text-sm text-[#52525b]">© 2025 Business Vault. All rights reserved.</p>
        </footer>

        {/* Upgrade Modal */}
        {modalOpen && (
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[1001] p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-[#18181b] border border-[#27272a] rounded-2xl p-10 max-w-[440px] w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-[#71717a] hover:text-white text-3xl leading-none">
                ×
              </button>
              
              {!formSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      Upgrade to <span className="text-[#f59e0b]">{modalPlan.name}</span>
                    </h3>
                    <p className="text-[#a1a1aa]">{modalPlan.price}</p>
                  </div>
                  
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#a1a1aa]">Plan</label>
                      <select 
                        value={formData.plan}
                        onChange={e => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                        className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#f59e0b] appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      >
                        <option value="Solopreneur">Solopreneur — $9/mo ($7/mo annual)</option>
                        <option value="Small Business">Small Business — $19/mo ($15/mo annual)</option>
                        <option value="Growing Business">Growing Business — $39/mo ($31/mo annual)</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#a1a1aa]">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#a1a1aa]">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#a1a1aa]">Company (optional)</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Your business name"
                        className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#a1a1aa]">Billing Preference</label>
                      <select 
                        value={formData.billing}
                        onChange={e => setFormData(prev => ({ ...prev, billing: e.target.value }))}
                        className="bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#f59e0b] appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual (Save 20%)</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="mt-2 w-full inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all">
                      Request Upgrade
                    </button>
                    <p className="text-center text-xs text-[#52525b]">We'll send you a secure payment link within 24 hours.</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[rgba(34,197,94,0.15)] border-2 border-[#22c55e] rounded-full flex items-center justify-center text-3xl text-[#22c55e] mx-auto mb-6">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl font-semibold mb-2">Request Received!</h4>
                  <p className="text-[#a1a1aa]">We'll send your payment link shortly.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
