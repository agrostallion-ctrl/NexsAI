// ✅ Fix 5: SEO metadata — server export, no 'use client' needed at module level
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Demo — 360NexusAI',
  description:
    'Dekho 360NexusAI kaise kaam karta hai — AI chatbot, WhatsApp broadcasts, payments aur analytics ek 8-minute walkthrough mein.',
  openGraph: {
    title: '360NexusAI Product Demo',
    description: 'WhatsApp commerce automation ka live walkthrough.',
    url: 'https://360NexusAI.in/demo',
    siteName: '360NexusAI',
    type: 'website',
  },
}

// Client boundary starts here — metadata stays in the server module above
export { default } from './DemoClient'