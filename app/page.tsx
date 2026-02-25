import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="py-20 md:py-28 bg-[#f4f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid md:grid-cols-2 items-center gap-12">

          {/* LEFT SIDE */}
          <div>
            <span className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-blue-100 text-blue-700">
              AI-Powered Holistic Health
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Personal{" "}
              <span className="text-blue-600">AI</span>{" "}
              <span className="text-teal-500">Health</span> Assistant
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl">
              Get comprehensive health guidance combining modern medicine,
              natural remedies, diet advice, and yoga recommendations —
              all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/consultation"
                className="px-8 py-3 rounded-full text-white font-medium shadow-lg text-center"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#14b8a6)",
                }}
              >
                Start Consultation →
              </Link>

              <Link
                href="/about"
                className="px-8 py-3 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-100 transition text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE VISUAL */}
          <div className="hidden md:flex justify-center items-center">
            <div className="w-[320px] lg:w-[420px] h-[320px] lg:h-[420px] rounded-3xl bg-gradient-to-br from-blue-100 to-teal-100 shadow-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl lg:text-7xl mb-4">💙</div>
                <p className="text-gray-500 text-sm">
                  Smart AI Healthcare Interface
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">

          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Holistic Health, Reimagined
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Comprehensive wellness guidance at your fingertips
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analysis",
                desc: "Advanced AI analyzes your symptoms and provides comprehensive health guidance.",
              },
              {
                title: "Natural Remedies",
                desc: "Evidence-based natural remedies alongside modern medical recommendations.",
              },
              {
                title: "Expert Attribution",
                desc: "Every recommendation is attributed to a specialist area for transparency.",
              },
              {
                title: "Yoga & Exercise",
                desc: "Personalized exercise and yoga recommendations for your condition.",
              },
              {
                title: "Community Feedback",
                desc: "See how others benefited from similar recommendations.",
              },
              {
                title: "Health Summaries",
                desc: "Generate professional doctor-style health summary documents.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="mb-8 text-blue-100 text-sm md:text-base">
            Start your free AI-powered health consultation today and get personalized holistic wellness recommendations.
          </p>

          <Link
            href="/consultation"
            className="px-8 py-3 bg-white text-blue-700 rounded-full font-medium shadow-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </>
  );
}