'use client'

import { useReveal } from '../../hooks/useReveal'

const STATS = [
  {
    value: '500+',
    label: 'Agro Businesses Onboarded'
  },
  {
    value: '10K+',
    label: 'Messages Delivered Daily'
  },
  {
    value: '99.9%',
    label: 'Platform Uptime SLA'
  },
  {
    value: '<1s',
    label: 'Average Message Delivery'
  },
]

export default function Stats() {
  const { ref, visible } = useReveal()

  return (
    <section className="nx-stats-section">
      <div className="nx-container">

        <div
          ref={ref}
          className={`nx-stats-bar nx-reveal${
            visible ? ' nx-visible' : ''
          }`}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="nx-stats-item"
            >
              <div className="nx-stats-val">
                {stat.value}
              </div>

              <div className="nx-stats-lbl">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}