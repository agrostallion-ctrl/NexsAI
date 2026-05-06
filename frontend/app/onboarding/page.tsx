'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    fbAsyncInit: () => void
    FB: any
  }
}

interface WabaOption {
  id: string
  name: string
  phone_numbers: {
    id: string
    display_phone_number: string
  }[]
}

export default function OnboardingPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sdkLoaded, setSdkLoaded] = useState(false)

  const [wabaOptions, setWabaOptions] = useState<WabaOption[]>([])
  const [selectedWaba, setSelectedWaba] = useState('')
  const [selectedPhone, setSelectedPhone] = useState('')

  const [tempAccessToken, setTempAccessToken] = useState('')
  const [tempBusinessId, setTempBusinessId] = useState('')

  // Railway backend aur Meta App ID
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-backend.up.railway.app'
  const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID

  // 1. Initialize Meta SDK
  useEffect(() => {
    if (!META_APP_ID) {
      setError('Meta App ID is missing in environment variables.')
      return
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: META_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v22.0' 
      })
      setSdkLoaded(true)
    }

    ;(function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      const js = d.createElement(s) as HTMLScriptElement
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode?.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }, [META_APP_ID])

  // 2. Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/login')
  }, [router])

  // 3. Trigger Meta Login & Fetch Data
  const handleMetaLogin = () => {
    if (!sdkLoaded) return setError('Meta SDK still loading...')

    setLoading(true)
    setError('')

    window.FB.login(
      async (response: any) => {
        if (!response.authResponse) {
          setLoading(false)
          return setError('Meta login cancelled.')
        }

        try {
          const accessToken = response.authResponse.accessToken
          setTempAccessToken(accessToken)

          // Fetch Business Accounts
          const bizRes = await axios.get('https://graph.facebook.com/v22.0/me/businesses', {
            params: { access_token: accessToken }
          })

          const businessId = bizRes.data.data?.[0]?.id
          if (!businessId) throw new Error('No Meta Business found. Please create one first.')
          setTempBusinessId(businessId)

          // Fetch WABA & Phone Numbers
          const wabaRes = await axios.get(`https://graph.facebook.com/v22.0/${businessId}/owned_whatsapp_business_accounts`, {
            params: {
              access_token: accessToken,
              fields: 'id,name,phone_numbers{id,display_phone_number}'
            }
          })

          const accounts = wabaRes.data.data || []
          if (!accounts.length) throw new Error('No WhatsApp Business Accounts found.')

          setWabaOptions(accounts)

          // Auto-select if only one exists
          if (accounts.length === 1) {
            setSelectedWaba(accounts[0].id)
            if (accounts[0].phone_numbers?.length === 1) {
              setSelectedPhone(accounts[0].phone_numbers[0].id)
            }
          }

        } catch (err: any) {
          setError(err.message || 'Meta onboarding failed.')
        } finally {
          setLoading(false)
        }
      },
      {
        scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging',
        extras: { feature: 'whatsapp_embedded_signup', setup: {} }
      }
    )
  }

  // 4. Final Save to Database
  const handleFinalSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    setLoading(true)
    setError('')

    try {
      await axios.post(
        `${API_URL}/whatsapp/save-credentials`,
        {
          access_token: tempAccessToken,
          whatsapp_business_account_id: selectedWaba,
          phone_number_id: selectedPhone,
          meta_business_id: tempBusinessId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      router.push('/chat') // Redirect to main dashboard
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save settings.')
    } finally {
      setLoading(false)
    }
  }

  const currentWaba = wabaOptions.find(w => w.id === selectedWaba)

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 font-sans">
      <div className="w-full max-w-xl p-10 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl space-y-8 transition-all">
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            WhatsApp Onboarding
          </h1>
          <p className="text-zinc-400">Connect your business to the 360NexusAI engine.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {wabaOptions.length === 0 ? (
          <button
            onClick={handleMetaLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-green-900/20"
          >
            {loading ? 'Opening Meta Setup...' : 'Continue with Meta'}
          </button>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Business Account</label>
              <select
                value={selectedWaba}
                onChange={(e) => {
                  setSelectedWaba(e.target.value)
                  const found = wabaOptions.find(w => w.id === e.target.value)
                  if (found?.phone_numbers?.length) setSelectedPhone(found.phone_numbers[0].id)
                }}
                className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500 transition-colors"
              >
                <option value="">Select Account</option>
                {wabaOptions.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
            </div>

            {selectedWaba && (
              <div>
                <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                <select
                  value={selectedPhone}
                  onChange={(e) => setSelectedPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500 transition-colors"
                >
                  {currentWaba?.phone_numbers.map(p => (
                    <option key={p.id} value={p.id}>{p.display_phone_number}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleFinalSave}
              disabled={loading || !selectedWaba || !selectedPhone}
              className="w-full bg-white text-black hover:bg-zinc-200 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving Configuration...' : 'Complete Activation'}
            </button>
          </div>
        )}

        <div className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
          Secure Meta Integration • Cloud Infrastructure Ready
        </div>
      </div>
    </div>
  )
}