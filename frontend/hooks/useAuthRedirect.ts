'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// =========================
// 🗝️ KEYS (Centralized)
// =========================
const AUTH_KEYS = {
  TOKEN: 'token',
  COMPANY_ID: 'company_id',
  WHATSAPP: 'whatsapp_connected'
} as const

/**
 * useAuthRedirect:
 * Authenticated users ko landing/login page se
 * unke status ke hisab se sahi route par redirect karta hai.
 */
export function useAuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    // 1. SSR Check (Server-side par execute na ho)
    if (typeof window === 'undefined') return

    // 2. Auth Check
    const token = localStorage.getItem(AUTH_KEYS.TOKEN)
    
    // Agar user logged in nahi hai, toh landing page par rehne do
    if (!token) return

    // 3. Status Extraction
    const companyId = localStorage.getItem(AUTH_KEYS.COMPANY_ID)
    const isWhatsappConnected = localStorage.getItem(AUTH_KEYS.WHATSAPP) === 'true'

    /**
     * 🚀 REDIRECT LOGIC:
     * - Case A: Token hai par Company Setup nahi hai -> Onboarding
     * - Case B: Token hai, Company hai par WhatsApp connect nahi hai -> Onboarding
     * - Case C: Sab set hai -> Chat/Dashboard
     */
    
    if (!companyId || !isWhatsappConnected) {
      router.replace('/onboarding')
    } else {
      router.replace('/chat')
    }

  }, [router])
}