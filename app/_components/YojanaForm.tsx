"use client";

import { useState, useCallback } from "react";
import {
  Search, Loader2, ExternalLink, AlertCircle, CheckCircle2,
  ChevronRight, ChevronLeft, User, IndianRupee, MapPin,
  GraduationCap, Users, RefreshCw, Sparkles, Share2,
  PhoneCall, ChevronDown, TrendingUp, Star,
} from "lucide-react";
import type { Scheme, UserProfile } from "@/lib/schemes";
import { getMatchScore } from "@/lib/schemes";
import { tx, type Lang } from "@/lib/i18n";

// ─── Types ─────────────────────────────────────────────────────────
interface ApiResponse {
  profile?: UserProfile;
  schemes?: Scheme[];
  error?: string;
}

interface WizardData {
  purpose: string;
  age: number;
  gender: string;
  state: string;
  income_lpa: number;
  category: string;
  education: string;
}

const DEFAULT: WizardData = {
  purpose: "", age: 0, gender: "", state: "unknown",
  income_lpa: -1, category: "", education: "",
};

// ─── Step config ────────────────────────────────────────────────────
const STEPS = ["purpose","age","gender","category","income","education","state"] as const;
type Step = typeof STEPS[number];

const PURPOSES = [
  { value:"business",  emojiEn:"🚀", labelKey:"purposeBusiness" as const, color:"orange" },
  { value:"farming",   emojiEn:"🌾", labelKey:"purposeFarming"  as const, color:"green"  },
  { value:"education", emojiEn:"🎓", labelKey:"purposeEdu"      as const, color:"purple" },
  { value:"health",    emojiEn:"🏥", labelKey:"purposeHealth"   as const, color:"red"    },
  { value:"housing",   emojiEn:"🏠", labelKey:"purposeHousing"  as const, color:"blue"   },
  { value:"skill",     emojiEn:"⚙️", labelKey:"purposeSkill"    as const, color:"cyan"   },
  { value:"all",       emojiEn:"🌐", labelKey:"purposeAll"      as const, color:"gray"   },
];

const AGE_BANDS = [
  { label:{ en:"Under 18", hi:"18 से कम" },       emoji:"🧒", mid:14  },
  { label:{ en:"18 – 25",  hi:"18 – 25" },         emoji:"🎓", mid:21  },
  { label:{ en:"26 – 35",  hi:"26 – 35" },         emoji:"💼", mid:30  },
  { label:{ en:"36 – 50",  hi:"36 – 50" },         emoji:"🏠", mid:43  },
  { label:{ en:"51 – 60",  hi:"51 – 60" },         emoji:"🌿", mid:55  },
  { label:{ en:"60+",      hi:"60 से ऊपर" },        emoji:"🧓", mid:65  },
];

const GENDERS = [
  { label:{ en:"Male",   hi:"पुरुष" },  emoji:"👨", value:"male"   },
  { label:{ en:"Female", hi:"महिला" },  emoji:"👩", value:"female" },
  { label:{ en:"Other",  hi:"अन्य" },   emoji:"🧑", value:"other"  },
];

const CATEGORIES = [
  { label:{ en:"General", hi:"सामान्य" }, desc:{ en:"No reservation", hi:"कोई आरक्षण नहीं" }, emoji:"🏛️", value:"general" },
  { label:{ en:"OBC",     hi:"OBC" },     desc:{ en:"Other Backward Classes", hi:"अन्य पिछड़ा वर्ग" }, emoji:"📋", value:"OBC" },
  { label:{ en:"SC",      hi:"SC" },      desc:{ en:"Scheduled Caste", hi:"अनुसूचित जाति" }, emoji:"⚖️", value:"SC" },
  { label:{ en:"ST",      hi:"ST" },      desc:{ en:"Scheduled Tribe", hi:"अनुसूचित जनजाति" }, emoji:"🌿", value:"ST" },
];

const INCOME_BANDS = [
  { label:{ en:"No income",     hi:"कोई आमदनी नहीं" },  emoji:"🔍", value:0,    desc:{ en:"Unemployed / Student", hi:"बेरोजगार / छात्र" } },
  { label:{ en:"Under ₹1 LPA", hi:"₹1 लाख से कम" },    emoji:"💧", value:0.8,  desc:{ en:"Below poverty line", hi:"गरीबी रेखा से नीचे" } },
  { label:{ en:"₹1 – 2.5 LPA", hi:"₹1 – 2.5 लाख" },    emoji:"🌱", value:1.8,  desc:{ en:"Low income", hi:"कम आमदनी" } },
  { label:{ en:"₹2.5 – 5 LPA", hi:"₹2.5 – 5 लाख" },    emoji:"🌿", value:3.5,  desc:{ en:"Lower-middle", hi:"निम्न मध्यम वर्ग" } },
  { label:{ en:"₹5 – 10 LPA",  hi:"₹5 – 10 लाख" },      emoji:"💼", value:7.5,  desc:{ en:"Middle income", hi:"मध्यम आमदनी" } },
  { label:{ en:"₹10 – 18 LPA", hi:"₹10 – 18 लाख" },     emoji:"🏢", value:14,   desc:{ en:"Upper-middle", hi:"उच्च मध्यम वर्ग" } },
  { label:{ en:"Above ₹18 LPA",hi:"₹18 लाख से ऊपर" },   emoji:"🏆", value:25,   desc:{ en:"High income", hi:"उच्च आमदनी" } },
];

const EDUCATION_LEVELS = [
  { label:{ en:"Below 10th",      hi:"10वीं से कम" },    emoji:"📚", value:"below 10th"   },
  { label:{ en:"10th Pass",       hi:"10वीं पास" },       emoji:"📗", value:"10th pass"    },
  { label:{ en:"12th Pass",       hi:"12वीं पास" },       emoji:"📘", value:"12th pass"    },
  { label:{ en:"Graduation",      hi:"स्नातक" },          emoji:"🎓", value:"graduation"   },
  { label:{ en:"Post Graduation", hi:"परास्नातक" },       emoji:"🔬", value:"postgraduate" },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry","Jammu & Kashmir","Ladakh",
];

// ─── Sub-components ─────────────────────────────────────────────────

function OptionCard({ emoji, label, desc, selected, onClick }: {
  emoji: string; label: string; desc?: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 text-left active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-green-400
        ${selected ? "border-green-500 bg-green-50 shadow-md shadow-green-100" : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/40"}`}>
      <span className="text-2xl w-8 text-center flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-snug ${selected ? "text-green-700" : "text-gray-800"}`}>{label}</p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all flex-shrink-0
        ${selected ? "border-green-500 bg-green-500" : "border-gray-200"}`}>
        {selected && <span className="w-2.5 h-2.5 bg-white rounded-full block" />}
      </div>
    </button>
  );
}

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-400
          ${i < current ? "bg-green-500" : i === current ? "bg-green-300" : "bg-gray-100"}`} />
      ))}
    </div>
  );
}

function SummaryChip({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
      <Icon className="w-3 h-3 text-green-500 flex-shrink-0" />
      <span className="text-[11px] font-bold text-green-700 capitalize whitespace-nowrap">{value}</span>
    </div>
  );
}

function MatchBadge({ score, isTop, lang }: { score: number; isTop: boolean; lang: Lang }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black
      ${isTop ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
      {isTop ? <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> : <TrendingUp className="w-3 h-3" />}
      {isTop ? tx("topPick", lang) : `${tx("matchScore", lang)} ${score}%`}
    </div>
  );
}

function ApplySteps({ steps, lang }: {
  steps: Array<{ step: string; stepHi: string }>; lang: Lang;
}) {
  return (
    <div className="mt-1 space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{lang === "hi" ? s.stepHi : s.step}</p>
        </div>
      ))}
    </div>
  );
}

function SchemeCard({ scheme, profile, isTop, lang }: {
  scheme: Scheme; profile: UserProfile; isTop: boolean; lang: Lang;
}) {
  const [showSteps, setShowSteps] = useState(false);
  const score = getMatchScore(scheme, profile);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
      <div className={`h-1.5 ${isTop ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-green-400 to-emerald-400"}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider ${scheme.tagColor}`}>
                {lang === "hi" ? scheme.tagHi : scheme.tag}
              </span>
              <MatchBadge score={score} isTop={isTop} lang={lang} />
            </div>
            <h3 className="font-black text-gray-900 text-sm leading-snug">
              {lang === "hi" ? scheme.nameHi : scheme.name}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {lang === "hi" ? scheme.ministryHi : scheme.ministry}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          {lang === "hi" ? scheme.descriptionHi : scheme.description}
        </p>

        {/* Estimated benefit — big number, Japan-style */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl px-4 py-3 mb-3 text-white">
          <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-0.5">
            {tx("estBenefit", lang)}
          </p>
          <p className="text-sm font-black">
            {lang === "hi" ? scheme.estimatedBenefitHi : scheme.estimatedBenefit}
          </p>
        </div>

        {/* Why good for you */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1">
            {tx("whyGood", lang)}
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">
            {lang === "hi" ? scheme.whyGoodForYouHi : scheme.whyGoodForYou}
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            {tx("eligibility", lang)}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {lang === "hi" ? scheme.eligibilityHi : scheme.eligibility}
          </p>
        </div>

        {/* How to apply accordion */}
        <button
          type="button"
          onClick={() => setShowSteps(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl mb-3 transition-colors hover:bg-blue-100"
          style={{ minHeight: "auto", minWidth: "auto" }}
        >
          <span className="text-xs font-bold text-blue-700">{tx("howApply", lang)}</span>
          <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform ${showSteps ? "rotate-180" : ""}`} />
        </button>
        {showSteps && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 mb-4 animate-fadeIn">
            <ApplySteps steps={scheme.applySteps} lang={lang} />
          </div>
        )}

        {/* Apply CTA */}
        <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl px-4 py-3.5 transition-colors group">
          <span>{tx("applyBtn", lang)}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500">{new URL(scheme.applyUrl).hostname}</span>
            <ExternalLink className="w-3.5 h-3.5 text-green-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </article>
  );
}

function Skeleton({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-3 animate-fadeIn">
      {[0,1,2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
          style={{ opacity: 1 - i * 0.2 }}>
          <div className="flex gap-3">
            <div className="skeleton h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-3 w-20 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          </div>
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        <p className="text-xs text-gray-400">{tx("loading", lang)}</p>
      </div>
    </div>
  );
}

// ─── WhatsApp share ──────────────────────────────────────────────────
function buildShareText(schemes: Scheme[], lang: Lang): string {
  if (lang === "hi") {
    const lines = schemes.slice(0, 3).map((s, i) => `${i+1}. *${s.nameHi}* — ${s.estimatedBenefitHi}`);
    return `🇮🇳 *सरकारी योजना मिलान*\n\nआप इन योजनाओं के लिए पात्र हैं:\n\n${lines.join("\n")}\n\n✅ और योजनाएं जानें: yojana-matcher.vercel.app`;
  }
  const lines = schemes.slice(0, 3).map((s, i) => `${i+1}. *${s.name}* — ${s.estimatedBenefit}`);
  return `🇮🇳 *Government Scheme Matches*\n\nYou qualify for:\n\n${lines.join("\n")}\n\n✅ Check yours: yojana-matcher.vercel.app`;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function YojanaForm({ lang }: { lang: Lang }) {
  const [step, setStep]       = useState(0);
  const [data, setData]       = useState<WizardData>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState("");

  const totalSteps = STEPS.length;
  const stepName   = STEPS[step] as Step;

  const pick = useCallback((patch: Partial<WizardData>) => {
    const next = { ...data, ...patch };
    setData(next);
    if (step < totalSteps - 1) setTimeout(() => setStep(s => s + 1), 140);
  }, [data, step, totalSteps]);

  const handleSubmit = async (finalData: WizardData) => {
    setLoading(true);
    setResult(null);
    setApiError("");

    const ageBand  = AGE_BANDS.find(b => b.mid === finalData.age);
    const incBand  = INCOME_BANDS.find(b => b.value === finalData.income_lpa);
    const ageLabel = ageBand?.label.en ?? `${finalData.age} years old`;
    const incLabel = incBand?.label.en ?? `${finalData.income_lpa} LPA`;
    const userText = `I am a ${ageLabel} ${finalData.gender}, ${finalData.category} category, income ${incLabel}, education: ${finalData.education}, from ${finalData.state}. My main goal is ${finalData.purpose}.`;

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 28000);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText, purpose: finalData.purpose }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      const json: ApiResponse = await res.json();
      if (json.error) setApiError(json.error);
      else setResult(json);
    } catch (e: unknown) {
      clearTimeout(tid);
      setApiError(e instanceof DOMException && e.name === "AbortError" ? tx("timeout", lang) : tx("networkError", lang));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0); setData(DEFAULT); setResult(null); setApiError(""); setLoading(false);
  };

  // ── Results ─────────────────────────────────────────────────────
  if (loading) return <Skeleton lang={lang} />;

  if (apiError) return (
    <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3 animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-bold text-red-700 text-sm">{tx("errorTitle", lang)}</p>
        <p className="text-red-400 text-xs mt-0.5">{apiError}</p>
        <button onClick={handleReset} style={{ minHeight:"auto", minWidth:"auto" }}
          className="mt-3 text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-xl">
          {tx("tryAgain", lang)}
        </button>
      </div>
    </div>
  );

  if (result?.schemes) {
    const schemes = result.schemes;
    const profile  = result.profile!;
    const shareText = buildShareText(schemes, lang);

    return (
      <div className="animate-fadeIn">
        {/* Profile summary */}
        {profile && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-500" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{tx("yourProfile", lang)}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <SummaryChip icon={User}          value={`${profile.age} yrs`} />
              <SummaryChip icon={Users}         value={profile.gender} />
              <SummaryChip icon={Users}         value={profile.category} />
              <SummaryChip icon={IndianRupee}   value={`${profile.income_lpa} LPA`} />
              <SummaryChip icon={GraduationCap} value={profile.education} />
              <SummaryChip icon={MapPin}        value={profile.state} />
            </div>
          </div>
        )}

        {/* Count banner */}
        {schemes.length > 0 ? (
          <div className="bg-green-500 text-white rounded-2xl px-4 py-3.5 mb-5 shadow-md shadow-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-base">{schemes.length} {tx("matched", lang)}! 🎉</p>
                <p className="text-green-100 text-xs mt-0.5">{tx("matchedSub", lang)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-800">{tx("noMatch", lang)}</p>
              <p className="text-xs text-amber-500">{tx("noMatchSub", lang)}</p>
            </div>
          </div>
        )}

        {/* Scheme cards */}
        <div className="space-y-4 mb-5">
          {schemes.map((s, i) => (
            <SchemeCard key={s.id} scheme={s} profile={profile} isTop={i === 0} lang={lang} />
          ))}
        </div>

        {/* Action bar — WhatsApp + CSC */}
        {schemes.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white text-xs font-bold rounded-2xl py-3.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {tx("shareWA", lang)}
            </a>
            <a
              href="https://locator.csccloud.in/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl py-3.5 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              {tx("cscLink", lang)}
            </a>
          </div>
        )}

        {/* CSC hint */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 mb-4">
          <p className="text-[11px] text-sky-700 leading-relaxed">
            <strong>💡 {tx("cscLink", lang)}:</strong> {tx("cscHint", lang)}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            ⚠️ {tx("disclaimer", lang)}
          </p>
        </div>

        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-2xl py-3.5 transition-colors shadow-md shadow-green-200">
          <RefreshCw className="w-4 h-4" />
          {tx("checkAgain", lang)}
        </button>
      </div>
    );
  }

  // ── WIZARD ──────────────────────────────────────────────────────
  const STEP_QUESTIONS: Record<Step, { q: string; h: string }> = {
    purpose:   { q: tx("purposeQ",   lang), h: tx("purposeHint",   lang) },
    age:       { q: tx("ageQ",       lang), h: tx("ageHint",       lang) },
    gender:    { q: tx("genderQ",    lang), h: tx("genderHint",    lang) },
    category:  { q: tx("categoryQ",  lang), h: tx("categoryHint",  lang) },
    income:    { q: tx("incomeQ",    lang), h: tx("incomeHint",    lang) },
    education: { q: tx("educationQ", lang), h: tx("educationHint", lang) },
    state:     { q: tx("stateQ",     lang), h: tx("stateHint",     lang) },
  };

  return (
    <div>
      <StepBar current={step} total={totalSteps} />

      {/* Top meta row */}
      <div className="flex items-center justify-between mb-2">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors"
            style={{ minHeight:"auto", minWidth:"auto" }}>
            <ChevronLeft className="w-4 h-4" />{tx("back", lang)}
          </button>
        ) : <span />}
        <p className="text-[11px] text-gray-300 font-medium">
          {tx("stepOf", lang)} {step + 1} {tx("of", lang)} {totalSteps}
        </p>
      </div>

      {/* Running chips */}
      {step > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 animate-fadeIn">
          {data.purpose   && <SummaryChip icon={Sparkles}    value={PURPOSES.find(p=>p.value===data.purpose)?.labelKey ? data.purpose : data.purpose} />}
          {data.age > 0   && <SummaryChip icon={User}        value={AGE_BANDS.find(b=>b.mid===data.age)?.label[lang] ?? ""} />}
          {data.gender    && <SummaryChip icon={Users}        value={GENDERS.find(g=>g.value===data.gender)?.label[lang] ?? data.gender} />}
          {data.category  && <SummaryChip icon={Users}        value={CATEGORIES.find(c=>c.value===data.category)?.label[lang] ?? data.category} />}
          {data.income_lpa >= 0 && <SummaryChip icon={IndianRupee} value={INCOME_BANDS.find(b=>b.value===data.income_lpa)?.label[lang] ?? ""} />}
          {data.education && <SummaryChip icon={GraduationCap} value={EDUCATION_LEVELS.find(e=>e.value===data.education)?.label[lang] ?? data.education} />}
        </div>
      )}

      {/* Step card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden" key={step}>
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">{STEP_QUESTIONS[stepName].q}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{STEP_QUESTIONS[stepName].h}</p>
        </div>

        <div className="p-4 space-y-2">
          {/* PURPOSE */}
          {stepName === "purpose" && PURPOSES.map(p => (
            <OptionCard key={p.value}
              emoji={p.emojiEn}
              label={tx(p.labelKey, lang)}
              selected={data.purpose === p.value}
              onClick={() => pick({ purpose: p.value })}
            />
          ))}

          {/* AGE */}
          {stepName === "age" && AGE_BANDS.map(b => (
            <OptionCard key={b.mid}
              emoji={b.emoji} label={b.label[lang]}
              selected={data.age === b.mid}
              onClick={() => pick({ age: b.mid })}
            />
          ))}

          {/* GENDER */}
          {stepName === "gender" && GENDERS.map(g => (
            <OptionCard key={g.value}
              emoji={g.emoji} label={g.label[lang]}
              selected={data.gender === g.value}
              onClick={() => pick({ gender: g.value })}
            />
          ))}

          {/* CATEGORY */}
          {stepName === "category" && CATEGORIES.map(c => (
            <OptionCard key={c.value}
              emoji={c.emoji} label={c.label[lang]} desc={c.desc[lang]}
              selected={data.category === c.value}
              onClick={() => pick({ category: c.value })}
            />
          ))}

          {/* INCOME */}
          {stepName === "income" && INCOME_BANDS.map(b => (
            <OptionCard key={b.label.en}
              emoji={b.emoji} label={b.label[lang]} desc={b.desc[lang]}
              selected={data.income_lpa === b.value}
              onClick={() => pick({ income_lpa: b.value })}
            />
          ))}

          {/* EDUCATION */}
          {stepName === "education" && EDUCATION_LEVELS.map(e => (
            <OptionCard key={e.value}
              emoji={e.emoji} label={e.label[lang]}
              selected={data.education === e.value}
              onClick={() => pick({ education: e.value })}
            />
          ))}

          {/* STATE — final step with submit */}
          {stepName === "state" && (
            <>
              <OptionCard emoji="🌐"
                label={tx("allIndia", lang)}
                selected={data.state === "unknown"}
                onClick={() => setData(d => ({ ...d, state: "unknown" }))}
              />
              <div className="relative">
                <select
                  value={data.state === "unknown" ? "" : data.state}
                  onChange={e => setData(d => ({ ...d, state: e.target.value || "unknown" }))}
                  className="w-full appearance-none bg-white border-2 border-gray-100 hover:border-green-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-green-400 transition-colors pr-10"
                  style={{ minHeight: "52px" }}
                >
                  <option value="">{tx("selectState", lang)}</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              </div>

              <button
                onClick={() => handleSubmit(data)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black rounded-2xl py-4 text-sm shadow-lg shadow-green-200/60 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-2"
              >
                <Search className="w-4 h-4" />
                {tx("findBtn", lang)}
              </button>
            </>
          )}
        </div>
      </div>

      {step === 0 && (
        <p className="text-center text-[11px] text-gray-300 mt-4">
          {lang === "hi" ? "7 आसान कदम · कोई टाइपिंग नहीं · तुरंत परिणाम" : "7 quick taps · No typing · Instant results"}
        </p>
      )}
    </div>
  );
}
