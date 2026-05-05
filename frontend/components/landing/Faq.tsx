'use client'

import { useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { FAQ_DATA } from '../../data/faq'

export default function Faq() {
  const [openIdx, setOpenIdx] =
    useState<number | null>(null)

  const { ref, visible } = useReveal()

  return (
    <section
      id="faq"
      className="nx-section"
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
            FAQ
          </span>

          <h2 className="nx-h2">
            Aapke Sawaalon ke Jawab
          </h2>

          <p className="nx-section-sub">
            Pricing, setup, onboarding,
            WhatsApp integration aur
            business scaling se jude
            important answers.
          </p>
        </div>

        {/* ========================= */}
        {/* FAQ LIST */}
        {/* ========================= */}
        <div
          ref={ref}
          className={`nx-faq-list nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {FAQ_DATA.map((item, index) => (
              <div
                key={index}
                className={`nx-faq-item${
                  openIdx === index
                    ? ' nx-faq-item--open'
                    : ''
                }`}
              >
                {/* Question */}
                <button
                  className="nx-faq-q"
                  onClick={() =>
                    setOpenIdx(
                      openIdx === index
                        ? null
                        : index
                    )
                  }
                >
                  {item.q}

                  <span className="nx-faq-icon">
                    {openIdx === index
                      ? '−'
                      : '+'}
                  </span>
                </button>

                {/* Answer */}
                {openIdx === index && (
                  <div className="nx-faq-a">
                    {item.a}
                  </div>
                )}

              </div>
            )
          )}
        </div>

      </div>
    </section>
  )
}