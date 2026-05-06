export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-24 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="text-xs font-semibold tracking-[2px] uppercase text-[#00c864] border border-[#00c864]/30 bg-[#00c864]/10 px-4 py-1.5 rounded-full">
            Support
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-5 leading-tight">
          Hum Yahan <span className="text-[#00c864]">Hain</span> Aapke Liye
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-center text-base leading-relaxed max-w-xl mx-auto mb-14">
          Need help with 360NexusAI? Our support team is available to assist you with
          technical issues, account access, integrations, and platform guidance.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Email Card */}
          <div className="group bg-[#111] border border-[#1f1f1f] hover:border-[#00c864] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c864] to-[#00a854] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-11 h-11 bg-[#00c864]/10 rounded-xl flex items-center justify-center text-xl mb-5">
              ✉️
            </div>
            <h2 className="text-lg font-bold mb-2">Support Email</h2>
            <p className="text-gray-500 text-sm mb-3 leading-relaxed">
              Technical issues, account access, aur integrations ke liye email karein.
            </p>
            <a href="mailto:support@360nexusai.com" className="text-[#00c864] text-sm font-medium hover:underline">
              support@360nexusai.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="group bg-[#111] border border-[#1f1f1f] hover:border-[#00c864] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c864] to-[#00a854] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-11 h-11 bg-[#00c864]/10 rounded-xl flex items-center justify-center text-xl mb-5">
              📞
            </div>
            <h2 className="text-lg font-bold mb-2">Phone Support</h2>
            <p className="text-gray-500 text-sm mb-3 leading-relaxed">
              Seedha baat karein hamare support team se. Mon–Sat, 9AM–6PM IST.
            </p>
            <a href="tel:+917880900423" className="text-[#00c864] text-sm font-medium hover:underline">
              +91 7880900423
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00c864] animate-pulse" />
          We aim to respond as quickly as possible.
        </p>

      </div>
    </main>
  );
}