import dynamic from 'next/dynamic'
import Link from 'next/link'

// 🚀 Lazy-loaded Chat Demo
const ChatDemo = dynamic(
  () => import('./ChatDemo'),
  {
    ssr: false,
    loading: () => (
      <div className="nx-chat-loading">
        Loading live demo...
      </div>
    )
  }
)

const STATS = [
  { value: '500+', label: 'Agro Businesses' },
  { value: '10K+', label: 'Messages / Day' },
  { value: '99.9%', label: 'Uptime SLA' },
]

interface HeroProps {
  onSignupClick: () => void
  onDemoClick: () => void
}

export default function Hero({
  onSignupClick,
  onDemoClick
}: HeroProps) {
  return (
    <section className="nx-hero">
      <div className="nx-hero-bg" />
      <div className="nx-grid-overlay" />

      {/* 🚀 Responsive Container */}
      <div className="nx-container nx-hero-wrapper">

        {/* ========================= */}
        {/* LEFT CONTENT */}
        {/* ========================= */}
        <div className="nx-hero-inner">

          {/* Badge */}
          <div className="nx-badge">
            <span className="nx-badge-dot" />
            WhatsApp Business Platform for Agro
          </div>

          {/* Headline */}
          <h1 className="nx-h1">
            <span>
              5X Your Agro
            </span>

            <span>
              Business with <em>WhatsApp</em>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="nx-hero-sub">
            NexusAI helps StallionAgro partners
            broadcast price updates, automate
            farmer replies, and manage all
            conversations from one powerful
            dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="nx-hero-ctas">

            <button
              onClick={onSignupClick}
              className="nx-btn-primary"
            >
              Start Free Trial →
            </button>

            <button
              onClick={onDemoClick}
              className="nx-btn-ghost"
            >
              Watch Demo
            </button>

          </div>

          {/* Fine Print */}
          <p className="nx-hero-fine">
            14-day free trial · No credit card
            · Setup in 10 minutes
          </p>

          {/* Stats */}
          <div className="nx-hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="nx-stat-val">
                  {stat.value}
                </div>

                <div className="nx-stat-lbl">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ========================= */}
        {/* RIGHT VISUAL */}
        {/* ========================= */}
        <div className="nx-hero-visual">

          <div className="nx-mock-card">

            {/* Header */}
            <div className="nx-mock-header">
              <span className="nx-mock-title">
                NexusAI Live Chat
              </span>

              <span className="nx-live-dot">
                Live
              </span>
            </div>

            {/* Chat Demo */}
            <ChatDemo />

            {/* Footer */}
            <div className="nx-mock-footer">
              <span>
                Type a message...
              </span>

              <div className="nx-send-btn">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}