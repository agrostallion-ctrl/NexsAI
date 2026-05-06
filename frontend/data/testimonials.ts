export interface Testimonial {
  name: string
  role: string
  initials: string
  color: string
  quote: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ramesh Patel',
    role: 'Founder, Patel Retail Solutions',
    initials: 'RP',
    color: '#2e7d32',
    quote:
      '360NexusAI has dramatically improved our customer response time. Orders are now processed significantly faster, and our overall team efficiency has reached new heights.',
  },
  {
    name: 'Sunita Sharma',
    role: 'Operations Manager, GreenField Commerce',
    initials: 'SS',
    color: '#1565c0',
    quote:
      'The broadcast automation feature is exceptional. Daily product updates and promotional campaigns now reach our customers instantly without any manual effort.',
  },
  {
    name: 'Anil Verma',
    role: 'Director, ConnectPro Services',
    initials: 'AV',
    color: '#6a1b9a',
    quote:
      'The setup was extremely fast, and the dashboard is incredibly intuitive. It has completely transformed our WhatsApp communication into a professional sales system.',
  },
]