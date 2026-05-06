export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Contact 360NexusAI
        </h1>

        <p className="text-lg text-gray-300 text-center mb-12 leading-relaxed">
          Have questions, business inquiries, or need support?
          Our team is here to help you scale with AI-powered automation.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Support Email</h2>
            <p className="text-gray-400">
              support@360nexusai.com
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Phone</h2>
            <p className="text-gray-400">
              +91 7880900423
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Location</h2>
            <p className="text-gray-400">
              India
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            We typically respond within 24 hours.
          </p>
        </div>
      </div>
    </main>
  );
}