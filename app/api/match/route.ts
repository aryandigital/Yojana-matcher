import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchSchemes, UserProfile } from "@/lib/schemes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Extract profile data from text. Return ONLY a JSON object — no markdown, no backticks.
Schema: {"age":NUMBER,"gender":"male"|"female"|"other","state":"STATE","income_lpa":NUMBER,"category":"general"|"OBC"|"SC"|"ST","education":"LEVEL"}
Rules:
- age: integer 0-100, default 25
- gender: default "male"
- state: Indian state in English, default "unknown"
- income_lpa: annual LPA, default 1
- category: default "general"
- education: "below 10th","10th pass","12th pass","graduation","postgraduate", default "12th pass"
Only output JSON. No other text.`;

function extractJSON(raw: string): UserProfile | null {
  const cleaned = raw.replace(/```json\s*/i,"").replace(/```\s*$/,"").trim();
  for (const attempt of [cleaned, cleaned.match(/\{[\s\S]*\}/)?.[0] ?? ""]) {
    try { if (attempt) return JSON.parse(attempt) as UserProfile; } catch { /**/ }
  }
  return null;
}

function buildFallbackProfile(text: string): UserProfile {
  const t = text.toLowerCase();
  const ageM = t.match(/\b(1[5-9]|[2-9][0-9])\b/);
  return {
    age:         ageM ? parseInt(ageM[1]) : 25,
    gender:      /\b(female|woman|girl|ladki|mahila)\b/.test(t) ? "female" : "male",
    state:       ["maharashtra","delhi","uttar pradesh","up","bihar","rajasthan","gujarat","karnataka","tamil nadu","telangana","west bengal","punjab","haryana","kerala","assam","odisha"].find(s => t.includes(s.toLowerCase())) ?? "unknown",
    income_lpa:  (() => { const m = t.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)/); return m ? parseFloat(m[1]) : (t.includes("unemployed")||t.includes("student") ? 0 : 3); })(),
    category:    /\bsc\b|scheduled caste/.test(t) ? "SC" : /\bst\b|scheduled tribe/.test(t) ? "ST" : /\bobc\b/.test(t) ? "OBC" : "general",
    education:   /post.*grad|master|mba|phd/.test(t) ? "postgraduate" : /graduat|bachelor|b\.tech|degree/.test(t) ? "graduation" : /12th|hsc/.test(t) ? "12th pass" : /10th|ssc/.test(t) ? "10th pass" : "12th pass",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userText, purpose, employment } = body as { userText?: string; purpose?: string; employment?: string };

    if (!userText?.trim() || userText.trim().length < 3)
      return NextResponse.json({ error:"Please provide your profile details." }, { status:400 });

    const model = genAI.getGenerativeModel({
      model:"gemini-2.0-flash",
      systemInstruction:SYSTEM_PROMPT,
      generationConfig:{ temperature:0, maxOutputTokens:256, responseMimeType:"application/json" },
    });

    let profile: UserProfile;
    try {
      const result = await model.generateContent(userText.trim());
      profile = extractJSON(result.response.text()) ?? buildFallbackProfile(userText);
    } catch {
      profile = buildFallbackProfile(userText);
    }

    // Sanitise
    profile.age        = Math.max(0, Math.min(120, Number(profile.age) || 25));
    profile.income_lpa = Math.max(0, Number(profile.income_lpa) ?? 1);
    profile.gender     = String(profile.gender || "male").toLowerCase();
    profile.category   = String(profile.category || "general");
    profile.state      = String(profile.state || "unknown");
    profile.education  = String(profile.education || "12th pass");
    profile.purpose    = typeof purpose === "string" ? purpose : "all";
    profile.employment = typeof employment === "string" ? employment : "";

    const schemes = matchSchemes(profile);

    return NextResponse.json({ profile, schemes }, {
      status:200, headers:{ "Cache-Control":"no-store" }
    });
  } catch (err) {
    console.error("[Yojana API]", err);
    return NextResponse.json({ error:"Unexpected error. Please try again." }, { status:500 });
  }
}
