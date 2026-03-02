"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f4f9ff] flex flex-col items-center px-6 py-20">

      {/* Heading */}
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Choose your role to continue. Everything is organized for clarity,
          transparency, and trust.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">

        {/* USER CARD */}
        <Link
          href="/consultation"
          className="bg-white rounded-[10px] p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl">
              👤
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              User Dashboard
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Start AI consultation, track previous sessions,
            download medical summaries, and manage your
            personalized health insights.
          </p>

          <div className="mt-8 inline-block px-5 py-2.5 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:scale-105 transition">
            Go to User Panel →
          </div>
        </Link>

        {/* DOCTOR CARD */}
        <Link
          href="/doctor-panel"
          className="bg-white rounded-[10px] p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl">
              🩺
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Doctor Dashboard
            </h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Review AI-generated cases, verify recommendations,
            manage escalated emergency alerts, and validate
            medical responses.
          </p>

          <div className="mt-8 inline-block px-5 py-2.5 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:scale-105 transition">
            Go to Doctor Panel →
          </div>
        </Link>

      </div>
    </div>
  );
}