export default function AboutPage() {
  const stats = [
    {
      value: "500+",
      label: "Businesses Supported",
    },
    {
      value: "10K+",
      label: "Messages Managed Daily",
    },
    {
      value: "99.9%",
      label: "Platform Uptime",
    },
  ];

  const highlights = [
    {
      icon: "🎯",
      title: "Our Mission",
      text: "Our mission is to help businesses simplify customer communication, automate repetitive tasks, improve response speed, and build stronger customer relationships through intelligent automation.",
    },
    {
      icon: "📦",
      title: "What We Offer",
      text: "360NexusAI provides WhatsApp automation, CRM tools, AI chatbots, lead management, multi-agent inbox, real-time analytics, and customer support workflows in one unified platform.",
    },
  ];

  const reasons = [
    {
      number: "01",
      title: "Built for Modern Businesses",
      text: "Whether you are a startup, retailer, service provider, agency, distributor, or enterprise, 360NexusAI helps you manage customer conversations and business workflows from one dashboard.",
    },
    {
      number: "02",
      title: "Fast Setup",
      text: "Connect your WhatsApp Business number, manage leads, assign conversations, and start automating customer support without complex technical setup.",
    },
    {
      number: "03",
      title: "Scalable Communication",
      text: "From customer inquiries and follow-ups to order updates and support messages, our platform is designed to scale as your business grows.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020807] text-white">
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.13),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Hero */}
          <div className="text-center">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              About Us
            </div>

            <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              Building the Future of{" "}
              <span className="text-emerald-400">Business Automation</span>
            </h1>

            <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-gray-400 sm:text-lg">
              360NexusAI is an AI-powered SaaS platform designed to help
              businesses automate customer engagement, WhatsApp communication,
              lead management, customer support, and sales workflows from one
              unified system.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-xl"
              >
                <p className="text-4xl font-black text-emerald-400 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Mission / Offer */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#071410] p-7 shadow-xl transition hover:border-emerald-500/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                  {item.icon}
                </div>

                <h2 className="text-2xl font-bold text-white">{item.title}</h2>

                <p className="mt-4 text-base leading-8 text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Why Different */}
          <div className="mt-16">
            <div className="text-center">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
                Why 360NexusAI
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Why Businesses Choose Us
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-400">
                We help businesses manage customer conversations, automate
                routine communication, and improve response efficiency with a
                simple, powerful, and scalable platform.
              </p>
            </div>

            <div className="mt-10 grid gap-5">
              {reasons.map((item) => (
                <div
                  key={item.number}
                  className="rounded-3xl border border-white/10 bg-[#071410] p-6 shadow-xl sm:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="text-5xl font-black text-emerald-500/30">
                      {item.number}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-base leading-8 text-gray-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center shadow-2xl sm:p-12">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Get Started Today
            </div>

            <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Ready to automate your business communication?
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-300">
              Join businesses using 360NexusAI to manage leads, automate
              customer conversations, and improve support operations.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/signup"
                className="rounded-full bg-emerald-400 px-7 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                Start Free Trial →
              </a>

              <a
                href="/contact"
                className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-bold text-white transition hover:border-emerald-500/40"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}