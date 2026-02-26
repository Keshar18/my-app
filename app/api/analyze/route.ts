import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "API key missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a professional AI doctor.\n\nUser symptoms: ${symptoms}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data);

    if (!response.ok) {
      return NextResponse.json(
        { reply: data.error?.message || "Gemini error." },
        { status: 500 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { reply: "Server crashed." },
      { status: 500 }
    );
  }
}