// app/api/match/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSchemes, UserProfile } from "@/lib/schemes";

// Singleton — avoid re-instantiation on every hot request
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─────────────────────────────────────────────────────────────────────────────
// System prompt: ultra-explicit, includes worked examples to anchor output
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You extract profile data from text and return ONLY a JSON object.

INPUT: A user describing themselves in English, Hindi, or Hinglish.

OUTPUT FORMAT — return EXACTLY this JSON structure, nothing else:
{"age":NUMBER,"gender":"male"|"female"|"other","state":"STATE_NAME","income_lpa":NUMBER,"category":"general"|"OBC"|"SC"|"ST","education":"QUALIFICATION"}

RULES:
1. Output must start with { and end with }. No markdown, no backticks, no explanation.
2. age: integer years. If not mentioned, use 25.
3. gender: infer from cues ("ladki"=female, "mahila"=female). Default "male".
4. state: Indian state name in English. Default "unknown".
5. income_lpa: annual income in Lakhs Per Annum. If unemployed or not mentioned, use 1.
6. category: social category. Default "general".
7. education: e.g. "10th pass", "12th pass", "graduation", "postgraduate". Default "12th pass".

EXAMPLES:
Input: "46 year old general category working at private company with annual package of 5 LPA. Want to start a business"
Output: {"age":46,"gender":"male","state":"unknown","income_lpa":5,"category":"general","education":"graduation"}

Input: "I am 24 unemployed want to start a business"
Output: {"age":24,"gender":"male","state":"unknown","income_lpa":1,"category":"general","education":"12th pass"}

Input: "24 saal ki SC category ki ladki hoon Bihar se, 1.8 LPA income, graduation complete ki"
Output: {"age":24,"gender":"female","state":"Bihar","income_lpa":1.8,"category":"SC","education":"graduation"}`;

// ─────────────────────────────────────────────────────────────────────────────
// Robust JSON extractor — handles truncated / wrapped / fenced responses
// ─────────────────────────────────────────────────────────────────────────────
function extractJSON(raw: string): UserProfile | null {
  // 1. Strip markdown fences
  let text = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```$/im, "").trim();

  // 2. Try direct parse first
  try { return JSON.parse(text) as UserProfile; } catch { /* fall through */ }

  // 3. Extract first {...} block (handles leading/trailing prose)
  const match = text.match(/\{[\s\S]*?\}/);
  if (match) {
    try { return JSON.parse(match[0]) as UserProfile; } catch { /* fall through */ }
  }

  // 4. Try greedy match (nested objects)
  const greedyMatch = text.match(/\{[\s\S]*\}/);
  if (greedyMatch) {
    try { return JSON.parse(greedyMatch[0]) as UserProfile; } catch { /* fall through */ }
  }

  // 5. Repair common truncation: add closing brace
  if (text.startsWith("{") && !text.endsWith("}")) {
    try { return JSON.parse(text + "}") as UserProfile; } catch { /* fall through */ }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyword fallback — if Gemini fails entirely, infer from text patterns
// This ensures ZERO "Something went wrong" errors for reasonable inputs
// ─────────────────────────────────────────────────────────────────────────────
function buildFallbackProfile(text: string): UserProfile {
  const t = text.toLowerCase();

  const ageMatch = t.match(/\b(1[5-9]|[2-9][0-9])\b/);
  const age = ageMatch ? parseInt(ageMatch[1]) : 25;

  const gender = /\b(female|woman|girl|ladki|mahila|she|her)\b/.test(t) ? "female" : "male";

  const lpaMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)/);
  const monthlyMatch = t.match(/(\d+(?:,\d+)?)\s*(?:per month|monthly|mahine)/);
  let income_lpa = 1;
  if (lpaMatch) {
    income_lpa = parseFloat(lpaMatch[1]);
  } else if (monthlyMatch) {
    income_lpa = parseFloat(monthlyMatch[1].replace(",", "")) * 12 / 100000;
  } else if (!t.includes("unemployed")) {
    income_lpa = 3;
  }

  const category = /\bsc\b|scheduled caste/.test(t) ? "SC"
    : /\bst\b|scheduled tribe/.test(t) ? "ST"
    : /\bobc\b/.test(t) ? "OBC"
    : "general";

  const stateMap: Record<string, string> = {
    "up": "Uttar Pradesh", "mp": "Madhya Pradesh", "maharashtra": "Maharashtra",
    "delhi": "Delhi", "uttar pradesh": "Uttar Pradesh", "bihar": "Bihar",
    "rajasthan": "Rajasthan", "gujarat": "Gujarat", "karnataka": "Karnataka",
    "tamil nadu": "Tamil Nadu", "telangana": "Telangana", "west bengal": "West Bengal",
    "punjab": "Punjab", "haryana": "Haryana", "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh", "assam": "Assam", "odisha": "Odisha",
    "jharkhand": "Jharkhand", "uttarakhand": "Uttarakhand",
  };
  const foundState = Object.keys(stateMap).find(s => t.includes(s));
  const state = foundState ? stateMap[foundState] : "unknown";

  const education = /post\s?grad|master|mba|m\.tech|phd/.test(t) ? "postgraduate"
    : /graduat|bachelor|b\.tech|b\.sc|degree/.test(t) ? "graduation"
    : /12th|hsc|higher secondary|\+2/.test(t) ? "12th pass"
    : /10th|ssc|matriculat/.test(t) ? "10th pass"
    : "12th pass";

  return { age, gender, state, income_lpa, category, education };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/match
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userText } = body as { userText?: string };

    if (!userText || typeof userText !== "string") {
      return NextResponse.json({ error: "userText field is required." }, { status: 400 });
    }

    const trimmed = userText.trim();

    if (trimmed.length < 3) {
      return NextResponse.json({ error: "Please tell us a little about yourself." }, { status: 400 });
    }
    if (trimmed.length > 2000) {
      return NextResponse.json({ error: "Input too long. Please keep it under 2,000 characters." }, { status: 400 });
    }

    // ── Call Gemini ───────────────────────────────────────────────────────────
    // gemini-2.0-flash: stable non-thinking model — predictable JSON output
    // gemini-2.5-flash is a THINKING model that burns token budget on reasoning
    // before the JSON, causing our 256-token output limit to truncate the response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0,          // Fully deterministic
        maxOutputTokens: 512,    // Enough for JSON + any accidental wrapper text
        responseMimeType: "application/json",
      },
    });

    let profile: UserProfile | null = null;
    let usedFallback = false;

    try {
      const result = await model.generateContent(trimmed);
      const rawText = result.response.text();
      profile = extractJSON(rawText);

      if (!profile) {
        console.warn("[Yojana] extractJSON failed, using keyword fallback. Raw:", rawText.slice(0, 200));
        profile = buildFallbackProfile(trimmed);
        usedFallback = true;
      }
    } catch (geminiErr) {
      console.error("[Yojana] Gemini call failed, using keyword fallback:", geminiErr);
      profile = buildFallbackProfile(trimmed);
      usedFallback = true;
    }

    // ── Defensive coercion ────────────────────────────────────────────────────
    profile.age = Math.max(0, Math.min(120, Number(profile.age) || 25));
    profile.income_lpa = Math.max(0, Number(profile.income_lpa) || 1);
    profile.gender = String(profile.gender || "male").toLowerCase();
    profile.category = String(profile.category || "general");
    profile.state = String(profile.state || "unknown");
    profile.education = String(profile.education || "12th pass");

    const matchedSchemes = matchSchemes(profile);

    return NextResponse.json(
      { profile, schemes: matchedSchemes, usedFallback },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("[Yojana] Unhandled error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
