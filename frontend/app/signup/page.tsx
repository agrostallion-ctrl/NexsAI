'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../lib/api'

// ✅ Improvement 1: Email validation regex
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  // ✅ Improvement 4: Track which field has error for red border
  const [fieldError, setFieldError] = useState<string | null>(null)

  // ✅ Improvement 5: trim() on handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value.trimStart() }))
    setFieldError(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Improvement 1: Client-side validation before hitting backend
    if (!form.company.trim()) { setFieldError('company'); setError('Company name required.'); return }
    if (!form.name.trim())    { setFieldError('name');    setError('Your name required.'); return }
    if (!isValidEmail(form.email)) { setFieldError('email'); setError('Please enter a valid email address.'); return }
    if (form.password.length < 8)  { setFieldError('password'); setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError('')
    setFieldError(null)

    try {
      const { data } = await api.post('/auth/register', {
        company_name: form.company.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      // ✅ Improvement 3: Token stored — can be migrated to cookies later
      localStorage.setItem('token', data.token)
      if (data.company_id) localStorage.setItem('company_id', String(data.company_id))

      router.push('/onboarding')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper: field has error
  const hasErr = (field: string) => fieldError === field

  return (
    <div className="auth-root" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Ambient background */}
      <div className="auth-bg">
        <div className="auth-glow auth-glow--1" />
        <div className="auth-glow auth-glow--2" />
        <div className="auth-grid" />
      </div>

      {/* ── Left Panel ── */}
      <div className="auth-left">
        <Link href="/" className="auth-logo">Nexus<span>AI</span></Link>

        <div className="auth-left-content">
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            Join 500+ agro businesses
          </div>

          <h1 className="auth-headline">
            Start growing your<br />
            <em>agro business</em><br />
            on WhatsApp
          </h1>

          <p className="auth-desc">
            Setup in 10 minutes. Connect your WhatsApp Business number and start broadcasting to farmers instantly.
          </p>

          <div className="auth-perks">
            {['14-day free trial', 'No credit card required', 'Cancel anytime', 'WhatsApp Business API'].map(p => (
              <div key={p} className="auth-perk">
                <span className="auth-perk-check">✓</span>
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-testi">
          <p>"Setup 10 minute mein ho gaya. Agle din se orders aane lage."</p>
          <div className="auth-testi-author">
            <div className="auth-testi-avatar" style={{ background: '#2e7d32' }}>RP</div>
            <div>
              <div className="auth-testi-name">Ramesh Patel</div>
              <div className="auth-testi-role">Owner, Patel Agro Supplies</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-card-head">
            <h2>Create your account</h2>
            <p>Already have an account? <Link href="/login">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>

            {/* ✅ Improvement 2: id + htmlFor for accessibility */}
            <div className="auth-field">
              <label htmlFor="company">Company Name</label>
              <div className={`auth-input-wrap${hasErr('company') ? ' auth-input-wrap--error' : ''}`}>
                <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <input id="company" name="company" type="text" value={form.company}
                  onChange={handleChange} placeholder="Patel Agro Supplies"
                  autoComplete="organization" required aria-invalid={hasErr('company')}
                  aria-describedby={hasErr('company') ? 'form-error' : undefined} />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="name">Your Name</label>
              <div className={`auth-input-wrap${hasErr('name') ? ' auth-input-wrap--error' : ''}`}>
                <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="name" name="name" type="text" value={form.name}
                  onChange={handleChange} placeholder="Ramesh Patel"
                  autoComplete="name" required aria-invalid={hasErr('name')} />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className={`auth-input-wrap${hasErr('email') ? ' auth-input-wrap--error' : ''}`}>
                <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="email" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="you@company.com"
                  autoComplete="email" required aria-invalid={hasErr('email')} />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className={`auth-input-wrap${hasErr('password') ? ' auth-input-wrap--error' : ''}`}>
                <svg className="auth-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input id="password" name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  required minLength={8} aria-invalid={hasErr('password')} />
                <button type="button" className="auth-pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ✅ Improvement 4: Error with aria role */}
            {error && (
              <div id="form-error" className="auth-error" role="alert" aria-live="polite">
                <svg width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <span className="auth-spinner-wrap">
                  <svg className="auth-spinner" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>

            <p className="auth-terms">
              By signing up you agree to our{' '}
              <Link href="/terms">Terms</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>
            </p>

          </form>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        .auth-root { min-height:100vh; display:flex; background:#0a0f0d; color:#e9edef; overflow:hidden; }
        .auth-bg { position:fixed; inset:0; pointer-events:none; z-index:0; }
        .auth-glow { position:absolute; border-radius:50%; }
        .auth-glow--1 { top:-20%; left:-10%; width:600px; height:600px; background:radial-gradient(circle, rgba(0,168,132,0.1) 0%, transparent 70%); }
        .auth-glow--2 { bottom:-20%; right:-10%; width:500px; height:500px; background:radial-gradient(circle, rgba(37,211,102,0.06) 0%, transparent 70%); }
        .auth-grid { position:absolute; inset:0; opacity:0.025; background-image:linear-gradient(#00a884 1px,transparent 1px),linear-gradient(90deg,#00a884 1px,transparent 1px); background-size:60px 60px; }
        .auth-left { width:50%; padding:3rem 4rem; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:1; border-right:1px solid rgba(255,255,255,0.06); }
        .auth-logo { font-weight:900; font-size:1.5rem; color:#fff; text-decoration:none; letter-spacing:-0.02em; }
        .auth-logo span { color:#00a884; }
        .auth-left-content { flex:1; display:flex; flex-direction:column; justify-content:center; padding:3rem 0; }
        .auth-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(0,168,132,0.08); border:1px solid rgba(0,168,132,0.22); color:#00a884; font-size:.78rem; font-weight:600; padding:.38rem 1rem; border-radius:100px; margin-bottom:2rem; width:fit-content; }
        .auth-badge-dot { width:7px; height:7px; border-radius:50%; background:#00a884; animation:auth-pulse 1.8s infinite; }
        .auth-headline { font-size:clamp(2rem,3.5vw,3rem); font-weight:900; line-height:1.1; letter-spacing:-0.03em; color:#fff; margin-bottom:1.2rem; }
        .auth-headline em { font-style:normal; color:#00a884; }
        .auth-desc { color:#8696a0; font-size:1rem; line-height:1.7; max-width:420px; margin-bottom:2rem; }
        .auth-perks { display:flex; flex-direction:column; gap:.7rem; }
        .auth-perk { display:flex; align-items:center; gap:.75rem; font-size:.9rem; color:#e9edef; }
        .auth-perk-check { width:20px; height:20px; border-radius:50%; background:rgba(0,168,132,0.15); color:#00a884; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .auth-testi { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:1.4rem; }
        .auth-testi p { color:rgba(233,237,239,0.75); font-size:.9rem; line-height:1.65; font-style:italic; margin-bottom:1rem; }
        .auth-testi-author { display:flex; align-items:center; gap:.75rem; }
        .auth-testi-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.82rem; color:#fff; flex-shrink:0; }
        .auth-testi-name { font-weight:600; font-size:.85rem; color:#fff; }
        .auth-testi-role { font-size:.75rem; color:#8696a0; }
        .auth-right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; position:relative; z-index:1; }
        .auth-card { width:100%; max-width:420px; }
        .auth-card-head { margin-bottom:2rem; }
        .auth-card-head h2 { font-size:1.8rem; font-weight:900; color:#fff; letter-spacing:-0.025em; margin-bottom:.4rem; }
        .auth-card-head p { color:#8696a0; font-size:.9rem; }
        .auth-card-head a { color:#00a884; text-decoration:none; font-weight:600; }
        .auth-form { display:flex; flex-direction:column; gap:1rem; }
        .auth-field { display:flex; flex-direction:column; gap:.4rem; }
        .auth-field label { font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#8696a0; }
        .auth-input-wrap { position:relative; }
        .auth-input-icon { position:absolute; left:1rem; top:50%; transform:translateY(-50%); color:#8696a0; pointer-events:none; transition:color 0.2s; }
        .auth-input-wrap:focus-within .auth-input-icon { color:#00a884; }
        .auth-input-wrap input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:.82rem 1rem .82rem 2.8rem; color:#e9edef; font-size:.95rem; outline:none; transition:border-color 0.2s,background 0.2s; font-family:inherit; }
        .auth-input-wrap input:focus { border-color:rgba(0,168,132,0.5); background:rgba(0,168,132,0.04); }
        .auth-input-wrap input::placeholder { color:rgba(134,150,160,0.6); }
        /* ✅ Improvement 4: Red border on field error */
        .auth-input-wrap--error input { border-color:rgba(248,113,113,0.5) !important; background:rgba(248,113,113,0.04) !important; }
        .auth-input-wrap--error .auth-input-icon { color:#f87171 !important; }
        .auth-pass-toggle { position:absolute; right:1rem; top:50%; transform:translateY(-50%); background:none; border:none; color:#8696a0; cursor:pointer; padding:0; transition:color 0.2s; }
        .auth-pass-toggle:hover { color:#e9edef; }
        .auth-error { display:flex; align-items:center; gap:.5rem; background:rgba(248,113,113,0.08); border:1px solid rgba(248,113,113,0.2); border-radius:10px; padding:.65rem .9rem; color:#f87171; font-size:.85rem; }
        .auth-submit { width:100%; padding:.9rem; border-radius:12px; border:none; cursor:pointer; font-weight:700; font-size:1rem; color:#fff; background:linear-gradient(135deg,#00a884,#25d366); box-shadow:0 0 30px rgba(0,168,132,0.25); transition:opacity 0.2s,transform 0.2s; font-family:inherit; margin-top:.25rem; }
        .auth-submit:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
        .auth-submit:disabled { opacity:.55; cursor:not-allowed; }
        .auth-spinner-wrap { display:flex; align-items:center; justify-content:center; gap:.5rem; }
        .auth-spinner { animation:auth-spin .8s linear infinite; }
        .auth-terms { text-align:center; font-size:.78rem; color:#8696a0; line-height:1.6; }
        .auth-terms a { color:#00a884; text-decoration:none; }
        @keyframes auth-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes auth-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width:768px) { .auth-left{display:none} .auth-right{width:100%} }
      `}</style>
    </div>
  )
}