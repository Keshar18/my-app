"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface Message {
  role: "user" | "ai";
  content: string | string[];
  isMedical?: boolean; // per-message bullet control
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
  const [consultationRating, setConsultationRating] = useState<number | null>(null);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 1, title: "New Chat", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = sessions.find((s) => s.id === activeChatId)!;

  const chatStarted = activeChat.messages.some((m) => m.role === "ai");

  // Always get latest user message
  const latestUserMessage =
    [...activeChat.messages]
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
        lower.includes("how") ||
        lower.includes("what") ||
        lower.includes("should") ||
        lower.includes("problem") ||
        lower.includes("gas") ||
        lower.includes("headache") ||
        lower.includes("chest")
      )
    );
  };

  // ---------------- EMERGENCY ----------------
  const isEmergency = () => {
    const text = problemText.toLowerCase();
    return (
      text.includes("chest pain") ||
      text.includes("heart attack") ||
      text.includes("stroke") ||
      text.includes("breathing difficulty")
    );
  };

  // ---------------- FEEDBACK ----------------
  const getFeedback = () => {
    const text = problemText.toLowerCase();

    if (text.includes("headache")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "My headache reduced within 2 days." },
        { stars: "⭐⭐⭐⭐", text: "Hydration advice worked well." },
      ];
    }

    if (text.includes("chest")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Emergency alert helped me act quickly." },
        { stars: "⭐⭐⭐⭐", text: "Consulted doctor immediately." },
      ];
    }

    if (text.includes("gas")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Diet change improved digestion." },
        { stars: "⭐⭐⭐⭐", text: "Fiber advice was helpful." },
      ];
    }

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

    doc.setFontSize(18);
    doc.text("HolistiDoc AI Consultation Summary", 105, y, { align: "center" });

    y += 15;

    doc.setFontSize(12);
    doc.text("Your Reported Problem:", 20, y);
    y += 8;
    doc.text(userMessage.content as string, 20, y, { maxWidth: 170 });

    y += 20;

    doc.text("Recommended Guidance:", 20, y);
    y += 8;

    aiMessage.content.forEach((item) => {
      doc.text(`• ${item}`, 25, y, { maxWidth: 165 });
      y += 8;
    });

    doc.setFontSize(9);
    doc.text(
      "HolistiDoc AI provides informational guidance only and does not replace professional medical diagnosis.",
      20,
      280,
      { maxWidth: 170 }
    );

    doc.save("holistidoc-summary.pdf");
  };

  // ---------------- NEW CHAT ----------------
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setSessions((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setConsultationRating(null);
    setShowHistory(false);
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

      const aiMessage: Message = {
        role: "ai",
        content: Array.isArray(data.reply)
          ? data.reply
          : [data.reply],
        isMedical: isMedicalQuery(currentInput),
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

        {/* DISCLAIMER (Always Visible) */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4 text-sm text-gray-700">
          <strong>Medical Disclaimer:</strong> HolistiDoc AI provides informational
          guidance only and does not replace professional medical diagnosis,
          treatment, or emergency services.
        </div>

        {/* EMERGENCY ALERT */}
        {isEmergency() && (
          <div className="bg-red-600 text-white p-4 rounded-xl mb-4 animate-pulse">
            🚨 EMERGENCY ALERT: Seek immediate medical help.
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">
          AI Health Consultation
        </h1>

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
            onClick={handleNewChat}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
            +
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xl">
            🕘
          </button>
        </div>

        {chatStarted && !showHistory && isMedicalQuery(problemText) && (
          <>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-sm">
                ⭐ Rate This Consultation
              </h3>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setConsultationRating(star)}
                    className={`cursor-pointer text-xl ${
                      consultationRating && consultationRating >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={generatePDF}
              className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg">
              Download Summary PDF
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Community Feedback
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4">
              {feedbackList.map((fb, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded-lg">
                  <div className="text-yellow-500 mb-1">{fb.stars}</div>
                  <p className="text-sm">{fb.text}</p>
                </div>
              ))}
            </div>
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