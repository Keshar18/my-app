"use client";

import GradientButton from "@/components/GradientButton";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="py-24 md:py-32 bg-[#f4f9ff]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
              ⚡ AI-Powered Holistic Health
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Personal{" "}
              <span className="text-blue-600">AI</span>{" "}
              <span className="text-teal-500">Health</span> Assistant
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-xl">
              Get comprehensive health guidance combining modern medicine,
              natural remedies, diet advice, and yoga recommendations —
              all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <GradientButton
                text="Start Consultation →"
                href="/consultation"
              />
              <Link
                href="/about"
                className="px-8 py-3 border border-gray-300 rounded-full text-center hover:bg-gray-100 transition"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE BOX */}
          <motion.div
            className="hidden md:flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative w-[380px] h-[380px] rounded-3xl bg-gradient-to-br from-blue-100 via-white to-teal-100 shadow-2xl flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="text-7xl"
              >
                💙
              </motion.div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200/20 to-teal-200/20 blur-3xl -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES HEADING SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Holistic Health, Reimagined
          </h2>
          <p className="text-gray-600 text-lg">
            Comprehensive wellness guidance at your fingertips
          </p>
        </div>

        {/* FEATURES CARDS */}
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "AI-Powered Analysis",
            "Natural Remedies",
            "Expert Attribution",
            "Yoga & Exercise",
            "Community Feedback",
            "Health Summaries",
          ].map((title, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl"
            >
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">
                Professional holistic healthcare guidance.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
<section className="py-20 bg-[#f4f9ff]">
  <div className="max-w-6xl mx-auto px-6">
    <div className="rounded-3xl p-12 text-center text-white shadow-2xl"
      style={{
        background: "linear-gradient(135deg,#2563eb,#14b8a6)",
      }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Take Control of Your Health?
      </h2>

      <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
        Start your free AI-powered health consultation today and get
        personalized holistic wellness recommendations.
      </p>

      <GradientButton
        text="Get Started Free →"
        href="/consultation"
      />
    </div>
  </div>
</section>

      
    </>
  );
}