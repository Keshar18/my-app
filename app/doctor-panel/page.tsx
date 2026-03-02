"use client";

import { useState } from "react";

interface Case {
  id: number;
  patient: string;
  problem: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  status: "PENDING" | "VERIFIED";
  notes?: string;
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

  const addNote = (id: number, note: string) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, notes: note } : c
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

  const getStatusBadge = (status: string) => {
    if (status === "VERIFIED")
      return "bg-green-100 text-green-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-[#f4f9ff] px-10 py-14">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Doctor Review Dashboard
        </h1>
        <p className="text-gray-600">
          Validate AI-generated recommendations and manage medical cases.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-14">
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

      {/* Cases */}
      <div className="space-y-8">
        {cases.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-8 border border-gray-100"
          >
            <div className="flex justify-between flex-wrap gap-6">

              {/* Left Side Info */}
              <div className="flex-1 min-w-[250px]">

                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {c.patient}
                  </h3>

                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRiskBadge(c.risk)}`}>
                    {c.risk} Risk
                  </span>

                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(c.status)}`}>
                    {c.status === "VERIFIED"
                      ? "Verified by Doctor"
                      : "Pending Review"}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">
                  {c.problem}
                </p>

                <div className="text-sm text-gray-500">
                  AI Confidence Score:{" "}
                  <span className="font-medium text-gray-700">
                    {c.confidence}%
                  </span>
                </div>

                {c.notes && (
                  <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-md text-sm text-gray-700">
                    <strong>Doctor Note:</strong> {c.notes}
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-[160px]">

                {c.status === "PENDING" && (
                  <button
                    onClick={() => verifyCase(c.id)}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-medium hover:scale-105 transition"
                  >
                    ✔ Verify
                  </button>
                )}

                <button
                  onClick={() =>
                    addNote(c.id, "Reviewed. Recommendations look appropriate.")
                  }
                  className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition text-sm"
                >
                  ✏ Add Note
                </button>

                <button
                  className="px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition text-sm"
                >
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

/* ---------- Stat Card Component ---------- */

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