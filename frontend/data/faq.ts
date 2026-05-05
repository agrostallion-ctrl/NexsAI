export interface FaqItem {
  q: string
  a: string
}

export const FAQ_DATA: FaqItem[] = [
  {
    q: 'Does Pangea use the official WhatsApp Business API?',
    a: 'Yes, Pangea operates exclusively on the official WhatsApp Business API. Our team provides step-by-step assistance during the onboarding process to ensure your account is set up correctly.'
  },
  {
    q: 'What is included in the free trial?',
    a: 'We offer a 14-day free trial that includes all core premium features from our Growth plan. No credit card is required to start your trial.'
  },
  {
    q: 'How many agents can use the platform simultaneously?',
    a: 'All our plans come with multi-agent support, allowing your entire team to collaborate effectively through a centralized shared inbox.'
  },
  {
    q: 'Can I integrate Pangea with my existing business tools?',
    a: 'Absolutely. Pangea supports native integrations with Zoho, HubSpot, Google Sheets, and over 20+ popular business tools. We also provide custom webhooks for advanced workflows.'
  },
  {
    q: 'What kind of support can I expect?',
    a: 'Growth and Enterprise plan users receive priority WhatsApp and email support, featuring dedicated assistance and faster response times to keep your business running smoothly.'
  },
]