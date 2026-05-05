export interface Plan {
  name: string
  price: string
  period: string
  desc: string
  features: string[]
  cta: string
  href: string
  featured: boolean
}

export const PLANS: Plan[] = [
  {
    name: 'Starter', 
    price: '₹999', 
    period: '/month',
    desc: 'Perfect for small agricultural retailers and local businesses.',
    features: [
      '1 WhatsApp Number', 
      '5,000 Messages/Month', 
      'Basic Auto-Reply', 
      '2 Broadcast Campaigns/Month', 
      'Email Support'
    ],
    cta: 'Get Started', 
    href: '/signup', 
    featured: false,
  },
  {
    name: 'Growth', 
    price: '₹2,999', 
    period: '/month',
    desc: 'Designed for scaling agro-businesses and growing teams.',
    features: [
      '3 WhatsApp Numbers', 
      '50,000 Messages/Month', 
      'Advanced AI Chatbot', 
      'Unlimited Broadcasts', 
      'CRM Integration', 
      '24/7 Priority Support', 
      'Advanced Analytics'
    ],
    cta: 'Start 14-Day Free Trial', 
    href: '/signup', 
    featured: true,
  },
  {
    name: 'Enterprise', 
    price: 'Custom', 
    period: '',
    desc: 'Tailored solutions for large agricultural networks and brands.',
    features: [
      'Unlimited Numbers & Messages', 
      'Custom AI Training', 
      'Dedicated Account Manager', 
      '99.9% Uptime SLA', 
      'On-site Training', 
      'Custom API Integrations'
    ],
    cta: 'Contact Sales', 
    href: '/contact', 
    featured: false,
  },
]