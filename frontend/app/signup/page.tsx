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

  const API_BASE_URL = 'http://127.0.0.1:8001'

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        `${API_BASE_URL}/client/register`,
        {
          company_name: form.company_name.trim(),
          admin_name: form.admin_name.trim(), // ✅ FIXED (.strip → .trim)
          email: form.email.trim().toLowerCase(),
          password: form.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.status === 'success') {
        setSuccess('Account created successfully! Redirecting...')

        setTimeout(() => {
          router.push('/onboarding')
        }, 1200)
      }

    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Registration failed. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 bg-gray-950 p-8 border border-gray-800 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Launch StallionAgro
          </h1>
          <p className="text-gray-400 text-sm">
            Create your SaaS admin account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-900/20 border border-green-900 text-green-400 p-3 rounded-lg text-sm text-center">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">

          <input
            className={inputClass}
            type="text"
            placeholder="Company Name"
            required
            value={form.company_name}
            onChange={e =>
              setForm({ ...form, company_name: e.target.value })
            }
          />

          <input
            className={inputClass}
            type="text"
            placeholder="Admin Name"
            required
            value={form.admin_name}
            onChange={e =>
              setForm({ ...form, admin_name: e.target.value })
            }
          />

          <input
            className={inputClass}
            type="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>

      </div>
    </div>
  )
}