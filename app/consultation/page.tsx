"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";

export default function ConsultationPage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = () => {
    if (!symptoms) return;

    setLoading(true);

    // Fake AI delay simulation
    setTimeout(() => {
      setResult({
        possibleCauses: "Mild stress, dehydration, or lack of sleep.",
        remedies:
          "Drink warm turmeric milk, stay hydrated, and maintain regular sleep.",
        lifestyle:
          "Daily 20-minute walk, reduce screen time before sleep.",
        precautions:
          "If symptoms persist more than 5 days, consult a physician.",
      });
      setLoading(false);
    }, 1500);
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
            Describe your symptoms for personalized holistic guidance.
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
            placeholder="e.g. I've been feeling tired and having headaches..."
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-full text-white font-medium"
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
              <h3 className="font-semibold">Possible Causes</h3>
              <p className="text-gray-600">{result.possibleCauses}</p>
            </div>

            <div>
              <h3 className="font-semibold">Natural Remedies</h3>
              <p className="text-gray-600">{result.remedies}</p>
            </div>

            <div>
              <h3 className="font-semibold">Lifestyle Suggestions</h3>
              <p className="text-gray-600">{result.lifestyle}</p>
            </div>

            <div>
              <h3 className="font-semibold">Precautions</h3>
              <p className="text-gray-600">{result.precautions}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}