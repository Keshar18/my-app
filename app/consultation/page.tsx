"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

type ConsultationResult = {
  possibleCauses: string;
  remedies: string;
  lifestyle: string;
  precautions: string;
};

export default function ConsultationPage() {
  const [symptoms, setSymptoms] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ConsultationResult | null>(null);

  const handleSubmit = () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const newResult: ConsultationResult = {
        possibleCauses:
          "Your symptoms may be related to mild stress, dehydration, or lack of proper sleep.",
        remedies:
          "Drink warm turmeric milk, stay hydrated, and ensure 7–8 hours of quality sleep.",
        lifestyle:
          "Include light daily exercise like walking and practice deep breathing for 10 minutes.",
        precautions:
          "If symptoms persist for more than 5 days or worsen, consult a medical professional.",
      };

      setResult(newResult);

      // Save to localStorage
      const previous = JSON.parse(
        localStorage.getItem("consultations") || "[]"
      );

      localStorage.setItem(
        "consultations",
        JSON.stringify([
          ...previous,
          {
            symptoms,
            ...newResult,
            date: new Date().toISOString(),
          },
        ])
      );

      setLoading(false);
    }, 1500);
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("HolistiDoc AI - Health Summary", 20, 20);

    doc.setFontSize(12);
    doc.text(`Symptoms: ${symptoms}`, 20, 40);
    doc.text(`Possible Causes: ${result.possibleCauses}`, 20, 60);
    doc.text(`Natural Remedies: ${result.remedies}`, 20, 80);
    doc.text(`Lifestyle Suggestions: ${result.lifestyle}`, 20, 100);
    doc.text(`Precautions: ${result.precautions}`, 20, 120);

    doc.save("HolistiDoc_Health_Summary.pdf");
  };

  return (
    <section className="py-20 bg-[#f4f9ff] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Health Consultation
          </h1>
          <p className="text-gray-600">
            Describe your symptoms to receive personalized holistic guidance.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-12">
          <label className="block mb-3 font-medium">
            Describe your symptoms
          </label>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I've been feeling tired and experiencing mild headaches..."
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-full text-white font-medium transition disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg,#2563eb,#14b8a6)",
            }}
          >
            {loading ? "Analyzing..." : "Get AI Health Guidance"}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white p-8 rounded-3xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Your Health Guidance
            </h2>

            <div>
              <h3 className="font-semibold text-blue-600">
                Possible Causes
              </h3>
              <p className="text-gray-600">{result.possibleCauses}</p>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600">
                Natural Remedies
              </h3>
              <p className="text-gray-600">{result.remedies}</p>
            </div>

            <div>
              <h3 className="font-semibold text-blue-600">
                Lifestyle Suggestions
              </h3>
              <p className="text-gray-600">{result.lifestyle}</p>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600">
                Precautions
              </h3>
              <p className="text-gray-600">{result.precautions}</p>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadPDF}
              className="mt-6 px-6 py-3 rounded-full text-white font-medium"
              style={{
                background: "linear-gradient(135deg,#2563eb,#14b8a6)",
              }}
            >
              Download Health Summary
            </button>
          </div>
        )}
      </div>
    </section>
  );
}