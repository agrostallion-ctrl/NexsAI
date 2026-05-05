'use client'

import { useReveal } from '../../hooks/useReveal'
import { FEATURES } from '../../data/features'

export default function Features() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="features"
      className="nx-section"
    >
      {/* ========================= */}
      {/* SECTION HEADER */}
      {/* ========================= */}
      <div className="nx-container">

        <div className="nx-section-head">
          <span className="nx-label">
            Features
          </span>

          <h2 className="nx-h2">
            Sab kuch jo aapko chahiye
            <br />
            WhatsApp pe sell karne ke liye
          </h2>

          <p className="nx-section-sub">
            Broadcast automation, team inbox,
            customer management, and powerful
            sales workflows — all in one
            enterprise dashboard.
          </p>
        </div>

        {/* ========================= */}
        {/* FEATURES GRID */}
        {/* ========================= */}
        <div
          ref={ref}
          className={`nx-features-grid nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="nx-feat-card"
            >
              {/* Icon */}
              <div
                className="nx-feat-icon"
                style={{
                  background: `${feature.accent}15`,
                  border: `1px solid ${feature.accent}25`
                }}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}