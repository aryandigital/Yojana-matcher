// app/api/match/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSchemes, UserProfile } from "@/lib/schemes";

// Initialize once at module scope (not per-request) to avoid re-instantiation overhead
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a strict JSON data extractor for an Indian government scheme eligibility checker.

The user will describe themselves in natural language (Hindi, English, or Hinglish). Extract the following fields and output ONLY a raw JSON object — no markdown fences, no explanations, no extra text.

Required JSON schema:
{
  "age": number,          // integer age in years
  "gender": string,       // "male" | "female" | "other"
  "state": string,        // Indian state name e.g. "Maharashtra". Use "unknown" if not mentioned.
  "income_lpa": number,   // annual household income in Lakhs Per Annum (decimal ok). If monthly given, multiply by 12 and convert. Default: 5 if not mentioned.
  "category": string,     // "general" | "OBC" | "SC" | "ST". Default: "general" if not mentioned.
  "education": string     // highest qualification e.g. "10th pass", "12th pass", "graduation", "postgraduate". Default: "unknown".
}

Rules:
- Output ONLY the JSON object. Zero other characters.
- Never add markdown, backticks, or code fences.
- Use your best inference for missing values.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userText } = body as { userText?: string };

    // Input validation
    if (!userText || typeof userText !== "string") {
      return NextResponse.json(
        { error: "userText field is required." },
        { status: 400 }
      );
    }
    const trimmed = userText.trim();
    if (trimmed.length < 10) {
      return NextResponse.json(
        { error: "Please describe yourself in a bit more detail (age, gender, income, etc.)." },
        { status: 400 }
      );
    }
    if (trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Input too long. Please keep it under 2,000 characters." },
        { status: 400 }
      );
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.1,         // Low temp = deterministic extraction
        maxOutputTokens: 256,     // Profile JSON is tiny
        // Forces the model to return valid JSON — eliminates parse failures
        // Correct field name in @google/generative-ai SDK
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(trimmed);
    const rawText = result.response.text().trim();

    // Belt-and-suspenders: strip any accidental markdown fences
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Parse & validate
    let profile: UserProfile;
    try {
      profile = JSON.parse(cleaned);
    } catch {
      console.error("[Yojana] JSON parse failed. Raw LLM output:", rawText);
      return NextResponse.json(
        {
          error:
            "Could not understand your description. Please try rephrasing and include your age, income, and category.",
        },
        { status: 422 }
      );
    }

    // Coerce types defensively
    profile.age = Number(profile.age) || 0;
    profile.income_lpa = Number(profile.income_lpa) || 0;
    profile.gender = String(profile.gender || "unknown").toLowerCase();
    profile.category = String(profile.category || "general").toLowerCase();
    profile.state = String(profile.state || "unknown");
    profile.education = String(profile.education || "unknown");

    const matchedSchemes = matchSchemes(profile);

    return NextResponse.json(
      { profile, schemes: matchedSchemes },
      {
        status: 200,
        headers: {
          // Prevent caching of personal responses
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: unknown) {
    console.error("[Yojana] API error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
