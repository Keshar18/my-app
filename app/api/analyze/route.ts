import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: "Symptoms are required." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a professional AI holistic healthcare assistant trained in general medicine and preventive healthcare.

Provide structured response in JSON format:

{
  "possibleCauses": "",
  "naturalRemedies": "",
  "lifestyleAdvice": "",
  "precautions": "",
  "followUpDays": ""
}

Rules:
- Do NOT prescribe strong medicines.
- Avoid exact prescription dosages.
- Always encourage consulting real doctor if symptoms are severe.
- Include follow-up recommendation in days.
- Be professional and medically responsible.
`
        },
        {
          role: "user",
          content: symptoms
        }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI failed to respond." },
      { status: 500 }
    );
  }
}