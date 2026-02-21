import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSchemes, UserProfile } from "@/lib/schemes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You extract profile data from text and return ONLY a JSON object.
INPUT: A user describing themselves in English, Hindi, or Hinglish.
OUTPUT: Exactly this JSON, nothing else:
{"age":NUMBER,"gender":"male"|"female"|"other","state":"STATE_NAME","income_lpa":NUMBER,"category":"general"|"OBC"|"SC"|"ST","education":"QUALIFICATION"}
RULES:
1. Start with { end with }. No markdown, no backticks.
2. age: integer years. Default 25.
3. gender: infer from cues. Default "male".
4. state: Indian state in English. Default "unknown".
5. income_lpa: annual income in LPA. If unemployed/not mentioned, use 1.
6. category: Default "general".
7. education: e.g. "10th pass","12th pass","graduation","postgraduate". Default "12th pass".
EXAMPLES:
Input: "26-35 year old female, OBC, income ₹2.5-5 LPA, graduation, from Maharashtra. Goal is business."
Output: {"age":30,"gender":"female","state":"Maharashtra","income_lpa":3.5,"category":"OBC","education":"graduation"}
Input: "21 year old male, general, no income, 12th pass, unknown state. Goal farming."
Output: {"age":21,"gender":"male","state":"unknown","income_lpa":1,"category":"general","education":"12th pass"}`;

function extractJSON(raw: string): UserProfile | null {
  let text = raw.replace(/^```(?:json)?\s*/im,"").replace(/\s*```$/im,"").trim();
  try { return JSON.parse(text) as UserProfile; } catch { /**/ }
  const m1 = text.match(/\{[\s\S]*?\}/);
  if (m1) { try { return JSON.parse(m1[0]) as UserProfile; } catch { /**/ } }
  const m2 = text.match(/\{[\s\S]*\}/);
  if (m2) { try { return JSON.parse(m2[0]) as UserProfile; } catch { /**/ } }
  if (text.startsWith("{") && !text.endsWith("}")) {
    try { return JSON.parse(text + "}") as UserProfile; } catch { /**/ }
  }
  return null;
}

function buildFallbackProfile(text: string): UserProfile {
  const t = text.toLowerCase();
  const ageMatch = t.match(/\b(1[5-9]|[2-9][0-9])\b/);
  const age = ageMatch ? parseInt(ageMatch[1]) : 25;
  const gender = /\b(female|woman|girl|ladki|mahila|she|her)\b/.test(t) ? "female" : "male";
  const lpaMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)/);
  const income_lpa = lpaMatch ? parseFloat(lpaMatch[1]) : t.includes("unemployed") ? 0 : 3;
  const category = /\bsc\b|scheduled caste/.test(t) ? "SC"
    : /\bst\b|scheduled tribe/.test(t) ? "ST"
    : /\bobc\b/.test(t) ? "OBC" : "general";
  const stateMap: Record<string,string> = {
    "up":"Uttar Pradesh","mp":"Madhya Pradesh","maharashtra":"Maharashtra","delhi":"Delhi",
    "bihar":"Bihar","rajasthan":"Rajasthan","gujarat":"Gujarat","karnataka":"Karnataka",
    "tamil nadu":"Tamil Nadu","telangana":"Telangana","west bengal":"West Bengal",
    "punjab":"Punjab","haryana":"Haryana","kerala":"Kerala","assam":"Assam","odisha":"Odisha",
  };
  const foundState = Object.keys(stateMap).find(s => t.includes(s));
  const state = foundState ? stateMap[foundState] : "unknown";
  const education = /post\s?grad|master|mba|m\.tech|phd/.test(t) ? "postgraduate"
    : /graduat|bachelor|b\.tech|degree/.test(t) ? "graduation"
    : /12th|hsc|higher secondary/.test(t) ? "12th pass"
    : /10th|ssc|matriculat/.test(t) ? "10th pass" : "12th pass";
  return { age, gender, state, income_lpa, category, education };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userText, purpose } = body as { userText?: string; purpose?: string };

    if (!userText || typeof userText !== "string") {
      return NextResponse.json({ error: "userText field is required." }, { status: 400 });
    }
    const trimmed = userText.trim();
    if (trimmed.length < 3) {
      return NextResponse.json({ error: "Please tell us a little about yourself." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { temperature: 0, maxOutputTokens: 512, responseMimeType: "application/json" },
    });

    let profile: UserProfile | null = null;
    try {
      const result = await model.generateContent(trimmed);
      const rawText = result.response.text();
      profile = extractJSON(rawText);
      if (!profile) {
        profile = buildFallbackProfile(trimmed);
      }
    } catch {
      profile = buildFallbackProfile(trimmed);
    }

    // Defensive coercion
    profile.age          = Math.max(0, Math.min(120, Number(profile.age) || 25));
    profile.income_lpa   = Math.max(0, Number(profile.income_lpa) ?? 1);
    profile.gender       = String(profile.gender || "male").toLowerCase();
    profile.category     = String(profile.category || "general");
    profile.state        = String(profile.state || "unknown");
    profile.education    = String(profile.education || "12th pass");
    profile.purpose      = typeof purpose === "string" ? purpose : "all";

    const schemes = matchSchemes(profile);

    return NextResponse.json(
      { profile, schemes },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("[Yojana] error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
