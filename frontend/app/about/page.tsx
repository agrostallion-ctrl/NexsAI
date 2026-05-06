export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">
          About 360NexusAI
        </h1>

        <p className="text-lg text-gray-300 mb-8 text-center leading-relaxed">
          360NexusAI is an advanced AI-powered SaaS platform designed to help
          businesses automate customer engagement, WhatsApp communication,
          lead generation, and sales workflows — all from one unified system.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              Our mission is to empower businesses with cutting-edge AI tools
              that simplify communication, boost conversions, and scale customer
              relationships faster than ever before.
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <p className="text-gray-400 leading-relaxed">
              From WhatsApp automation and CRM integrations to AI chatbots and
              real-time analytics, 360NexusAI delivers a complete ecosystem for
              modern business growth.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Built for the Future of Business Automation
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Whether you're a startup, agency, or enterprise, 360NexusAI helps
            you streamline operations, improve customer satisfaction, and unlock
            scalable growth through intelligent automation.
          </p>
        </div>
      </div>
    </main>
  );
}