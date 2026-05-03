'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// TypeScript window object definition for Facebook SDK
declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [connected, setConnected] = useState(false)

  // Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'
  const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID || 'YOUR_META_APP_ID'

  // 1. Initialize Facebook SDK on Component Mount
  useEffect(() => {
    const loadSDK = () => {
      if (document.getElementById('facebook-jssdk')) return
      
      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: META_APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v20.0'
          })
        }
      }
      document.body.appendChild(script)
    }
    loadSDK()
  }, [META_APP_ID])

  // 2. Trigger WhatsApp Embedded Signup
  const handleWhatsAppSignup = () => {
    setLoading(true)
    setError('')
    
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Session expired. Please login again.')
      router.push('/login')
      return
    }

    window.FB.login(
      async (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken
          
          try {
            // Send token to backend. Backend will fetch WABA_ID and Phone_ID
            const saveResponse = await axios.post(
              `${API_BASE_URL}/whatsapp/save-credentials`,
              { access_token: accessToken },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            )

            if (saveResponse.data.status === 'success') {
              setConnected(true)
              setSuccess('WhatsApp Business account linked successfully!')
              setTimeout(() => router.push('/dashboard'), 2000)
            }
          } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to link WhatsApp account.')
          }
        } else {
          setError('Meta onboarding was cancelled or failed.')
        }
        setLoading(false)
      },
      {
        // Required scopes for WhatsApp Management
        scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging',
        // Mandatory for Embedded Signup Flow
        extras: {
          feature: 'whatsapp_embedded_signup',
          setup: {} 
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-3xl p-10 shadow-2xl space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-green-500/10 rounded-full mb-2">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408.001 12.045a11.811 11.811 0 001.591 5.976L0 24l6.147-1.612a11.771 11.771 0 005.9 1.558h.005c6.634 0 12.043-5.409 12.046-12.046a11.83 11.83 0 00-3.486-8.508z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Activation</h1>
          <p className="text-gray-400">Connect your business account to start messaging.</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-900 text-green-400 p-4 rounded-xl text-center text-sm">
            {success}
          </div>
        )}

        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <p className="text-sm text-gray-300">Click the button below to sign in with your Facebook Business account.</p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <p className="text-sm text-gray-300">Select the WhatsApp Business Account (WABA) you want to link to StallionAgro.</p>
          </div>
        </div>

        <button
          onClick={handleWhatsAppSignup}
          disabled={loading || connected}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Launching Meta...
            </>
          ) : connected ? (
            'Connected successfully ✅'
          ) : (
            'Continue with Facebook'
          )}
        </button>
      </div>
    </div>
  )
}