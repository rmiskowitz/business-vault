'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[radial-gradient(ellipse_at_center_top,rgba(245,158,11,0.08)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="font-serif font-semibold text-2xl text-white">Business Vault</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-[#a1a1aa]">
            Start documenting your business assets today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b] transition-colors"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b] transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b] transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full font-semibold bg-white text-[#09090b] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-[#a1a1aa]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#f59e0b] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-[#52525b]">
          Free for up to 5 assets. No credit card required.
        </p>
      </div>
    </div>
  )
}
