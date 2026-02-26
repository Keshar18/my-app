import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `
You are a professional medical assistant.

IMPORTANT:
- Return response ONLY in JSON format.
- Format must be:

{
  "advice": [
    "point 1",
    "point 2",
    "point 3"
  ]
}

- Maximum 5 short bullet points.
- No paragraphs.
- No extra text outside JSON.
            `,
          },
          {
            role: "user",
            content: symptoms,
          },
        ],
      }),
    });

    const data = await response.json();

    const aiText = data.choices?.[0]?.message?.content;

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      return NextResponse.json({
        reply: ["AI formatting error. Please try again."],
      });
    }

    return NextResponse.json({
      reply: parsed.advice,
    });

  } catch (error) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { reply: ["Something went wrong."] },
      { status: 500 }
    );
  }
}