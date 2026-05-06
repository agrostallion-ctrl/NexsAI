"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", query: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    // apna form submission logic yahan lagao
    alert("Message bhej diya! Hum jald reply karenge. 🙏");
  };

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-[#f0ede6] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .ct-input:focus, .ct-textarea:focus { border-color: #3ddc84; outline: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .pulse-dot { animation: pulse 1.5s infinite; }
      `}</style>

      <div className="max-w-4xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-px bg-[#3ddc84]" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#3ddc84] font-medium">
            Contact us
          </span>
        </div>

        {/* Heading */}
        <h1 className="syne text-5xl font-extrabold leading-tight tracking-tight mb-4">
          Baat karo <span className="text-[#3ddc84]">360NexusAI</span> se
        </h1>
        <p className="text-[#888] text-base font-light leading-relaxed max-w-lg mb-12">
          Questions hain, demo chahiye, ya support? Hum 24 ghante mein reply karte hain.
        </p>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-5 items-start">

          {/* Info Cards */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "✉️", label: "Support Email", value: "support@360nexusai.com", href: "mailto:support@360nexusai.com" },
              { icon: "📱", label: "Phone / WhatsApp", value: "+91 78809 00423", href: "tel:+917880900423" },
              { icon: "📍", label: "Location", value: "India 🇮🇳" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4 hover:border-[#2a2a2a] transition-colors"
              >
                <div className="w-9 h-9 bg-[#0d2416] rounded-xl flex items-center justify-center text-base flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#555] mb-1">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="text-[#3ddc84] text-sm">{c.value}</a>
                  ) : (
                    <div className="text-sm text-[#f0ede6]">{c.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Response time card */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-[#0d2416] rounded-xl flex items-center justify-center text-base flex-shrink-0">🕐</div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#555] mb-1">Response Time</div>
                <div className="text-sm text-[#f0ede6]">Within 24 hours</div>
                <div className="inline-flex items-center gap-1.5 bg-[#0d2416] border border-[#1e3a28] text-[#3ddc84] text-[11px] px-2.5 py-1 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] pulse-dot" />
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8">
            <h2 className="syne text-lg font-bold mb-6 text-[#f0ede6]">Message bhejo</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Aapka naam</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="ct-input w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-3.5 py-3 text-sm text-[#f0ede6] placeholder-[#444] transition-colors"
                  placeholder="Ram Sharma" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Phone / WhatsApp</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="ct-input w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-3.5 py-3 text-sm text-[#f0ede6] placeholder-[#444] transition-colors"
                  placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Email</label>
              <input name="email" value={form.email} onChange={handleChange}
                className="ct-input w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-3.5 py-3 text-sm text-[#f0ede6] placeholder-[#444] transition-colors"
                placeholder="ram@example.com" />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Query type</label>
              <select name="query" value={form.query} onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-3.5 py-3 text-sm text-[#f0ede6] appearance-none">
                <option value="">Select karo...</option>
                <option>Free Trial ke baare mein</option>
                <option>Pricing / Plans</option>
                <option>Technical Support</option>
                <option>Demo Book karna</option>
                <option>Partnership</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-[#666] mb-1.5">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                className="ct-textarea w-full bg-[#0d0d0d] border border-[#222] rounded-xl px-3.5 py-3 text-sm text-[#f0ede6] placeholder-[#444] resize-y min-h-[100px] transition-colors"
                placeholder="Aapka sawal ya message likho..." />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#3ddc84] text-[#0a0a0a] font-medium py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Message Bhejo →
            </button>
            <p className="text-center text-[#555] text-xs mt-3">
              No spam. Sirf aapki query ke liye reply karenge.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}