"use client";

import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
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

  // ✅ New Chat
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

    const messageToSend = input; // 🔥 Save before clearing

    const userMessage: Message = {
      role: "user",
      content: messageToSend,
    };

    // Update chat immediately
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeChatId
          ? {
              ...session,
              title:
                session.messages.length === 0
                  ? messageToSend.slice(0, 25)
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
        body: JSON.stringify({ symptoms: messageToSend }), // 🔥 use saved value
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        content: data.reply || "No response from AI.",
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
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeChatId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  { role: "ai", content: "Something went wrong." },
                ],
              }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enter key support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex bg-[#f4f9ff] overflow-hidden"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* ================= CHAT AREA ================= */}
      <div className="flex flex-col flex-1 p-8 h-full">

        <h1 className="text-3xl font-bold mb-6">
          AI Health Consultation
        </h1>

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
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-2xl ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500 animate-pulse">
              AI is analyzing...
            </p>
          )}
        </div>

        {/* INPUT AREA */}
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

      {/* ================= SIDEBAR ================= */}
      <div className="w-[300px] bg-white border-l p-6 flex flex-col h-full">
        <button
          onClick={handleNewChat}
          className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + New Chat
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Your Chats
        </h2>

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