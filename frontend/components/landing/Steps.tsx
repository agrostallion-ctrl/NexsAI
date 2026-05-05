'use client'

import { useReveal } from '../../hooks/useReveal'

const STEPS = [
  {
    num: '01',
    title: 'Account Banao',
    desc:
      'Signup karo aur WhatsApp Business number connect karo. Setup sirf 10 minute mein.'
  },
  {
    num: '02',
    title: 'Configure Karo',
    desc:
      'Broadcasts, auto-replies aur team inbox setup karo — no coding required.'
  },
  {
    num: '03',
    title: 'Results Dekho',
    desc:
      'Real-time mein messages deliver hote aur orders aate dekho.'
  },
]

export default function Steps() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="how"
      className="nx-section nx-section--alt"
    >
      <div className="nx-container">

        {/* ========================= */}
        {/* SECTION HEADER */}
        {/* ========================= */}
        <div
          className="nx-section-head"
          style={{ textAlign: 'center' }}
        >
          <span className="nx-label">
            Simple Process
          </span>

          <h2 className="nx-h2">
            3 Steps mein Start Karo
          </h2>

          <p className="nx-section-sub">
            Fast onboarding, zero technical
            setup, and enterprise-grade
            WhatsApp automation from day one.
          </p>
        </div>

        {/* ========================= */}
        {/* STEPS GRID */}
        {/* ========================= */}
        <div
          ref={ref}
          className={`nx-steps nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {STEPS.map((step, index) => (
            <div
              key={step.num}
              className="nx-step"
            >
              {/* Step Number */}
              <div className="nx-step-num">
                {step.num}
              </div>

              {/* Title */}
              <h3>
                {step.title}
              </h3>

              {/* Description */}
              <p>
                {step.desc}
              </p>

              {/* Arrow */}
              {index < STEPS.length - 1 && (
                <div className="nx-step-arrow">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}