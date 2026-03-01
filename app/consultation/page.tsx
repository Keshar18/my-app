"use client";

import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string | string[];
  isMedical?: boolean;
}

type ValidationStatus =
  | "AI_GENERATED"
  | "PENDING_REVIEW"
  | "REVIEWED"
  | "ESCALATED";

type RiskLevel = "LOW" | "MODERATE" | "HIGH";

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  status: ValidationStatus;
  riskLevel: RiskLevel;
  confidence: number;
}

export default function ConsultationPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 1,
      title: "New Chat",
      messages: [],
      status: "AI_GENERATED",
      riskLevel: "LOW",
      confidence: 0,
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
    ];

    return medicalKeywords.some((word) =>
      lower.includes(word)
    );
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
  // NEW CHAT
  // -------------------------
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      status: "AI_GENERATED",
      riskLevel: "LOW",
      confidence: 0,
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
        role: "ai",
        content: Array.isArray(data.reply)
          ? data.reply
          : [data.reply],
        isMedical,
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? {
                ...session,
                messages: [...session.messages, aiMessage],
                riskLevel,
                confidence,
                status,
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

  return (
    <div
      className="relative flex bg-[#f4f9ff] w-full"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* 🚨 EMERGENCY */}
      {activeChat.status === "ESCALATED" && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center py-3 font-semibold shadow-lg z-50">
          🚨 Emergency Alert: Seek Immediate Medical Help
        </div>
      )}

      <div className="flex flex-col w-4/5 p-6 h-full">
        <h1 className="text-3xl font-bold mb-4">
          AI Health Consultation
        </h1>

        {/* RISK PANEL */}
        {activeChat.status !== "AI_GENERATED" && (
          <div className="mb-4 p-4 rounded-xl bg-gray-100 text-sm shadow">
            <div className="font-medium mb-1">
              🤖 AI Generated Preliminary Guidance
            </div>
            <div>Risk Level: {activeChat.riskLevel}</div>
            <div>Confidence: {activeChat.confidence}%</div>
            <div className="mt-2 text-yellow-600 font-medium">
              ⏳ Pending Clinical Review
            </div>
          </div>
        )}

        {/* CHAT */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-4">
          {activeChat.messages.map((msg, index) => (
            <div
              key={index}
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
              }`}
            >
              {session.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}