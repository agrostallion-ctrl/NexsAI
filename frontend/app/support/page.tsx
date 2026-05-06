export default function SupportPage() {
  const supportCards = [
    {
      icon: "✉️",
      title: "Email Support",
      description:
        "For technical issues, account access, integrations, billing, and platform-related questions.",
      action: "support@360nexusai.com",
      href: "mailto:support@360nexusai.com",
    },
    {
      icon: "📞",
      title: "Phone Support",
      description:
        "Speak with our team for urgent assistance, product guidance, and onboarding support.",
      action: "+91 78809 00423",
      href: "tel:+917880900423",
    },
  ];

  const helpTopics = [
    "Account setup",
    "WhatsApp integration",
    "CRM workflow guidance",
    "Billing and plans",
    "Technical troubleshooting",
    "Platform onboarding",
  ];

  return (
    <main className="min-h-screen bg-[#020807] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.13),transparent_42%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
              Support
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Support for Your{" "}
              <span className="text-emerald-400">Business Automation</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-400">
              Need help with 360NexusAI? Our team can assist you with account
              setup, WhatsApp integration, CRM workflows, billing, and technical
              support.
            </p>
          </div>

          {/* Support Cards */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
            {supportCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-[#071410] p-7 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500/30"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl">
                  {card.icon}
                </div>

                <h2 className="text-2xl font-bold text-white">{card.title}</h2>

                <p className="mt-4 text-base leading-8 text-gray-400">
                  {card.description}
                </p>

                <a
                  href={card.href}
                  className="mt-6 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  {card.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
              Help Topics
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              What We Can Help With
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400">
              We help businesses with setup, integrations, automation
              workflows, support operations, and day-to-day platform usage.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic) => (
              <div
                key={topic}
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm font-semibold text-gray-300"
              >
                <span className="mr-2 text-emerald-400">✓</span>
                {topic}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              We usually respond within 24 hours.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}