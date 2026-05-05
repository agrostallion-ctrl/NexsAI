export interface Feature {
  icon: string
  title: string
  desc: string
  accent: string
}

export const FEATURES: Feature[] = [
  {
    icon: '📢',
    title: 'Bulk Broadcast',
    accent: '#00a884',
    desc:
      'Send promotions, updates, and announcements to thousands of customers with a single click, complete with real-time delivery insights.'
  },
  {
    icon: '🤖',
    title: 'AI Auto-Reply',
    accent: '#25d366',
    desc:
      'Provide instant 24/7 responses to common customer queries. Ensure faster support and better engagement with zero missed opportunities.'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    accent: '#00a884',
    desc:
      'Monitor delivery rates, open rates, customer engagement, and sales conversions through a centralized, intuitive dashboard.'
  },
  {
    icon: '🔗',
    title: 'CRM Integration',
    accent: '#25d366',
    desc:
      'Seamlessly integrate with Zoho, HubSpot, Google Sheets, and other business tools for end-to-end workflow automation.'
  },
  {
    icon: '💬',
    title: 'Multi-Agent Inbox',
    accent: '#00a884',
    desc:
      'Empower your entire sales or support team to efficiently manage customer conversations from a single, shared WhatsApp inbox.'
  },
  {
    icon: '🔔',
    title: 'Automated Notifications',
    accent: '#25d366',
    desc:
      'Automatically send order confirmations, appointment reminders, and transactional alerts at scale to keep your customers informed.'
  },
]