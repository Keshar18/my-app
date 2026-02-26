"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface Message {
  role: "user" | "ai";
  content: string | string[];
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
    { id: 1, title: "New Chat", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);

  const activeChat = sessions.find((s) => s.id === activeChatId)!;

  // ✅ Create New Chat
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setSessions((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  // ✅ Send Message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

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

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: input }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        content: Array.isArray(data.reply)
          ? data.reply
          : ["AI formatting error. Please try again."],
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
      const errorMessage: Message = {
        role: "ai",
        content: ["Something went wrong. Please try again."],
      };

      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? {
                ...session,
                messages: [...session.messages, errorMessage],
              }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enter Key Support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Emergency Detection
  const isEmergency = (messages: Message[]) => {
    const emergencyKeywords = [
      "emergency",
      "hospital",
      "heart attack",
      "chest pain",
      "breathing difficulty",
      "stroke",
      "unconscious",
      "severe bleeding",
    ];

    const aiMessage = [...messages]
      .reverse()
      .find((m) => m.role === "ai");

    if (!aiMessage || !Array.isArray(aiMessage.content)) return false;

    return aiMessage.content.some((text) =>
      emergencyKeywords.some((keyword) =>
        text.toLowerCase().includes(keyword)
      )
    );
  };

  // ✅ PDF Generator
  const generatePDF = () => {
    const doc = new jsPDF();

    const userMessage = activeChat.messages.find(
      (m) => m.role === "user"
    );

    const aiMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === "ai");

    if (!userMessage || !aiMessage || !Array.isArray(aiMessage.content)) {
      alert("Please complete a consultation first.");
      return;
    }

    const problem = userMessage.content as string;
    const solutions = aiMessage.content;

    const followUpDays = 5;
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    let y = 20;

    doc.setFontSize(16);
    doc.text("HolistiDoc AI - Consultation Summary", 20, y);

    y += 20;
    doc.setFontSize(12);
    doc.text(`Problem: ${problem}`, 20, y);

    y += 20;
    doc.text("Solutions:", 20, y);
    y += 10;

    solutions.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 10;
    });

    y += 10;
    doc.text(
      `Consult Again On: ${followUpDate.toDateString()}`,
      20,
      y
    );

    doc.save("holistidoc-summary.pdf");
  };

  return (
    <div
      className="flex bg-[#f4f9ff] overflow-hidden w-full"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* LEFT SIDE - CHAT */}
      <div className="flex flex-col w-4/5 p-6 h-full">
        
        {/* 🚨 Emergency Alert */}
        {isEmergency(activeChat.messages) && (
          <div className="bg-red-600 text-white p-4 rounded-xl mb-4 shadow-lg">
            🚨 EMERGENCY ALERT: Please seek immediate medical attention or call emergency services immediately.
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">
          AI Health Consultation
        </h1>

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto space-y-4">
          {activeChat.messages.length === 0 && (
            <p className="text-gray-400">
              Start describing your symptoms...
            </p>
          )}

          {activeChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-xl max-w-xl ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.role === "ai" && Array.isArray(msg.content) ? (
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
            className="px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 transition"
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
          Your Chats
        </h2>

        <button
          onClick={generatePDF}
          className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Download Summary PDF
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveChatId(session.id)}
              className={`p-3 rounded-lg cursor-pointer text-sm truncate ${
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