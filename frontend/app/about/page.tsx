export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ede6] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-px bg-[#3ddc84] inline-block" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#3ddc84] font-medium">
            About us
          </span>
        </div>

        {/* Heading */}
        <h1 className="syne text-5xl font-extrabold leading-tight tracking-tight mb-6">
          Agro businesses ke liye banaya{" "}
          <span className="text-[#3ddc84]">360NexusAI</span>
        </h1>

        <p className="text-lg text-[#a09c94] leading-relaxed font-light max-w-2xl mb-14">
          360NexusAI ek AI-powered SaaS platform hai jo agro businesses ko
          WhatsApp automation, lead generation aur sales workflows ek jagah se
          manage karne mein help karta hai.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-[#1e1e1e] rounded-2xl overflow-hidden mb-16">
          {[
            { num: "500+", label: "Agro businesses" },
            { num: "10K+", label: "Messages / day" },
            { num: "99.9%", label: "Platform uptime" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] px-6 py-7">
              <div className="syne text-4xl font-extrabold text-[#3ddc84] leading-none mb-1">
                {s.num}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#666]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            {
              icon: "🎯",
              title: "Hamara Mission",
              body: "Agro businesses ko cutting-edge AI tools dena jo communication simplify kare, conversions boost kare, aur customer relationships scale kare — bina kisi technical knowledge ke.",
            },
            {
              icon: "📦",
              title: "Kya Offer Karte Hain",
              body: "WhatsApp automation, CRM integrations, AI chatbots aur real-time analytics — sab ek powerful dashboard mein. Farmers aur distributors dono ke liye optimized.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 relative overflow-hidden hover:border-[#2a2a2a] transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#3ddc84] opacity-60" />
              <div className="w-10 h-10 bg-[#0d2416] rounded-xl flex items-center justify-center text-xl mb-5">
                {c.icon}
              </div>
              <h2 className="syne text-lg font-bold mb-3 text-[#f0ede6]">
                {c.title}
              </h2>
              <p className="text-sm text-[#888] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div className="mb-14">
          <h2 className="syne text-2xl font-extrabold mb-6">Hum kyun alag hain</h2>
          {[
            {
              num: "01",
              title: "Agro-first approach",
              body: "Generic SaaS nahi — platform specifically agri businesses ke liye design hua hai. Price broadcasts, mandi updates, seasonal campaigns — sab built-in.",
            },
            {
              num: "02",
              title: "5-minute onboarding",
              body: "Koi coding nahi, koi technical setup nahi. WhatsApp number connect karo aur same din se messages automate karna shuru karo.",
            },
            {
              num: "03",
              title: "Dedicated support",
              body: "24/7 support team jo agro business ki language samjhti hai — peak season mein bhi hamesha available.",
            },
          ].map((v, i, arr) => (
            <div
              key={v.num}
              className={`flex gap-4 py-5 ${i < arr.length - 1 ? "border-b border-[#1a1a1a]" : ""}`}
            >
              <span className="syne text-3xl font-extrabold text-[#1e3a28] min-w-[48px] leading-none pt-1">
                {v.num}
              </span>
              <div>
                <h3 className="text-sm font-medium mb-1 text-[#f0ede6]">{v.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#0d2416] to-[#111] border border-[#1e3a28] rounded-2xl p-12 text-center">
          <h2 className="syne text-3xl font-extrabold mb-3">
            Apna agro business grow karo
          </h2>
          <p className="text-[#888] text-sm mb-8">
            500+ businesses already 360NexusAI use kar rahe hain. Aaj free trial shuru karo.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="bg-[#3ddc84] text-[#0a0a0a] font-medium px-6 py-3 rounded-xl text-sm">
              Start Free Trial — 14 Days Free
            </button>
            <button className="border border-[#333] text-[#f0ede6] px-6 py-3 rounded-xl text-sm">
              Book a Demo →
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}