'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

// =========================
// 🏷️ BRANDING
// =========================
const BRAND_NAME = 'Pangea'

// =========================
// 📋 TYPES
// =========================
interface SignupModalProps {
  open: boolean
  onClose: () => void
}

export default function SignupModal({
  open,
  onClose
}: SignupModalProps) {
  const router = useRouter()

  // =========================
  // 🧠 STATE
  // =========================
  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      password: ''
    })

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  if (!open) return null

  // =========================
  // ✍️ INPUT HANDLER
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    })
  }

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    // Basic validation
    if (
      formData.password.length <
      8
    ) {
      setError(
        'Password must be at least 8 characters.'
      )

      return
    }

    setLoading(true)
    setError('')

    try {
      const {
        data
      } = await api.post(
        '/auth/register',
        {
          name: formData.name
            .trim(),
          email:
            formData.email
              .trim()
              .toLowerCase(),
          password:
            formData.password
        }
      )

      // 🔐 Save token
      localStorage.setItem(
        'token',
        data.access_token ||
          data.token
      )

      // 🏢 Save company
      if (data.company_id) {
        localStorage.setItem(
          'company_id',
          String(
            data.company_id
          )
        )
      }

      onClose()

      router.push(
        '/onboarding'
      )

    } catch (err: any) {
      setError(
        err?.response?.data
          ?.detail ||
          'Signup failed. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // 🖥️ UI
  // =========================
  return (
    <div
      className="nx-modal-overlay"
      onClick={() => {
        if (!loading)
          onClose()
      }}
    >
      <div
        className="nx-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Close */}
        <button
          className="nx-modal-close"
          onClick={onClose}
          aria-label="Close signup modal"
          disabled={loading}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="nx-modal-logo">
          {BRAND_NAME}
          <span>AI</span>
        </div>

        {/* Header */}
        <h2 className="nx-modal-title">
          Start Your Free Trial
        </h2>

        <p className="nx-modal-sub">
          14 days free · No credit
          card required · Setup in
          minutes
        </p>

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="nx-modal-form"
        >
          {/* Name */}
          <div className="nx-field">
            <label>
              Full Name
            </label>

            <input
              name="name"
              type="text"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Ramesh Patel"
              required
            />
          </div>

          {/* Email */}
          <div className="nx-field">
            <label>
              Email Address
            </label>

            <input
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="name@business.com"
              required
            />
          </div>

          {/* Password */}
          <div className="nx-field">
            <label>
              Password
            </label>

            <input
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="nx-modal-error">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading
            }
            className="nx-btn-primary"
            style={{
              width: '100%',
              border: 'none',
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
              opacity:
                loading
                  ? 0.7
                  : 1
            }}
          >
            {loading
              ? 'Creating account...'
              : 'Create Free Account →'}
          </button>

        </form>

        {/* Footer */}
        <p className="nx-modal-footer">
          Already have an
          account?{' '}
          <Link
            href="/login"
            className="nx-link"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  )
}