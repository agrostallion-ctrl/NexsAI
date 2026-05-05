'use client'

import { useReveal } from '../../hooks/useReveal'

interface CTAProps {
  onSignupClick: () => void
  onDemoClick: () => void
}

export default function CTA({
  onSignupClick,
  onDemoClick
}: CTAProps) {
  const { ref, visible } = useReveal()

  return (
    <section className="nx-cta-section">
      <div className="nx-container">

        <div
          ref={ref}
          className={`nx-cta-inner nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {/* Label */}
          <span className="nx-label">
            Get Started Today
          </span>

          {/* Headline */}
          <h2 className="nx-h2">
            Ready to grow your agro business?
          </h2>

          {/* Subheadline */}
          <p className="nx-section-sub">
            Join 500+ businesses using
            NexusAI. Automate WhatsApp,
            increase sales, and scale
            customer communication —
            all from one platform.
          </p>

          {/* CTA Buttons */}
          <div className="nx-cta-row">

            <button
              onClick={onSignupClick}
              className="nx-btn-primary"
            >
              Start Free Trial — 14 Days Free
            </button>

            <button
              onClick={onDemoClick}
              className="nx-btn-ghost"
            >
              Book Demo →
            </button>

          </div>

          {/* Fine Print */}
          <p className="nx-cta-fine">
            ✓ No Credit Card
            &nbsp;·&nbsp;
            ✓ 2-Minute Setup
            &nbsp;·&nbsp;
            ✓ Cancel Anytime
          </p>

        </div>

      </div>
    </section>
  )
}