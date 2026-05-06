'use client'

import { useReveal } from '../../hooks/useReveal'
import { TESTIMONIALS } from '../../data/testimonials'

export default function Testimonials() {
  const { ref, visible } = useReveal()

  return (
    <section className="nx-section">
      <div className="nx-container">

        {/* ========================= */}
        {/* SECTION HEADER */}
        {/* ========================= */}
        <div className="nx-section-head">
          <span className="nx-label">
            Customer Love
          </span>

          <h2 className="nx-h2">
            Agro businesses love 360NexusAI
          </h2>

          <p className="nx-section-sub">
            Real agricultural businesses are
            growing faster with WhatsApp
            automation, team inboxes, and
            smarter customer communication.
          </p>
        </div>

        {/* ========================= */}
        {/* TESTIMONIAL GRID */}
        {/* ========================= */}
        <div
          ref={ref}
          className={`nx-testi-grid nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {TESTIMONIALS.map(
            (testimonial) => (
              <div
                key={testimonial.name}
                className="nx-testi-card"
              >
                {/* Rating */}
                <div className="nx-stars">
                  ★★★★★
                </div>

                {/* Quote */}
                <blockquote className="nx-testi-quote">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="nx-testi-author">

                  {/* Avatar */}
                  <div
                    className="nx-avatar"
                    style={{
                      background:
                        testimonial.color
                    }}
                  >
                    {
                      testimonial.initials
                    }
                  </div>

                  {/* Identity */}
                  <div>
                    <div className="nx-testi-name">
                      {testimonial.name}
                    </div>

                    <div className="nx-testi-role">
                      {testimonial.role}
                    </div>
                  </div>

                </div>
              </div>
            )
          )}
        </div>

      </div>
    </section>
  )
}