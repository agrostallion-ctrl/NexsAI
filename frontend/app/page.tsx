'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // =========================
        // 🔐 AUTH CHECK
        // =========================
        const token = localStorage.getItem('token')

        if (!token) {
          router.replace('/login')
          return
        }

        // =========================
        // 🏢 ONBOARDING STATUS
        // =========================
        const whatsappConnected =
          localStorage.getItem('whatsapp_connected')

        const companyId =
          localStorage.getItem('company_id')

        // =========================
        // 🚀 ROUTING LOGIC
        // =========================
        if (!companyId) {
          // Invalid auth state
          localStorage.removeItem('token')
          router.replace('/signup')
          return
        }

        if (whatsappConnected === 'true') {
          // Fully onboarded SaaS user
          router.replace('/chat')
          return
        }

        // Token valid but onboarding incomplete
        router.replace('/onboarding')

      } catch (error) {
        console.error(
          'Home routing error:',
          error
        )

        // Safe fallback
        localStorage.removeItem('token')
        localStorage.removeItem('company_id')
        localStorage.removeItem(
          'whatsapp_connected'
        )

        router.replace('/login')

      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [router])

  // =========================
  // 🎨 LOADING SCREEN
  // =========================
  if (!loading) return null

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">

      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          NexusAI
        </h1>

        <p className="text-zinc-500 text-sm mt-2">
          Initializing your business inbox...
        </p>
      </div>

      {/* Spinner */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-zinc-800"></div>

        <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-blue-500 animate-spin"></div>
      </div>

    </div>
  )
}