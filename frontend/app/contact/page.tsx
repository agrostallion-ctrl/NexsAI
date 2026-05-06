"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Thank you! Your message has been received. We will contact you soon.");
  };

  const contactCards = [
    {
      icon: "✉️",
      label: "Email",
      value: "support@360nexusai.com",
      href: "mailto:support@360nexusai.com",
    },
    {
      icon: "📞",
      label: "Phone / WhatsApp",
      value: "+91 78809 00423",
      href: "tel:+917880900423",
    },
    {
      icon: "📍",
      label: "Location",
      value: "India",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020807] text-white">
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
              Contact Us
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Get in Touch with{" "}
              <span className="text-emerald-400">360NexusAI</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-400">
              Have questions about pricing, demo, WhatsApp automation, CRM
              workflows, or integrations? Send us a message and our team will
              contact you soon.
            </p>
          </div>

          {/* Content */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Left cards */}
            <div className="space-y-4">
              {contactCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-white/10 bg-[#071410] p-6 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl">
                      {card.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                        {card.label}
                      </p>

                      {card.href ? (
                        <a
                          href={card.href}
                          className="mt-1 block text-base font-bold text-emerald-400 hover:text-emerald-300"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-base font-bold text-white">
                          {card.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                  Response Time
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Usually within 24 hours
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Our team reviews every inquiry and responds as quickly as
                  possible.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-[#071410] p-6 shadow-2xl sm:p-8">
              <h2 className="text-2xl font-bold text-white">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                Fill out the form below and we will get back to you.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Phone / WhatsApp
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/60"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Query Type
                </label>
                <select
                  name="query"
                  value={form.query}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/60"
                >
                  <option value="">Select an option</option>
                  <option>Free Trial</option>
                  <option>Pricing / Plans</option>
                  <option>Technical Support</option>
                  <option>Book a Demo</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="min-h-[130px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/60"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 w-full rounded-full bg-emerald-400 px-7 py-4 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                Send Message →
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                We use your details only to respond to your inquiry. No spam.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}