export default function SupportPage() {
  const supportCards = [
    {
      icon: "✉️",
      title: "Support Email",
      description:
        "Contact us for technical issues, account access, integrations, billing questions, or platform guidance.",
      action: "support@360nexusai.com",
      href: "mailto:support@360nexusai.com",
    },
    {
      icon: "📞",
      title: "Phone Support",
      description:
        "Speak directly with our support team for urgent assistance and product-related questions.",
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
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.13),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Support
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              We&apos;re Here to{" "}
              <span className="text-emerald-400">Help You</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
              Need help with 360NexusAI? Our support team can assist you with
              technical issues, account setup, WhatsApp integration, CRM
              workflows, billing, and platform guidance.
            </p>
          </div>

          {/* Support Cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {supportCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-[#071410] p-7 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500/30 sm:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
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

          {/* Help Topics */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
            <div className="text-center">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
                Help Topics
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                What We Can Help With
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-400">
                Our team can guide you across setup, integrations, automation
                workflows, and day-to-day platform usage.
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
          </div>

          {/* Response Note */}
          <div className="mt-12 flex justify-center">
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