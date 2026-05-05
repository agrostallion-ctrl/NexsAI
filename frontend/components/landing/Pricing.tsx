'use client'

import Link from 'next/link'
import { useReveal } from '../../hooks/useReveal'
import { PLANS } from '../../data/pricing'



export default function Pricing() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="pricing"
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
            Pricing
          </span>

          <h2 className="nx-h2">
            Transparent Pricing
          </h2>

          <p className="nx-section-sub">
            Koi hidden charges nahi.
            Kabhi bhi cancel karo.
            Flexible plans for every
            business size.
          </p>
        </div>

        {/* ========================= */}
        {/* PRICING GRID */}
        {/* ========================= */}
        <div
          ref={ref}
          className={`nx-pricing-grid nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`nx-plan${
                plan.featured
                  ? ' nx-plan--featured'
                  : ''
              }`}
            >
              {/* Featured Tag */}
              {plan.featured && (
                <div className="nx-popular-tag">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="nx-plan-name">
                {plan.name}
              </div>

              {/* Price */}
              <div className="nx-plan-price">
                {plan.price}
                <span>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <div className="nx-plan-desc">
                {plan.desc}
              </div>

              {/* Divider */}
              <div className="nx-plan-divider" />

              {/* Features */}
              <ul className="nx-plan-features">
                {plan.features.map(
                  (feature) => (
                    <li key={feature}>
                      {feature}
                    </li>
                  )
                )}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`nx-plan-cta${
                  plan.featured
                    ? ' nx-plan-cta--filled'
                    : ' nx-plan-cta--outline'
                }`}
              >
                {plan.cta}
              </Link>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}