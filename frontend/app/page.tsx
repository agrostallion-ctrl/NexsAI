'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useAuthRedirect } from '../hooks/useAuthRedirect'

import Hero from '../components/landing/Hero'
import Stats from '../components/landing/Stats'
import Features from '../components/landing/Features'
import Steps from '../components/landing/Steps'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import Faq from '../components/landing/Faq'
import CTA from '../components/landing/CTA'
import SignupModal from '../components/landing/SignupModal'
import DemoModal from '../components/landing/DemoModal'


// =========================
// 🧭 NAVBAR
// =========================
function Navbar({
  onSignupClick
}: {
  onSignupClick: () => void
}) {
  return (
    <nav className="nx-nav">
      <div className="nx-nav-container">

        {/* Logo */}
        <Link href="/" className="nx-logo">
          Nexus<span>AI</span>
        </Link>

        {/* Nav Links */}
        <ul className="nx-nav-links">
          <li>
            <a href="#features">
              Features
            </a>
          </li>

          <li>
            <a href="#pricing">
              Pricing
            </a>
          </li>

          <li>
            <a href="#faq">
              FAQ
            </a>
          </li>

          <li>
            <Link
              href="/login"
              className="nx-nav-plain"
            >
              Sign In
            </Link>
          </li>

          <li>
            <button
              onClick={onSignupClick}
              className="nx-nav-cta"
            >
              Free Trial
            </button>
          </li>
        </ul>

      </div>
    </nav>
  )
}

// =========================
// 🦶 FOOTER
// =========================
function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        ['Features', '#features'],
        ['Pricing', '#pricing'],
        ['Integrations', '/onboarding'],
        ['Demo', '/demo']
      ]
    },
    {
      title: 'Company',
      links: [
        ['About', '/about'],
        ['Contact', '/contact'],
        ['Support', '/support']
      ]
    },
    {
      title: 'Legal',
      links: [
        ['Privacy Policy', '/privacy'],
        ['Terms of Service', '/terms']
      ]
    }
  ]

  return (
    <footer className="nx-footer">

      {/* Top */}
      <div className="nx-footer-top">

        {/* Brand */}
        <div className="nx-footer-brand">
          <div className="nx-logo">
            Nexus<span>AI</span>
          </div>

          <p>
            AI-powered WhatsApp commerce
            platform for modern businesses.
          </p>
        </div>

        {/* Footer Columns */}
        {footerSections.map((section) => (
          <div
            key={section.title}
            className="nx-footer-col"
          >
            <h4>{section.title}</h4>

            <ul>
              {section.links.map(
                ([label, href]) => (
                  <li key={label}>
                    <Link href={href}>
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom */}
      <div className="nx-footer-bottom">
        <p>
          © 2026 360NexusAI · All rights
          reserved.
        </p>

        <p>
          Built for scalable WhatsApp
          automation.
        </p>
      </div>

    </footer>
  )
}

// =========================
// 🚀 MAIN LANDING PAGE
// =========================
export default function LandingPage() {
  // 🔐 Redirect authenticated users
  useAuthRedirect()

  // =========================
  // 🪟 MODAL STATES
  // =========================
  const [signupOpen, setSignupOpen] =
    useState(false)

  const [demoOpen, setDemoOpen] =
    useState(false)

  return (
    <div className="nx-root">

      {/* NAVBAR */}
      <Navbar
        onSignupClick={() =>
          setSignupOpen(true)
        }
      />

      {/* MAIN */}
      <main>

        {/* HERO */}
        <Hero
          onSignupClick={() =>
            setSignupOpen(true)
          }
          onDemoClick={() =>
            setDemoOpen(true)
          }
        />

        {/* STATS */}
        <Stats />

        {/* FEATURES */}
        <Features />

        {/* STEPS */}
        <Steps />

        {/* TESTIMONIALS */}
        <Testimonials />

        <Pricing />

        {/* CTA */}
        <CTA
          onSignupClick={() =>
            setSignupOpen(true)
          }
          onDemoClick={() =>
            setDemoOpen(true)
          }
        />

        {/* FAQ */}
        <Faq />

      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <SignupModal
        open={signupOpen}
        onClose={() =>
          setSignupOpen(false)
        }
      />

      <DemoModal
        open={demoOpen}
        onClose={() =>
          setDemoOpen(false)
        }
      />

    </div>
  )
}