"use client";

import Link from "next/link";
import GradientButton from "@/components/GradientButton";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

          {/* LEFT */}
          <div>
            <span className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-blue-100 text-blue-700">
              AI-Powered Holistic Health
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Personal <span className="text-blue-600">AI</span>{" "}
              <span className="text-teal-500">Health</span> Assistant
            </h1>

            <p className="text-gray-600 mb-8">
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
                className="px-8 py-3 border border-gray-300 rounded-full text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex justify-center">
            <div className="w-[380px] h-[380px] rounded-3xl bg-gradient-to-br from-blue-100 to-teal-100 shadow-xl flex items-center justify-center text-6xl">
              💙
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </>
  );
}