import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: "Symptoms are required." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a professional AI holistic healthcare assistant trained in general medicine and preventive healthcare.

Respond ONLY in valid JSON format:

{
  "possibleCauses": "",
  "naturalRemedies": "",
  "lifestyleAdvice": "",
  "precautions": "",
  "followUpDays": ""
}

Rules:
- Do NOT prescribe strong medicines.
- Encourage consulting real doctor if serious.
- Keep tone professional and responsible.
- followUpDays should be a number only.
- Output ONLY valid JSON.

User symptoms:
${symptoms}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return NextResponse.json(
      { error: error.message || "AI failed." },
      { status: 500 }
    );
  }
}