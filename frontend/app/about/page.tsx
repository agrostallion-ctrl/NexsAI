export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Businesses Supported" },
    { value: "10K+", label: "Messages Managed Daily" },
    { value: "99.9%", label: "Platform Uptime" },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Business Automation",
      text: "Automate customer conversations, follow-ups, support workflows, and repetitive communication tasks from one simple platform.",
    },
    {
      icon: "💬",
      title: "WhatsApp Communication",
      text: "Manage WhatsApp conversations, customer replies, notifications, and support messages with faster response handling.",
    },
    {
      icon: "📊",
      title: "CRM & Lead Management",
      text: "Organize leads, track customer interactions, assign conversations, and improve your sales and support process.",
    },
  ];

  const values = [
    {
      title: "Simple to Use",
      text: "Built for businesses that want powerful automation without complex technical setup.",
    },
    {
      title: "Made for Growth",
      text: "360NexusAI helps startups, retailers, agencies, service providers, and enterprises scale communication easily.",
    },
    {
      title: "Customer Focused",
      text: "Our platform helps businesses respond faster, manage customers better, and improve customer experience.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020807] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.14),transparent_42%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              About Us
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Helping Businesses Grow with{" "}
              <span className="text-emerald-400">Smart Automation</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
              360NexusAI is an AI-powered SaaS platform designed to help
              businesses manage customer communication, WhatsApp messaging, CRM
              workflows, lead management, and support operations from one
              unified dashboard.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center shadow-xl"
              >
                <p className="text-4xl font-black text-emerald-400 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#071410] p-8 shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🎯
              </div>

              <h2 className="text-3xl font-black text-white">Our Mission</h2>

              <p className="mt-5 text-base leading-8 text-gray-400">
                Our mission is to make business communication faster, smarter,
                and more organized. We help businesses reduce manual work,
                improve response speed, and build better customer relationships
                through intelligent automation.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#071410] p-8 shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🚀
              </div>

              <h2 className="text-3xl font-black text-white">What We Build</h2>

              <p className="mt-5 text-base leading-8 text-gray-400">
                We build tools for WhatsApp automation, CRM management,
                customer support, lead tracking, multi-agent inbox, analytics,
                and workflow automation — designed for modern businesses of all
                sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#05110d] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Platform Focus
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Built for Every Business
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-400">
              Whether you run a startup, retail store, service business,
              agency, distribution network, or enterprise team, 360NexusAI helps
              you manage customer communication efficiently.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#071410] p-7 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500/30"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white">{item.title}</h3>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
                Why Choose Us
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Designed to make business communication simple
              </h2>

              <p className="mt-5 text-base leading-8 text-gray-400">
                360NexusAI gives businesses the tools they need to communicate
                faster, manage customers better, and automate important
                workflows without complicated setup.
              </p>
            </div>

            <div className="space-y-5">
              {values.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-[#071410] p-6 shadow-xl"
                >
                  <div className="flex gap-5">
                    <div className="text-4xl font-black text-emerald-500/40">
                      0{index + 1}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-base leading-7 text-gray-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center shadow-2xl sm:p-12">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
            Get Started Today
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Ready to automate your business communication?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-300">
            Start using 360NexusAI to manage leads, improve customer support,
            automate conversations, and grow your business communication from
            one platform.
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
              className="rounded-full border border-white/10 bg-black/30 px-7 py-3 text-sm font-bold text-white transition hover:border-emerald-500/40"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}