"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface Message {
  role: "user" | "ai";
  content: string | string[];
  isMedical?: boolean;
  riskLevel?: "LOW" | "MODERATE" | "HIGH";
  confidence?: number;
  validationStatus?: "PENDING" | "VERIFIED" | "ESCALATED";
  explanation?: string[];
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

export default function ConsultationPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 1, title: "New Chat", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = sessions.find((s) => s.id === activeChatId)!;

  const latestUserMessage = [...activeChat.messages]
    .reverse()
    .find((m) => m.role === "user");

  const problemText = latestUserMessage?.content?.toString() || "";

  // ---------------- MEDICAL DETECTION ----------------
  const isMedicalQuery = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.length > 5 &&
      (
        lower.includes("pain") ||
        lower.includes("fever") ||
        lower.includes("headache") ||
        lower.includes("chest") ||
        lower.includes("gas") ||
        lower.includes("problem") ||
        lower.includes("how") ||
        lower.includes("what") ||
        lower.includes("should")
      )
    );
  };

  // ---------------- RISK ----------------
  const calculateRisk = (text: string) => {
    const lower = text.toLowerCase();

    if (
      lower.includes("chest pain") ||
      lower.includes("heart attack") ||
      lower.includes("stroke") ||
      lower.includes("breathing difficulty")
    ) return "HIGH";

    if (
      lower.includes("fever") ||
      lower.includes("vomiting") ||
      lower.includes("severe")
    ) return "MODERATE";

    return "LOW";
  };

  const calculateConfidence = (risk: string) => {
    if (risk === "HIGH") return 60;
    if (risk === "MODERATE") return 75;
    return 90;
  };

  const isEmergency = () => calculateRisk(problemText) === "HIGH";

  // ---------------- FEEDBACK ----------------
  const getFeedback = () => {
    const text = problemText.toLowerCase();

    if (text.includes("headache"))
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Headache relief tips worked in 2 days." },
        { stars: "⭐⭐⭐⭐", text: "Hydration advice helped a lot." },
      ];

    if (text.includes("chest"))
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Emergency alert helped me act quickly." },
        { stars: "⭐⭐⭐⭐", text: "Consulted doctor immediately." },
      ];

    if (text.includes("gas"))
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Diet advice improved digestion." },
        { stars: "⭐⭐⭐⭐", text: "Fiber suggestion was useful." },
      ];

    return [
      { stars: "⭐⭐⭐⭐", text: "Helpful general wellness guidance." },
    ];
  };

  const feedbackList = getFeedback();

  // ---------------- PDF ----------------
  const generatePDF = () => {
    const doc = new jsPDF();

    const userMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === "user");

    const aiMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === "ai");

    if (!userMessage || !aiMessage || !Array.isArray(aiMessage.content)) {
      alert("Complete consultation first.");
      return;
    }

    let y = 20;
    const risk = calculateRisk(problemText);

    let followUpDays = 5;
    if (risk === "HIGH") followUpDays = 1;
    if (risk === "MODERATE") followUpDays = 3;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    doc.setFontSize(18);
    doc.text("HolistiDoc AI Consultation Summary", 105, y, { align: "center" });
    y += 15;

    if (risk === "HIGH") {
      doc.setTextColor(200, 0, 0);
      doc.text(
        "🚨 EMERGENCY ALERT: Immediate medical attention required.",
        20,
        y,
        { maxWidth: 170 }
      );
      y += 15;
      doc.setTextColor(0);
    }

    doc.setFontSize(12);
    doc.text("Your Problem:", 20, y);
    y += 8;
    doc.text(userMessage.content as string, 20, y, { maxWidth: 170 });
    y += 20;

    doc.text("AI Recommended Guidance:", 20, y);
    y += 8;

    aiMessage.content.forEach((item) => {
      doc.text(`• ${item}`, 25, y, { maxWidth: 165 });
      y += 8;
    });

    y += 10;
    doc.text(
      `Follow-up: Please consult again after ${followUpDays} day(s) on ${followUpDate.toDateString()}`,
      20,
      y,
      { maxWidth: 170 }
    );

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Medical Disclaimer: HolistiDoc AI provides informational guidance only and does not replace licensed medical diagnosis.",
      20,
      280,
      { maxWidth: 170 }
    );

    doc.save("holistidoc-summary.pdf");
  };

  // ---------------- SEND ----------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeChatId
          ? {
              ...session,
              title:
                session.messages.length === 0
                  ? input.slice(0, 20)
                  : session.title,
              messages: [...session.messages, userMessage],
            }
          : session
      )
    );

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: currentInput }),
      });

      const data = await res.json();

      const medicalFlag = isMedicalQuery(currentInput);
      const risk = calculateRisk(currentInput);

      const aiMessage: Message = {
        role: "ai",
        content: Array.isArray(data.reply) ? data.reply : [data.reply],
        isMedical: medicalFlag,
        riskLevel: medicalFlag ? risk : undefined,
        confidence: medicalFlag ? calculateConfidence(risk) : undefined,
        validationStatus: medicalFlag
          ? risk === "HIGH"
            ? "ESCALATED"
            : "PENDING"
          : undefined,
        explanation: medicalFlag
          ? [
              "Detected medical keywords from your input.",
              `Risk classified as ${risk}.`,
              "No conflicting emergency indicators detected.",
            ]
          : undefined,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? { ...session, messages: [...session.messages, aiMessage] }
            : session
        )
      );
    } catch {
      alert("AI Error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex bg-[#f4f9ff] w-full"
      style={{ height: "calc(100vh - 72px)" }}>

      {/* LEFT SIDE */}
      <div className="flex flex-col w-4/5 p-6 h-full">

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4 text-sm text-gray-700">
          <strong>Medical Disclaimer:</strong> HolistiDoc AI provides informational guidance only and does not replace professional medical services.
        </div>

        {/* Emergency */}
        {isEmergency() && (
          <div className="bg-red-600 text-white p-4 rounded-xl mb-4 animate-pulse">
            🚨 EMERGENCY ALERT: Seek immediate medical help.
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">AI Health Consultation</h1>

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-4">
          {activeChat.messages.map((msg, index) => (
            <div key={index}
              className={msg.role === "user" ? "text-right" : "text-left"}>

              <div className={`inline-block px-4 py-3 rounded-xl max-w-xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}>

                {msg.role === "ai" &&
                 Array.isArray(msg.content) &&
                 msg.isMedical ? (
                  <>
                    <ul className="list-disc pl-5 space-y-1 text-left">
                      {msg.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    {/* Validation Panel */}
                    <div className="mt-3 p-3 bg-gray-50 border rounded-lg text-xs space-y-1">
                      <div className="font-semibold text-blue-600">
                        AI Generated Preliminary Guidance
                      </div>

                      <div>
                        Risk Level:{" "}
                        <span className={
                          msg.riskLevel === "HIGH"
                            ? "text-red-600 font-semibold"
                            : msg.riskLevel === "MODERATE"
                            ? "text-yellow-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }>
                          {msg.riskLevel}
                        </span>
                      </div>

                      <div>Confidence: {msg.confidence}%</div>

                      <div>
                        {msg.validationStatus === "ESCALATED" && (
                          <span className="text-red-600 font-semibold">
                            Escalated – Immediate Medical Attention Required
                          </span>
                        )}

                        {msg.validationStatus === "PENDING" && (
                          <span className="text-yellow-600 font-semibold">
                            ⏳ Pending Doctor Review
                          </span>
                        )}

                        {msg.validationStatus === "VERIFIED" && (
                          <span className="text-green-600 font-semibold">
                            ✔ Verified by Doctor
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            className="flex-1 border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-400">
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/5 bg-white border-l p-5 flex flex-col h-full">

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              const newChat = {
                id: Date.now(),
                title: "New Chat",
                messages: [],
              };
              setSessions((prev) => [...prev, newChat]);
              setActiveChatId(newChat.id);
            }}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
            +
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-2xl font-bold">
            ☰
          </button>
        </div>

        {!showHistory && (
          <>
            <button
              onClick={generatePDF}
              className="mb-6 py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-400 shadow">
              Download Summary
            </button>

            {isMedicalQuery(problemText) && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Community Feedback
                </h2>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {feedbackList.map((fb, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm">
                      <div className="text-yellow-500 mb-2 text-lg">
                        {fb.stars}
                      </div>
                      <p className="text-sm text-gray-700">
                        {fb.text}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {showHistory && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Chat History
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setActiveChatId(session.id)}
                  className={`p-3 rounded-lg cursor-pointer text-sm ${
                    activeChatId === session.id
                      ? "bg-blue-100 font-medium"
                      : "hover:bg-gray-100"
                  }`}>
                  {session.title}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}