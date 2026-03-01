"use client";

import { useState } from "react";

type ValidationStatus =
  | "AI_GENERATED"
  | "PENDING_REVIEW"
  | "CLINICALLY_REVIEWED"
  | "MODIFIED_BY_DOCTOR"
  | "ESCALATED";

type RiskLevel = "LOW" | "MODERATE" | "HIGH";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string | string[];
  isMedical?: boolean;
  riskLevel?: RiskLevel;
  confidence?: number;
  validationStatus?: ValidationStatus;
  doctorModifiedResponse?: string;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
}

export default function ConsultationPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 1,
      title: "New Chat",
      messages: [],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = sessions.find((s) => s.id === activeChatId)!;

  // -------------------------
  // SMART MEDICAL DETECTION
  // -------------------------
  const detectMedical = (text: string) => {
    const lower = text.toLowerCase();

    const medicalKeywords = [
      "pain",
      "fever",
      "infection",
      "chest",
      "headache",
      "vomiting",
      "injury",
      "stroke",
      "breathing",
      "heart",
    ];

    return medicalKeywords.some((word) => lower.includes(word));
  };

  const calculateRisk = (text: string): RiskLevel => {
    const lower = text.toLowerCase();

    if (
      lower.includes("chest pain") ||
      lower.includes("stroke") ||
      lower.includes("heart attack") ||
      lower.includes("breathing difficulty")
    )
      return "HIGH";

    if (
      lower.includes("fever") ||
      lower.includes("infection") ||
      lower.includes("severe pain")
    )
      return "MODERATE";

    return "LOW";
  };

  const calculateConfidence = (risk: RiskLevel) => {
    if (risk === "HIGH") return 60;
    if (risk === "MODERATE") return 75;
    return 90;
  };

  // -------------------------
  // PDF GENERATOR
  // -------------------------
  const generatePDF = () => {
    if (!lastMedicalMessage) return;

    const problem =
      activeChat.messages.find((m) => m.role === "user")
        ?.content || "";

    const solutions = Array.isArray(
      lastMedicalMessage.content
    )
      ? lastMedicalMessage.content
      : [lastMedicalMessage.content];

    const nextConsultDate = new Date();
    nextConsultDate.setDate(
      nextConsultDate.getDate() + 3
    );

    const html = `
      <html>
        <body style="font-family:Arial;padding:40px;">
          <h1 style="color:#2563eb;">HolistiDoc AI Summary</h1>
          <h3>Your Problem:</h3>
          <p>${problem}</p>
          <h3>Recommended Solutions:</h3>
          <ul>
            ${solutions
              .map((s) => `<li>${s}</li>`)
              .join("")}
          </ul>
          <p><strong>Consult Again On:</strong> ${nextConsultDate.toDateString()}</p>
          ${
            lastMedicalMessage.validationStatus ===
            "ESCALATED"
              ? `<p style="color:red;font-weight:bold;">Emergency Alert: Seek immediate medical help.</p>`
              : ""
          }
        </body>
      </html>
    `;

    const newWindow = window.open("");
    newWindow?.document.write(html);
    newWindow?.print();
  };

  // -------------------------
  // NEW CHAT
  // -------------------------
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setSessions((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeChatId
          ? {
              ...session,
              title:
                session.messages.length === 0
                  ? userInput.slice(0, 20)
                  : session.title,
              messages: [...session.messages, userMessage],
            }
          : session
      )
    );

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userInput }),
      });

      const data = await res.json();

      const isMedical = detectMedical(userInput);

      let riskLevel: RiskLevel = "LOW";
      let confidence = 0;
      let status: ValidationStatus = "AI_GENERATED";

      if (isMedical) {
        riskLevel = calculateRisk(userInput);
        confidence = calculateConfidence(riskLevel);
        status =
          riskLevel === "HIGH"
            ? "ESCALATED"
            : "PENDING_REVIEW";
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: Array.isArray(data.reply)
          ? data.reply
          : [data.reply],
        isMedical,
        riskLevel: isMedical ? riskLevel : undefined,
        confidence: isMedical ? confidence : undefined,
        validationStatus: isMedical ? status : undefined,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? {
                ...session,
                messages: [...session.messages, aiMessage],
              }
            : session
        )
      );
    } catch {
      alert("AI Error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastMedicalMessage = [...activeChat.messages]
    .reverse()
    .find((m) => m.role === "ai" && m.isMedical);

  return (
    <div
      className="relative flex bg-[#f4f9ff] w-full"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* 🚨 EMERGENCY */}
      {lastMedicalMessage?.validationStatus ===
        "ESCALATED" && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center py-3 font-semibold shadow-lg z-50">
          🚨 Emergency Alert: Seek Immediate Medical Help
        </div>
      )}

      <div className="flex flex-col w-4/5 p-6 h-full">
        <h1 className="text-3xl font-bold mb-4">
          AI Health Consultation
        </h1>

        {/* TRANSPARENCY PANEL */}
        {lastMedicalMessage && (
          <div className="mb-4 p-4 rounded-xl bg-gray-100 text-sm shadow">
            <div className="font-medium mb-1">
              🤖 AI Generated Preliminary Guidance
            </div>
            <div>
              Risk Level: {lastMedicalMessage.riskLevel}
            </div>
            <div>
              Confidence: {lastMedicalMessage.confidence}%
            </div>
          </div>
        )}

        {/* CHAT */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-4">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div
                className={`inline-block px-4 py-3 rounded-xl max-w-xl ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.role === "ai" &&
                msg.isMedical &&
                Array.isArray(msg.content) ? (
                  <ul className="list-disc pl-5 space-y-1 text-left">
                    {msg.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500 animate-pulse">
              AI is analyzing...
            </p>
          )}
        </div>

        {/* INPUT */}
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
            className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-400"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/5 bg-white border-l p-5 flex flex-col h-full">
        <button
          onClick={handleNewChat}
          className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + New Chat
        </button>

        {/* PDF BUTTON */}
        {lastMedicalMessage && (
          <button
            onClick={generatePDF}
            className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Download Summary PDF
          </button>
        )}

        <h2 className="text-lg font-semibold mb-4">
          Chat History
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() =>
                setActiveChatId(session.id)
              }
              className={`p-3 rounded-lg cursor-pointer text-sm ${
                activeChatId === session.id
                  ? "bg-blue-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {session.title}
            </div>
          ))}
        </div>

        {/* COMMUNITY FEEDBACK */}
        {lastMedicalMessage && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Community Feedback
            </h3>

            <div className="bg-gray-100 p-3 rounded-lg mb-2">
              ⭐⭐⭐⭐⭐
              <p className="text-sm">
                Helped me understand my symptoms.
              </p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              ⭐⭐⭐⭐☆
              <p className="text-sm">
                Clear recommendations provided.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}