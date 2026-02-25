"use client";

import { useState } from "react";

export default function ConsultationPage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSummaryOption, setShowSummaryOption] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    setResult(null);
    setSummaryGenerated(false);
    setShowSummaryOption(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (data.reply) {
        const parsed = JSON.parse(data.reply);
        setResult(parsed);
        setShowSummaryOption(true);
      } else {
        setResult(null);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const generateSummary = () => {
    if (!result) return;

    const followUpDate = new Date();
    followUpDate.setDate(
      followUpDate.getDate() + Number(result.followUpDays || 7)
    );

    const summary = {
      symptoms,
      ...result,
      consultationDate: new Date().toLocaleDateString(),
      followUpDate: followUpDate.toLocaleDateString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("consultations") || "[]");

    localStorage.setItem(
      "consultations",
      JSON.stringify([...existing, summary])
    );

    setSummaryGenerated(true);
    setShowSummaryOption(false);
  };

  return (
    <section className="py-20 bg-[#f4f9ff] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">

        <h1 className="text-3xl font-bold mb-8 text-center">
          AI Health Consultation
        </h1>

        {/* Input */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
            className="w-full p-4 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
          />

          <button
            onClick={handleAnalyze}
            className="w-full py-3 rounded-xl text-white"
            style={{
              background: "linear-gradient(135deg,#2563eb,#14b8a6)",
            }}
          >
            {loading ? "Analyzing..." : "Analyze with AI Doctor"}
          </button>
        </div>

        {/* AI Result */}
        {result && (
          <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              AI Doctor Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-600">
                  Possible Causes
                </h3>
                <p>{result.possibleCauses}</p>
              </div>

              <div>
                <h3 className="font-semibold text-teal-600">
                  Natural Remedies
                </h3>
                <p>{result.naturalRemedies}</p>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-600">
                  Lifestyle Advice
                </h3>
                <p>{result.lifestyleAdvice}</p>
              </div>

              <div>
                <h3 className="font-semibold text-red-600">
                  Precautions
                </h3>
                <p>{result.precautions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Option */}
        {showSummaryOption && !summaryGenerated && (
          <div className="bg-blue-50 p-6 rounded-2xl text-center mb-8">
            <p className="mb-4 font-medium">
              Would you like to generate a detailed health summary?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={generateSummary}
                className="px-6 py-2 bg-green-500 text-white rounded-xl"
              >
                Yes
              </button>
              <button
                onClick={() => setShowSummaryOption(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-xl"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Summary Generated */}
        {summaryGenerated && (
          <div className="bg-green-50 p-6 rounded-2xl text-center">
            <p className="font-semibold text-green-700">
              Health summary saved successfully.
            </p>
            <p className="text-sm mt-2">
              You can view it in your Dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}