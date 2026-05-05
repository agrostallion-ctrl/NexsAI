'use client'

// ✅ Fix 1: No inline STYLES const — imported as static CSS file


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '../../lib/api'

// ✅ Fix 3: WhatsApp number from env, never hardcoded
// Set NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999 in .env.local
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
const waHref = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingForm {
  name: string
  email: string
  phone: string
  company: string
  size: string
}

type FormField = keyof BookingForm

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Chatbot',
    desc: 'GPT-powered responses jo 24/7 customers handle kare — bina kisi agent ke.',
  },
  {
    icon: '📢',
    title: 'Bulk Broadcasts',
    desc: 'Ek click mein hazaron customers tak targeted WhatsApp messages pahuncho.',
  },
  {
    icon: '💳',
    title: 'In-Chat Payments',
    desc: 'Razorpay/Cashfree ke saath payment links directly WhatsApp mein bhejo.',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    desc: 'Delivery, open aur conversion rates ek clean dashboard pe dekho.',
  },
]

const CHAPTERS = [
  { time: '0:00', label: 'Product Overview' },
  { time: '1:20', label: 'AI Chatbot Setup' },
  { time: '3:05', label: 'Broadcast Campaign' },
  { time: '5:40', label: 'Payment Integration' },
  { time: '7:15', label: 'Analytics Dashboard' },
]

const COMPANY_SIZES = [
  'Sirf main (1)',
  '2–10 log',
  '11–50 log',
  '51–200 log',
  '200+ log',
]

const EMPTY_FORM: BookingForm = {
  name: '', email: '', phone: '', company: '', size: '',
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

function VideoPlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="demo-video-wrap">
      <div className="demo-video-glow" />

      <div className="demo-video-card">
        {/* Fake browser chrome */}
        <div className="demo-video-bar">
          <span className="demo-dot" style={{ background: '#f87171' }} />
          <span className="demo-dot" style={{ background: '#fbbf24' }} />
          <span className="demo-dot" style={{ background: '#4ade80' }} />
          <span className="demo-url">app.nexusai.in/dashboard</span>
        </div>

        <div className="demo-video-body">
          {!playing ? (
            <button
              className="demo-play-btn"
              onClick={() => setPlaying(true)}
              aria-label="Play demo video"
            >
              <div className="demo-play-ring">
                <div className="demo-play-icon">▶</div>
              </div>
              <span className="demo-play-label">8 min product walkthrough</span>
            </button>
          ) : (
            /**
             * Replace this placeholder with your actual embed:
             * <iframe
             *   src="https://www.loom.com/embed/YOUR_ID"
             *   allow="fullscreen"
             *   style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:0 }}
             * />
             */
            <div className="demo-coming-soon">
              <span>🎬</span>
              <p>Video embed yahan aayega</p>
              <code>{'<iframe src="your-loom-or-youtube-url" />'}</code>
            </div>
          )}
        </div>

        <div className="demo-chapters">
          {CHAPTERS.map((c) => (
            <button
              key={c.time}
              className="demo-chapter"
              onClick={() => setPlaying(true)}
            >
              <span className="demo-chapter-time">{c.time}</span>
              <span className="demo-chapter-label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BookingModal ─────────────────────────────────────────────────────────────

function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isValid =
    form.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.phone.replace(/\D/g, '').length >= 10 &&
    form.size !== ''

  const set = (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }))
      setError('')
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    try {
      // ✅ Fix 4: Real API call — no setTimeout fake
      await api.post('/demo/book', {
        name:    form.name.trim(),
        email:   form.email.toLowerCase().trim(),
        phone:   form.phone.trim(),
        company: form.company.trim(),
        size:    form.size,
      })
      setSubmitted(true)
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        'Kuch problem aayi. Dobara try karo ya WhatsApp karo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-modal-overlay" role="dialog" aria-modal="true" aria-label="Book a demo">
      <div className="demo-modal-backdrop" onClick={onClose} />

      <div className="demo-modal">
        <button className="demo-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div className="demo-modal-success">
            <div className="demo-success-icon">✓</div>
            <h2>Demo Scheduled!</h2>
            <p>
              Hamari team <strong>{form.email}</strong> pe 24 ghante mein contact
              karegi. Jaldi mein ho?
            </p>
            <a
              href={waHref('NexusAI demo abhi dekhna hai')}
              target="_blank"
              rel="noreferrer"
              className="demo-whatsapp-btn"
            >
              WhatsApp pe Baat Karo →
            </a>
          </div>
        ) : (
          <>
            <div className="demo-modal-head">
              <div className="demo-modal-logo">Nexus<span>AI</span></div>
              <h2>Live Demo Schedule Karo</h2>
              <p>15-minute personalised walkthrough — aapke use-case ke liye.</p>
            </div>

            <form onSubmit={handleSubmit} className="demo-form" noValidate>
              <div className="demo-form-row">
                <div className="demo-field">
                  <label htmlFor="d-name">Aapka Naam</label>
                  <input
                    id="d-name" type="text" value={form.name}
                    onChange={set('name')} placeholder="Rahul Sharma"
                    autoComplete="name" required
                  />
                </div>
                <div className="demo-field">
                  <label htmlFor="d-company">Company</label>
                  <input
                    id="d-company" type="text" value={form.company}
                    onChange={set('company')} placeholder="StyleKart"
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="demo-form-row">
                <div className="demo-field">
                  <label htmlFor="d-email">Email</label>
                  <input
                    id="d-email" type="email" value={form.email}
                    onChange={set('email')} placeholder="rahul@stylekart.in"
                    autoComplete="email" required
                  />
                </div>
                <div className="demo-field">
                  <label htmlFor="d-phone">WhatsApp Number</label>
                  <input
                    id="d-phone" type="tel" value={form.phone}
                    onChange={set('phone')} placeholder="+91 98765 43210"
                    autoComplete="tel" required
                  />
                </div>
              </div>

              <div className="demo-field">
                <label htmlFor="d-size">Team Size</label>
                <select
                  id="d-size" value={form.size}
                  onChange={set('size')} required
                >
                  <option value="">Select karo</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {error && <p className="demo-form-error">{error}</p>}

              <button
                type="submit"
                disabled={!isValid || loading}
                className="demo-form-submit"
              >
                {loading ? (
                  <span className="demo-btn-spinner">
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Booking...
                  </span>
                ) : 'Demo Book Karo →'}
              </button>

              <p className="demo-form-fine">
                Koi spam nahi. Sirf ek friendly call aapke business ke baare mein.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function DemoClient() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="demo-root">
        {/* Background */}
        <div className="demo-bg">
          <div className="demo-bg-glow demo-bg-glow--1" />
          <div className="demo-bg-glow demo-bg-glow--2" />
          <div className="demo-bg-grid" />
        </div>

        {/* Nav */}
        <nav className="demo-nav">
          <Link href="/" className="demo-logo">Nexus<span>AI</span></Link>
          <div className="demo-nav-right">
            <button className="demo-nav-ghost" onClick={() => router.push('/')}>
              ← Home
            </button>
            <button className="demo-nav-cta" onClick={() => router.push('/signup')}>
              Free Trial Shuru Karo
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="demo-hero">
          <div className="demo-badge">
            <span className="demo-badge-dot" />
            Live Product Demo
          </div>
          <h1 className="demo-h1">
            Dekho NexusAI<br />
            <em>kaise kaam karta hai</em>
          </h1>
          <p className="demo-sub">
            8-minute walkthrough — AI chatbot se lekar payments tak, sab ek saath.
            Ya directly humse baat karo aur apne business ke liye personalised demo lo.
          </p>
          <div className="demo-hero-ctas">
            <button className="demo-btn-primary" onClick={() => setModalOpen(true)}>
              📅 Live Demo Schedule Karo
            </button>
            <a
              href={waHref('NexusAI ka demo dekhna hai')}
              target="_blank"
              rel="noreferrer"
              className="demo-btn-whatsapp"
            >
              💬 WhatsApp pe Baat Karo
            </a>
          </div>
        </section>

        {/* Video */}
        <section className="demo-section">
          <VideoPlayer />
        </section>

        {/* Features */}
        <section className="demo-section demo-features-section">
          <p className="demo-features-label">Is demo mein cover hoga</p>
          <div className="demo-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="demo-feat-card">
                <span className="demo-feat-icon">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Strip */}
        <section className="demo-cta-strip">
          <div className="demo-cta-inner">
            <h2>Ready to start karna hai?</h2>
            <p>14-din ka free trial — koi credit card nahi chahiye.</p>
            <div className="demo-cta-btns">
              <button className="demo-btn-primary" onClick={() => router.push('/signup')}>
                Free Trial Shuru Karo →
              </button>
              <button className="demo-btn-outline" onClick={() => setModalOpen(true)}>
                📅 Pehle Demo Dekho
              </button>
            </div>
            <p className="demo-cta-fine">
              ✓ No credit card &nbsp;·&nbsp; ✓ 2-min setup &nbsp;·&nbsp; ✓ Kabhi bhi cancel karo
            </p>
          </div>
        </section>
      </div>

      {modalOpen && <BookingModal onClose={() => setModalOpen(false)} />}
    </>
  )
}