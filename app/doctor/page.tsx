"use client";

import { useState } from "react";

interface Case {
  id: number;
  patientQuery: string;
  aiResponse: string[];
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  confidence: number;
  status: "PENDING" | "ESCALATED" | "VERIFIED";
  doctorNote?: string;
}

export default function DoctorDashboard() {
  const [cases, setCases] = useState<Case[]>([
    {
      id: 1,
      patientQuery: "I have chest pain for 2 days",
      aiResponse: [
        "Possible cardiac involvement.",
        "Avoid physical exertion.",
        "Seek immediate medical consultation."
      ],
      riskLevel: "HIGH",
      confidence: 60,
      status: "ESCALATED",
    },
    {
      id: 2,
      patientQuery: "I have mild headache",
      aiResponse: [
        "Stay hydrated.",
        "Take rest.",
        "Monitor symptoms for 2 days."
      ],
      riskLevel: "LOW",
      confidence: 90,
      status: "PENDING",
    },
  ]);

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [modifiedResponse, setModifiedResponse] = useState("");

  const handleApprove = () => {
    if (!selectedCase) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, status: "VERIFIED" }
          : c
      )
    );

    alert("Case Verified by Doctor");
  };

  const handleEscalate = () => {
    if (!selectedCase) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, status: "ESCALATED" }
          : c
      )
    );

    alert("Case Escalated");
  };

  const handleModify = () => {
    if (!selectedCase) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              aiResponse: modifiedResponse.split("\n"),
              status: "VERIFIED",
            }
          : c
      )
    );

    alert("Response Modified & Verified");
  };

  return (
    <div className="flex h-screen bg-[#f4f9ff]">

      {/* LEFT PANEL - CASE LIST */}
      <div className="w-1/3 border-r bg-white p-5 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Doctor Review Panel
        </h2>

        {cases.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCase(c)}
            className="p-3 mb-3 border rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="font-semibold text-sm">
              Case #{c.id}
            </div>

            <div className="text-xs text-gray-600">
              {c.patientQuery}
            </div>

            <div className="text-xs mt-1">
              Risk:{" "}
              <span
                className={
                  c.riskLevel === "HIGH"
                    ? "text-red-600 font-semibold"
                    : c.riskLevel === "MODERATE"
                    ? "text-yellow-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {c.riskLevel}
              </span>
            </div>

            <div className="text-xs">
              Status: {c.status}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL - CASE DETAILS */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedCase ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Case Review
            </h2>

            <div className="mb-4">
              <strong>Patient Query:</strong>
              <p>{selectedCase.patientQuery}</p>
            </div>

            <div className="mb-4">
              <strong>AI Response:</strong>
              <ul className="list-disc pl-5">
                {selectedCase.aiResponse.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Confidence:</strong> {selectedCase.confidence}%
            </div>

            <div className="mb-6">
              <strong>Status:</strong> {selectedCase.status}
            </div>

            <textarea
              placeholder="Modify response if needed..."
              value={modifiedResponse}
              onChange={(e) =>
                setModifiedResponse(e.target.value)
              }
              className="w-full border rounded-lg p-3 mb-4"
              rows={4}
            />

            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={handleModify}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Modify & Verify
              </button>

              <button
                onClick={handleEscalate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Escalate
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500">
            Select a case to review.
          </div>
        )}
      </div>
    </div>
  );
}