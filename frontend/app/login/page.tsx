'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // =========================
  // 🚀 LOGIN HANDLER
  // =========================
  const handleLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      // 🔐 Auth API
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      })

      const token = res.data.access_token

      if (!token) {
        throw new Error(
          'No authentication token received.'
        )
      }

      // =========================
      // 💾 LOCAL STORAGE
      // =========================
      localStorage.setItem('token', token)

      if (res.data.company_id) {
        localStorage.setItem(
          'company_id',
          String(res.data.company_id)
        )
      }

      if (res.data.agent_id) {
        localStorage.setItem(
          'agent_id',
          String(res.data.agent_id)
        )
      }

      // =========================
      // 🏢 ONBOARDING STATUS
      // =========================
      const whatsappConnected =
        res.data.whatsapp_connected === true

      if (whatsappConnected) {
        localStorage.setItem(
          'whatsapp_connected',
          'true'
        )

        router.replace('/chat')

      } else {
        localStorage.removeItem(
          'whatsapp_connected'
        )

        router.replace('/onboarding')
      }

    } catch (err: any) {
      console.error(err)

      const message =
        err.response?.data?.detail ||
        err.message ||
        'Invalid email or password.'

      setError(message)

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // 🎨 UI
  // =========================
  const inputClass =
    'w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl ' +
    'focus:outline-none focus:border-blue-500 focus:ring-1 ' +
    'focus:ring-blue-500 text-white placeholder-zinc-500 transition-all'

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6 font-sans">
      <div className="w-full max-w-md p-10 bg-zinc-950 border border-zinc-900 rounded-[2rem] shadow-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-zinc-500 text-sm">
            Login to your NexusAI account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-900/10 border border-red-900/30 text-red-400 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className={inputClass}
          />

          <input
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className={inputClass}
          />

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {loading
              ? 'Verifying...'
              : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() =>
              router.push('/signup')
            }
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
          >
            Sign up
          </button>
        </p>

      </div>
    </main>
  )
}