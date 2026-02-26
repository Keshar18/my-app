import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms || symptoms.trim() === "") {
      return NextResponse.json(
        { reply: "Please describe your symptoms." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI medical assistant. Give general advice but do not provide final diagnosis.",
          },
          {
            role: "user",
            content: symptoms,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Groq response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { reply: data?.error?.message || "AI error occurred." },
        { status: 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content || "No response from AI.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { reply: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}