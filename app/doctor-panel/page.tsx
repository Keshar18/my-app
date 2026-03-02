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
      status: "VERIFIED",
    },
  ]);

  const verifyCase = (id: number) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "VERIFIED" } : c
      )
    );
  };

  const verifiedCount = cases.filter(c => c.status === "VERIFIED").length;

  /* ---------------- BADGE SYSTEM ---------------- */

  const getBadgeLevel = () => {
    if (verifiedCount >= 100) return "GOLD";
    if (verifiedCount >= 50) return "SILVER";
    if (verifiedCount >= 10) return "BRONZE";
    return "NONE";
  };

  const badgeLevel = getBadgeLevel();

  const BadgeDisplay = () => {
    if (badgeLevel === "GOLD")
      return (
        <div className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
          🥇 Gold Reviewer
        </div>
      );

    if (badgeLevel === "SILVER")
      return (
        <div className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
          🥈 Silver Reviewer
        </div>
      );

    if (badgeLevel === "BRONZE")
      return (
        <div className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
          🥉 Bronze Reviewer
        </div>
      );

    return (
      <div className="text-sm text-gray-400">
        No Badge Earned Yet
      </div>
    );
  };

  const getRiskColor = (risk: string) => {
    if (risk === "HIGH") return "bg-red-100 text-red-600";
    if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="min-h-screen bg-[#f4f9ff] px-12 py-10">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-10 border border-gray-100 flex justify-between items-center flex-wrap gap-6">

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

            <div className="flex items-center gap-2 mt-2">
              ⭐ <span className="font-semibold">4.3</span>
              <span className="text-gray-400 text-sm">(128 Reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <BadgeDisplay />
          <div className="text-sm text-gray-600">
            Verified Cases:
            <span className="font-semibold ml-1">
              {verifiedCount}
            </span>
          </div>
        </div>

      </div>

      {/* HORIZONTAL STATS */}
      <div className="flex gap-6 mb-12">

        <StatCard
          title="Total Cases"
          value={cases.length}
        />

        <StatCard
          title="Pending Reviews"
          value={cases.filter(c => c.status === "PENDING").length}
        />

        <StatCard
          title="Verified Cases"
          value={verifiedCount}
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

              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {c.patient}
                  </h3>

                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRiskColor(c.risk)}`}>
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

                <p className="text-gray-600">
                  {c.problem}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  AI Confidence:
                  <span className="font-medium text-gray-700 ml-1">
                    {c.confidence}%
                  </span>
                </p>
              </div>

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

/* ---------- STAT CARD ---------- */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      <h2 className="text-2xl font-bold text-gray-800">
        {value}
      </h2>
    </div>
  );
}