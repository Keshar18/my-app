"use client";

import { useState } from "react";

type Consultation = {
  symptoms: string;
  possibleCauses: string;
  remedies: string;
  lifestyle: string;
  precautions: string;
  date: string;
};

export default function DashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("consultations") || "[]");
    }
    return [];
  });

  const deleteConsultation = (index: number) => {
    const updated = consultations.filter((_, i) => i !== index);
    setConsultations(updated);
    localStorage.setItem("consultations", JSON.stringify(updated));
  };

  return (
    <section className="py-20 bg-[#f4f9ff] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Your Health Dashboard
        </h1>

        {consultations.length === 0 ? (
          <div className="text-center text-gray-600">
            No consultations yet. Start one from Consultation page.
          </div>
        ) : (
          <div className="grid gap-6">
            {consultations.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md relative"
              >
                <button
                  onClick={() => deleteConsultation(index)}
                  className="absolute top-4 right-4 text-red-500 text-sm"
                >
                  Delete
                </button>

                <p className="text-sm text-gray-400 mb-2">
                  {new Date(item.date).toLocaleString()}
                </p>

                <h3 className="font-semibold mb-2">Symptoms:</h3>
                <p className="text-gray-600 mb-4">{item.symptoms}</p>

                <h3 className="font-semibold text-blue-600">
                  Possible Causes:
                </h3>
                <p className="text-gray-600 mb-2">
                  {item.possibleCauses}
                </p>

                <h3 className="font-semibold text-teal-600">
                  Remedies:
                </h3>
                <p className="text-gray-600">
                  {item.remedies}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}