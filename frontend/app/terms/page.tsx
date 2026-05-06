export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Use of Services",
      text: [
        "360NexusAI provides business communication, WhatsApp messaging, customer engagement, lead management, CRM, automation, and related SaaS solutions for business use.",
        "You agree to use the platform only for lawful business purposes and in compliance with applicable laws, regulations, and third-party platform policies.",
      ],
    },
    {
      title: "2. Account Responsibilities",
      text: [
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You agree to provide accurate information, keep your account details updated, and notify us immediately if you suspect unauthorized access or misuse of your account.",
      ],
    },
    {
      title: "3. WhatsApp, Meta, and Third-Party Services",
      text: [
        "360NexusAI may integrate with third-party services such as WhatsApp, Meta, Facebook, hosting providers, analytics tools, payment gateways, and other business software.",
        "Your use of these third-party services is subject to their respective terms, policies, availability, and approval processes.",
      ],
    },
    {
      title: "4. User Consent and Messaging Compliance",
      text: [
        "You are responsible for obtaining all required customer consent, opt-ins, permissions, and lawful basis before sending WhatsApp, SMS, email, or other communication through our platform.",
        "You agree not to send spam, misleading messages, illegal content, abusive communication, or messages that violate Meta, WhatsApp, or applicable communication policies.",
      ],
    },
    {
      title: "5. Prohibited Activities",
      text: [
        "You may not misuse the platform for illegal, fraudulent, abusive, harmful, deceptive, spam, phishing, unauthorized marketing, data scraping, reverse engineering, security attacks, or activities that violate the rights of others.",
      ],
    },
    {
      title: "6. Payments and Subscriptions",
      text: [
        "Some features may be available under paid plans, subscriptions, usage-based pricing, or premium services. Pricing, billing cycles, and plan details will be communicated at the time of purchase or subscription.",
        "Payments may be processed through third-party payment providers. Unless otherwise stated, paid fees are non-refundable, except where required by applicable law or expressly agreed by us in writing.",
      ],
    },
    {
      title: "7. Data and Privacy",
      text: [
        "Your use of 360NexusAI is also governed by our Privacy Policy, which explains how we collect, use, store, share, and protect information.",
        "By using our platform, you agree that you are responsible for collecting and processing your customers’ data lawfully and for responding to customer data requests where applicable.",
      ],
    },
    {
      title: "8. Service Availability",
      text: [
        "We aim to provide reliable and secure services, but we do not guarantee that the platform will always be uninterrupted, error-free, secure, or available at all times.",
        "Service availability may be affected by maintenance, updates, technical issues, internet outages, hosting provider downtime, or third-party platform limitations.",
      ],
    },
    {
      title: "9. Intellectual Property",
      text: [
        "All rights, title, and interest in the 360NexusAI platform, including software, design, branding, content, features, and technology, belong to 360NexusAI or its licensors.",
        "You may not copy, reproduce, modify, distribute, sell, or create derivative works from our platform or content without written permission.",
      ],
    },
    {
      title: "10. Suspension and Termination",
      text: [
        "We reserve the right to suspend or terminate access to the platform if we believe that a user has violated these Terms, applicable laws, platform policies, or has misused the service.",
      ],
    },
    {
      title: "11. Limitation of Liability",
      text: [
        "To the maximum extent permitted by law, 360NexusAI will not be liable for indirect, incidental, special, consequential, punitive, or loss-of-profit damages arising from your use of or inability to use the platform.",
        "We are not responsible for business losses, message delivery failures, customer disputes, third-party service restrictions, or decisions made based on platform outputs or automation.",
      ],
    },
    {
      title: "12. Changes to These Terms",
      text: [
        "We may update these Terms from time to time to reflect changes in our services, business practices, legal requirements, or platform policies.",
        "Updated Terms will be posted on this page with a revised “Last Updated” date. Continued use of the platform after changes means you accept the updated Terms.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#020807] text-white">
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.12),transparent_38%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Legal
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Terms of <span className="text-emerald-400">Service</span>
            </h1>

            <p className="mt-4 text-gray-400">Last Updated: May 2026</p>

            <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left shadow-2xl backdrop-blur">
              <p className="text-base leading-8 text-gray-300 sm:text-lg">
                Welcome to 360NexusAI. These Terms of Service govern your access
                to and use of our website, platform, software, tools, and related
                services.
              </p>

              <p className="mt-4 text-base leading-8 text-gray-300 sm:text-lg">
                By accessing or using 360NexusAI, you agree to comply with these
                Terms. If you do not agree with these Terms, you should not use
                our services.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-white/10 bg-[#071410] p-6 shadow-xl transition hover:border-emerald-500/30 sm:p-8"
              >
                <h2 className="mb-4 flex items-start gap-3 text-2xl font-bold text-white">
                  <span className="mt-1 h-7 w-1.5 rounded-full bg-emerald-400" />
                  {section.title}
                </h2>

                <div className="space-y-4">
                  {section.text.map((item) => (
                    <p
                      key={item}
                      className="text-base leading-8 text-gray-400 sm:text-lg"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-xl sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-white">
                13. Contact Information
              </h2>

              <p className="text-base leading-8 text-gray-300 sm:text-lg">
                For questions regarding these Terms, please contact us:
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-gray-300">
                <p className="font-semibold text-white">360NexusAI</p>
                <p>Website: https://nexs-ai.vercel.app</p>
                <p>Email: support@360nexusai.com</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}