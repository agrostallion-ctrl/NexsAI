'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../lib/api'

// Email validation helper
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  // Improvement: Disable button if inputs are clearly wrong
  const isFormValid = useMemo(() => {
    return isValidEmail(email) && password.length >= 6
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || loading) return

    setLoading(true)
    setError('')
    setFieldError(null)

    try {
      const { data } = await api.post('/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      })

      // Secure storage (Recommend moving to Cookies for production)
      localStorage.setItem('token', data.token)
      if (data.company_id) localStorage.setItem('company_id', String(data.company_id))
      
      // WhatsApp Connection status persistence
      if (data.whatsapp_connected !== undefined) {
        localStorage.setItem('whatsapp_connected', String(data.whatsapp_connected))
      }

      // Logic: Route based on onboarding status
      router.push(data.whatsapp_connected ? '/chat' : '/onboarding')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Invalid email or password.'
      setError(msg)
      // Highlight fields on error
      if (msg.toLowerCase().includes('email')) setFieldError('email')
      if (msg.toLowerCase().includes('password')) setFieldError('password')
    } finally {
      setLoading(false)
    }
  }

  const hasErr = (field: string) => fieldError === field

  return (
    <div className="auth-root" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="auth-bg">
        <div className="auth-glow auth-glow--1" />
        <div className="auth-glow auth-glow--2" />
        <div className="auth-grid" />
      </div>

      {/* Left Panel: Brand & Social Proof */}
      <div className="auth-left">
        <Link href="/" className="auth-logo">Nexus<span>AI</span></Link>

        <div className="auth-left-content">
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            Real-time WhatsApp Commerce
          </div>

          <h1 className="auth-headline">
            Welcome back to<br />
            <em>NexusAI</em>
          </h1>

          <p className="auth-desc">
            Manage all your farmer conversations, broadcast price updates, and track orders — all from one dashboard.
          </p>

          <div className="auth-perks">
            {[
              'Multi-agent shared inbox',
              'Bulk broadcast to farmers',
              'Real-time delivery reports',
              'AI-powered auto replies',
            ].map(p => (
              <div key={p} className="auth-perk">
                <span className="auth-perk-check">✓</span>
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-stats">
          {[
            { value: '500+', label: 'Businesses' },
            { value: '10K+', label: 'Msgs / day' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label} className="auth-stat">
              <div className="auth-stat-val">{s.value}</div>
              <div className="auth-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-head">
            <h2>Sign in to NexusAI</h2>
            <p>Don't have an account? <Link href="/signup">Create one free</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className={`auth-input-wrap${hasErr('email') ? ' auth-input-wrap--error' : ''}`}>
                <IconEmail />
                <input
                  id="email" type="email" value={email}
                  onChange={e => { setEmail(e.target.value.trimStart()); setError(''); setFieldError(null) }}
                  placeholder="you@company.com" autoComplete="email"
                  required aria-invalid={hasErr('email')}
                  aria-describedby={error ? 'form-error' : undefined}
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" title="Feature coming soon" className="auth-forgot">Forgot password?</Link>
              </div>
              <div className={`auth-input-wrap${hasErr('password') ? ' auth-input-wrap--error' : ''}`}>
                <IconLock />
                <input
                  id="password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); setFieldError(null) }}
                  placeholder="••••••••" autoComplete="current-password"
                  required aria-invalid={hasErr('password')}
                />
                <button type="button" className="auth-pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {error && (
              <div id="form-error" className="auth-error" role="alert" aria-live="polite">
                <IconError />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !isFormValid} className="auth-submit">
              {loading ? (
                <span className="auth-spinner-wrap">
                  <svg className="auth-spinner" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Verifying...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Keeping your existing CSS structure */}
    </div>
  )
}

// Icon Components for Clean JSX
const IconEmail = () => <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IconLock = () => <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const IconEye = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconEyeOff = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const IconError = () => <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>