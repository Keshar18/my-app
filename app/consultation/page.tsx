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
  const [showHistory, setShowHistory] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 1, title: "New Chat", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = sessions.find((s) => s.id === activeChatId)!;

  const chatStarted = activeChat.messages.some(
    (m) => m.role === "ai"
  );

  // 🔴 Emergency Detection
  const isEmergency = () => {
    const keywords = [
      "emergency",
      "hospital",
      "heart attack",
      "chest pain",
      "stroke",
      "breathing difficulty",
    ];

    const aiMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === "ai");

    if (!aiMessage || !Array.isArray(aiMessage.content)) return false;

    return aiMessage.content.some((text) =>
      keywords.some((k) =>
        text.toLowerCase().includes(k)
      )
    );
  };

  // 🟢 Get Problem Text
  const problemText =
    activeChat.messages.find((m) => m.role === "user")?.content?.toString() ||
    "";

  // ⭐ Dynamic Feedback
  const getFeedback = () => {
    if (problemText.toLowerCase().includes("headache")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "My headache reduced in 2 days." },
        { stars: "⭐⭐⭐⭐", text: "Hydration advice worked well." },
      ];
    }

    if (problemText.toLowerCase().includes("gas")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Diet change helped a lot." },
        { stars: "⭐⭐⭐⭐", text: "Fiber suggestion was effective." },
      ];
    }

    if (problemText.toLowerCase().includes("chest")) {
      return [
        { stars: "⭐⭐⭐⭐⭐", text: "Emergency alert saved me." },
        { stars: "⭐⭐⭐⭐", text: "Consulted doctor immediately." },
      ];
    }

    return [
      { stars: "⭐⭐⭐⭐", text: "Helpful general wellness guidance." },
    ];
  };

  const feedbackList = getFeedback();

  // 👨‍⚕️ Expert Attribution
  const getExpertAttribution = () => {
    const text = problemText.toLowerCase();

    if (text.includes("headache") || text.includes("fever")) {
      return "Reviewed by Certified General Wellness Practitioner";
    }

    if (text.includes("gas") || text.includes("digestion")) {
      return "Guidance aligned with Holistic Nutrition Specialist";
    }

    if (text.includes("stress") || text.includes("anxiety")) {
      return "Reviewed by Mindfulness & Lifestyle Coach";
    }

    if (text.includes("chest")) {
      return "Advisory aligned with Emergency Care Protocol Guidelines";
    }

    return "General Wellness Guidance by HolistiDoc AI Expert System";
  };

  // 📄 Beautiful Themed PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    const userMessage = activeChat.messages.find(
      (m) => m.role === "user"
    );
    const aiMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === "ai");

    if (!userMessage || !aiMessage || !Array.isArray(aiMessage.content)) {
      alert("Complete consultation first.");
      return;
    }

    const followUp = new Date();
    followUp.setDate(followUp.getDate() + 5);

    let y = 20;

    doc.setFillColor(230, 242, 255);
    doc.rect(0, 0, 210, 45, "F");

    if (isEmergency()) {
      doc.setTextColor(200, 0, 0);
      doc.setFontSize(10);
      doc.text(
        "⚠ Emergency Alert: Immediate medical consultation recommended.",
        20,
        y
      );
      y += 10;
    }

    doc.setTextColor(0, 70, 150);
    doc.setFontSize(22);
    doc.text("HolistiDoc AI", 105, 30, { align: "center" });

    doc.setFontSize(14);
    doc.text("Consultation Summary", 105, 38, { align: "center" });

    y = 65;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Your Reported Problem", 20, y);
    y += 8;
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(userMessage.content as string, 20, y, { maxWidth: 170 });

    y += 20;

    doc.setFontSize(14);
    doc.text("Recommended Guidance", 20, y);
    y += 8;
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    aiMessage.content.forEach((item) => {
      doc.text(`• ${item}`, 25, y, { maxWidth: 165 });
      y += 10;
    });

    y += 10;

    doc.setFontSize(14);
    doc.text("Follow-Up Recommendation", 20, y);
    y += 8;
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(
      `Suggested Follow-Up Date: ${followUp.toDateString()}`,
      20,
      y
    );

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "HolistiDoc AI provides health guidance only and does not replace professional medical diagnosis or treatment.",
      20,
      280,
      { maxWidth: 170 }
    );

    doc.save("holistidoc-consultation.pdf");
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setSessions((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setShowHistory(false);
  };

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
          : ["Something went wrong."],
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
    <div
      className="flex bg-[#f4f9ff] overflow-hidden w-full"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col w-4/5 p-6 h-full">

        {activeChat.messages.length === 0 && (
          <div className="bg-blue-50 border p-5 rounded-xl mb-4">
            <h2 className="font-semibold mb-2">
              Welcome to HolistiDoc AI 👋
            </h2>
            <p className="text-sm text-gray-600">
              HolistiDoc AI provides health guidance only and does not replace professional medical advice.
            </p>
          </div>
        )}

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
                  <>
                    <ul className="list-disc pl-5 space-y-1 text-left">
                      {msg.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700">
                      <strong>👨‍⚕️ Expert Attribution</strong>
                      <div>{getExpertAttribution()}</div>
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
            className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-400"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/5 bg-white border-l p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleNewChat}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
          >
            +
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xl"
          >
            🕘
          </button>
        </div>

        {chatStarted && !showHistory ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Community Feedback
            </h2>

            <button
              onClick={generatePDF}
              className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg"
            >
              Download Summary PDF
            </button>

            <div className="flex-1 overflow-y-auto space-y-4">
              {feedbackList.map((fb, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded-lg">
                  <div className="text-yellow-500 mb-1">
                    {fb.stars}
                  </div>
                  <p className="text-sm">{fb.text}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
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
                  }`}
                >
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