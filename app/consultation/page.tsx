"use client";

import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string | string[];
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

  // -----------------------------
  // 🔥 RISK SCORING
  // -----------------------------
  const calculateRisk = (text: string): RiskLevel => {
    const lower = text.toLowerCase();

    if (
      lower.includes("chest pain") ||
      lower.includes("stroke") ||
      lower.includes("heart attack") ||
      lower.includes("breathing difficulty")
    ) {
      return "HIGH";
    }

    if (
      lower.includes("fever") ||
      lower.includes("infection") ||
      lower.includes("severe pain")
    ) {
      return "MODERATE";
    }

    return "LOW";
  };

  // -----------------------------
  // 🔥 CONFIDENCE LOGIC
  // -----------------------------
  const calculateConfidence = (risk: RiskLevel) => {
    if (risk === "HIGH") return 60;
    if (risk === "MODERATE") return 75;
    return 90;
  };

  // -----------------------------
  // 🆕 NEW CHAT
  // -----------------------------
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

  // -----------------------------
  // 📤 SEND MESSAGE
  // -----------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    // Add user message immediately
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

    setLoading(true);
    const userInput = input;
    setInput("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userInput }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        content: Array.isArray(data.reply)
          ? data.reply
          : ["Something went wrong."],
      };

      // 🔥 Calculate risk & confidence
      const risk = calculateRisk(userInput);
      const confidence = calculateConfidence(risk);

      let status: ValidationStatus = "PENDING_REVIEW";

      if (risk === "HIGH") {
        status = "ESCALATED";
      }

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? {
                ...session,
                messages: [...session.messages, aiMessage],
                riskLevel: risk,
                confidence: confidence,
                status: status,
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

  // -----------------------------
  // ⌨ ENTER KEY SUPPORT
  // -----------------------------
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
      className="flex bg-[#f4f9ff] w-full"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* LEFT CHAT AREA */}
      <div className="flex flex-col w-4/5 p-6 h-full">
        <h1 className="text-3xl font-bold mb-4">
          AI Health Consultation
        </h1>

        {/* 🔥 VALIDATION PANEL */}
        <div className="mb-4 p-4 rounded-xl bg-gray-100 text-sm shadow">
          <div className="font-medium mb-1">
            🤖 AI Generated Preliminary Guidance
          </div>
          <div>Risk Level: {activeChat.riskLevel}</div>
          <div>Confidence: {activeChat.confidence}%</div>
          <div>
            Status:{" "}
            {activeChat.status === "ESCALATED"
              ? "🚨 Escalated - Immediate Medical Attention Recommended"
              : activeChat.status === "PENDING_REVIEW"
              ? "⏳ Pending Clinical Review"
              : activeChat.status === "REVIEWED"
              ? "✔ Clinically Reviewed"
              : "AI Generated"}
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-4">
          {activeChat.messages.length === 0 && (
            <p className="text-gray-400">
              Start describing your symptoms...
            </p>
          )}

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

      {/* RIGHT CHAT HISTORY */}
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