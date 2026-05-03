'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    company_name: '',
    admin_name: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 🌐 Production backend URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://your-backend.up.railway.app'

  // =========================
  // 🚀 SIGNUP HANDLER
  // =========================
  const handleSignup = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        company_name: form.company_name.trim(),
        admin_name: form.admin_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      }

      const response = await axios.post(
        `${API_BASE_URL}/client/register`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.status === 'success') {
        // 🔐 Save token if backend returns it
        if (response.data.access_token) {
          localStorage.setItem(
            'token',
            response.data.access_token
          )
        }

        // 🏢 Optional company ID save
        if (response.data.company_id) {
          localStorage.setItem(
            'company_id',
            String(response.data.company_id)
          )
        }

        setSuccess(
          'Account created successfully! Redirecting...'
        )

        // 🚀 Redirect to onboarding
        setTimeout(() => {
          router.push('/onboarding')
        }, 1500)
      }

    } catch (err: any) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
        err.message ||
        'Registration failed. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // 🎨 UI STYLES
  // =========================
  const inputClass =
    'w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl ' +
    'focus:outline-none focus:border-blue-500 text-white ' +
    'placeholder-zinc-500 transition-all focus:ring-1 focus:ring-blue-500'

  // =========================
  // 🖥️ PAGE
  // =========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-sans">
      <div className="w-full max-w-md space-y-8 bg-zinc-950 p-10 border border-zinc-900 rounded-[2rem] shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Launch StallionAgro
          </h1>

          <p className="text-zinc-400 text-sm">
            Create your SaaS admin account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/10 border border-red-900/30 text-red-400 p-3 rounded-xl text-xs text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-900/10 border border-green-900/30 text-green-400 p-3 rounded-xl text-xs text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >
          <input
            className={inputClass}
            type="text"
            placeholder="Company Name"
            required
            value={form.company_name}
            onChange={(e) =>
              setForm({
                ...form,
                company_name: e.target.value
              })
            }
          />

          <input
            className={inputClass}
            type="text"
            placeholder="Admin Name"
            required
            value={form.admin_name}
            onChange={(e) =>
              setForm({
                ...form,
                admin_name: e.target.value
              })
            }
          />

          <input
            className={inputClass}
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            className={inputClass}
            type="password"
            placeholder="Password (min. 6 chars)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {loading
              ? 'Creating Account...'
              : 'Get Started'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() =>
              router.push('/login')
            }
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  )
}