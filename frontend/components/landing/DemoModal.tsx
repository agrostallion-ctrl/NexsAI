'use client'

import { useState, useEffect } from 'react'

// =========================
// 🏷️ BRANDING
// =========================
const BRAND_NAME = 'Pangea'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  // =========================
  // 🧠 STATE
  // =========================
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    business: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // =========================
  // 🛡️ BODY SCROLL LOCK
  // =========================
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  if (!open) return null

  // =========================
  // ✍️ HANDLERS
  // =========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic Validation: Phone number check
    if (formData.phone.replace(/\D/g, '').length < 10) {
      alert("Kripya sahi 10-digit WhatsApp number dalein.")
      return
    }

    setLoading(true)
    try {
      // 📡 Yahan aapka API Call aayega (e.g., FastAPI/Django backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nx-modal-overlay" onClick={() => !loading && onClose()}>
      <div className="nx-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          className="nx-modal-close" 
          onClick={onClose} 
          disabled={loading}
          aria-label="Close modal"
        >✕</button>

        {submitted ? (
          /* SUCCESS UI */
          <div className="nx-success-container" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 className="nx-modal-title">Demo Scheduled!</h2>
            <p className="nx-modal-sub">
              Hamari team agle 24 ghante mein <b>{formData.phone}</b> par contact karegi.
            </p>
            <button onClick={onClose} className="nx-btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          /* FORM UI */
          <>
            <div className="nx-modal-logo">{BRAND_NAME}<span>AI</span></div>
            <h2 className="nx-modal-title">Book Your Demo</h2>
            <p className="nx-modal-sub">Personalized 30-minute walkthrough apne business ke liye.</p>

            <form onSubmit={handleSubmit} className="nx-modal-form">
              <div className="nx-field">
                <label>Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Ramesh Patel" 
                  required 
                />
              </div>

              <div className="nx-field">
                <label>WhatsApp Number</label>
                <input 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+91 98765 43210" 
                  required 
                />
              </div>

              <div className="nx-field">
                <label>Business Name</label>
                <input 
                  name="business" 
                  type="text" 
                  value={formData.business} 
                  onChange={handleChange} 
                  placeholder="Patel Agro Supplies" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="nx-btn-primary" 
                style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Booking...' : 'Book Demo →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}