'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function HomePage() {
  const router = useRouter()
  const [status, setStatus] = useState('Initializing...')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // ✅ D: Prefetch likely routes for instant navigation
    router.prefetch('/chat')
    router.prefetch('/onboarding')
    router.prefetch('/login')

    const initializeApp = async () => {
      try {
        // ── Step 1: Token existence check ──────────────
        setStatus('Checking authentication...')
        setProgress(25)

        const token = localStorage.getItem('token')
        if (!token) {
          setStatus('Redirecting to login...')
          setProgress(100)
          router.replace('/login')
          return
        }

        // ── Step 2: Verify token with backend ──────────
        // ✅ B: Real token validation — no artificial delay
        setStatus('Verifying session...')
        setProgress(50)

        try {
          await api.get('/auth/verify')
        } catch (authErr: any) {
          // ✅ B: Token expired या invalid — clear और redirect
          const status = authErr?.response?.status
          if (status === 401 || status === 403) {
            localStorage.removeItem('token')
            localStorage.removeItem('company_id')
            localStorage.removeItem('whatsapp_connected')
            setStatus('Session expired. Redirecting...')
            setProgress(100)
            router.replace('/login')
            return
          }
          // Network error — token अभी भी valid मान लो
          console.warn('Auth verify failed (network?), proceeding with local state')
        }

        // ── Step 3: Onboarding status ──────────────────
        // ✅ A: Real onboarding status from backend
        setStatus('Loading your workspace...')
        setProgress(75)

        let whatsappConnected = localStorage.getItem('whatsapp_connected') === 'true'
        let companyId = localStorage.getItem('company_id')

        try {
          const { data } = await api.get('/auth/status')
          // Backend से fresh status लो
          whatsappConnected = data.whatsapp_connected ?? whatsappConnected
          companyId = data.company_id ? String(data.company_id) : companyId

          // ✅ Local storage को sync करें
          if (data.company_id) localStorage.setItem('company_id', String(data.company_id))
          if (data.whatsapp_connected !== undefined)
            localStorage.setItem('whatsapp_connected', String(data.whatsapp_connected))
        } catch (statusErr) {
          // Network error — local state से चलाते हैं
          console.warn('Status check failed, using local state')
        }

        // ── Step 4: Route decision ─────────────────────
        setStatus('Almost there...')
        setProgress(90)

        if (!companyId) {
          localStorage.removeItem('token')
          setProgress(100)
          router.replace('/signup')
          return
        }

        setProgress(100)

        if (whatsappConnected) {
          router.replace('/chat')
        } else {
          router.replace('/onboarding')
        }

      } catch (error) {
        console.error('Home routing error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('company_id')
        localStorage.removeItem('whatsapp_connected')
        router.replace('/login')
      }
    }

    initializeApp()
  }, [router])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0f0d', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,168,132,0.1) 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.05) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#00a884 1px, transparent 1px), linear-gradient(90deg, #00a884 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo with pulse ring */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: 'rgba(0,168,132,0.4)', animationDuration: '2s' }} />
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-white text-3xl relative"
            style={{
              background: 'linear-gradient(135deg, #00a884 0%, #25d366 100%)',
              boxShadow: '0 0 60px rgba(0,168,132,0.35)'
            }}
          >
            N
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-black text-white tracking-tight mb-1">NexusAI</h1>
        <p className="text-sm font-medium mb-12" style={{ color: '#00a884' }}>for StallionAgro</p>

        {/* Progress bar */}
        <div className="w-64 mb-5">
          <div className="w-full h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00a884, #25d366)',
                boxShadow: '0 0 10px rgba(0,168,132,0.6)'
              }}
            />
          </div>
        </div>

        {/* Status */}
        <p className="text-sm tracking-wide transition-all duration-300"
          style={{ color: 'rgba(134,150,160,0.8)' }}>
          {status}
        </p>

        {/* Animated dots */}
        <div className="flex gap-1.5 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#00a884',
                animation: 'dotPulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 text-xs tracking-widest uppercase"
        style={{ color: 'rgba(134,150,160,0.25)' }}>
        Real-time Agricultural Commerce
      </p>

      {/* ✅ C: Font import layout.tsx में होना चाहिए — यहाँ नहीं */}
    </div>
  )
}