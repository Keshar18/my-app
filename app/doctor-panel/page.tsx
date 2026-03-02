"use client";

import { useState } from "react";

interface Case {
  id: number;
  patient: string;
  problem: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  status: "PENDING" | "VERIFIED";
}

export default function DoctorPanel() {
  const [cases, setCases] = useState<Case[]>([
    {
      id: 1,
      patient: "Patient #1023",
      problem: "Severe chest pain for 2 hours",
      risk: "HIGH",
      confidence: 92,
      status: "PENDING",
    },
    {
      id: 2,
      patient: "Patient #2045",
      problem: "Mild headache and dehydration",
      risk: "LOW",
      confidence: 85,
      status: "PENDING",
    },
  ]);

  const verifyCase = (id: number) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "VERIFIED" } : c
      )
    );
  };

  const getRiskBadge = (risk: string) => {
    if (risk === "HIGH")
      return "bg-red-100 text-red-600";
    if (risk === "MEDIUM")
      return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="min-h-screen bg-[#f4f9ff] px-10 py-12">

      {/* DOCTOR PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-12 border border-gray-100">

        <div className="flex items-center justify-between flex-wrap gap-6">

          {/* Left Section */}
          <div className="flex items-center gap-6">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white text-3xl font-bold">
              DR
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dr. Rohan Sharma
              </h1>

              <p className="text-gray-500 text-sm">
                AI Validation Specialist
              </p>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-semibold text-gray-700">
                  4.3
                </span>
                <span className="text-gray-400 text-sm">
                  (128 Reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-3 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              Top Reviewer
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
              Emergency Expert
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
              100+ Cases Verified
            </span>
          </div>

        </div>
      </div>

      {/* HORIZONTAL STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">

        <StatCard title="Total Cases" value={cases.length} />
        <StatCard
          title="Pending Reviews"
          value={cases.filter(c => c.status === "PENDING").length}
        />
        <StatCard
          title="Verified Cases"
          value={cases.filter(c => c.status === "VERIFIED").length}
        />

      </div>

      {/* CASE LIST */}
      <div className="space-y-8">
        {cases.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between flex-wrap gap-6">

              <div className="flex-1 min-w-[250px]">

                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {c.patient}
                  </h3>

                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRiskBadge(c.risk)}`}>
                    {c.risk} Risk
                  </span>

                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    c.status === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {c.status === "VERIFIED"
                      ? "Verified"
                      : "Pending Review"}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">
                  {c.problem}
                </p>

                <p className="text-sm text-gray-500">
                  AI Confidence Score:
                  <span className="font-medium text-gray-700 ml-1">
                    {c.confidence}%
                  </span>
                </p>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3">

                {c.status === "PENDING" && (
                  <button
                    onClick={() => verifyCase(c.id)}
                    className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:scale-105 transition"
                  >
                    ✔ Verify
                  </button>
                )}

                <button className="px-5 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-sm transition">
                  ✏ Add Note
                </button>

                <button className="px-5 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm transition">
                  🚨 Escalate
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* --------- Stat Card Component --------- */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      <h2 className="text-2xl font-bold text-gray-800">
        {value}
      </h2>
    </div>
  );
}