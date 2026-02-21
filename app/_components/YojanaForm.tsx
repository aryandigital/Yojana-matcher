"use client";

import { useState } from "react";
import {
  Search, Loader2, ExternalLink, AlertCircle, CheckCircle2,
  ChevronRight, ChevronLeft, User, IndianRupee, MapPin,
  GraduationCap, Users, RefreshCw, Sparkles,
} from "lucide-react";
import type { Scheme, UserProfile } from "@/lib/schemes";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
interface ApiResponse {
  profile?: UserProfile;
  schemes?: Scheme[];
  error?: string;
  usedFallback?: boolean;
}

interface WizardData {
  age: number;
  gender: string;
  state: string;
  income_lpa: number;
  category: string;
  education: string;
}

// ─────────────────────────────────────────────────────────────────
// Wizard step config
// ─────────────────────────────────────────────────────────────────
const AGE_BANDS = [
  { label: "Under 18", emoji: "🧒", min: 5,  max: 17  },
  { label: "18 – 25",  emoji: "🎓", min: 18, max: 25  },
  { label: "26 – 35",  emoji: "💼", min: 26, max: 35  },
  { label: "36 – 50",  emoji: "🏠", min: 36, max: 50  },
  { label: "51 – 60",  emoji: "🌿", min: 51, max: 60  },
  { label: "60+",      emoji: "🧓", min: 61, max: 90  },
];

const GENDERS = [
  { label: "Male",   emoji: "👨", value: "male"   },
  { label: "Female", emoji: "👩", value: "female" },
  { label: "Other",  emoji: "🧑", value: "other"  },
];

const CATEGORIES = [
  { label: "General", emoji: "🏛️", value: "general", desc: "No reservation category" },
  { label: "OBC",     emoji: "📋", value: "OBC",     desc: "Other Backward Classes" },
  { label: "SC",      emoji: "⚖️", value: "SC",      desc: "Scheduled Caste" },
  { label: "ST",      emoji: "🌿", value: "ST",      desc: "Scheduled Tribe" },
];

const INCOME_BANDS = [
  { label: "No income",     emoji: "🔍", value: 0,    desc: "Unemployed / Student" },
  { label: "Under ₹1 LPA", emoji: "💧", value: 0.8,  desc: "Below poverty line" },
  { label: "₹1 – 2.5 LPA", emoji: "🌱", value: 1.8,  desc: "Low income" },
  { label: "₹2.5 – 5 LPA", emoji: "🌿", value: 3.5,  desc: "Lower middle" },
  { label: "₹5 – 10 LPA",  emoji: "💼", value: 7.5,  desc: "Middle income" },
  { label: "₹10 – 18 LPA", emoji: "🏢", value: 14,   desc: "Upper middle" },
  { label: "Above ₹18 LPA",emoji: "🏆", value: 25,   desc: "High income" },
];

const EDUCATION_LEVELS = [
  { label: "Below 10th",       emoji: "📚", value: "below 10th"  },
  { label: "10th Pass",        emoji: "📗", value: "10th pass"   },
  { label: "12th Pass",        emoji: "📘", value: "12th pass"   },
  { label: "Graduation",       emoji: "🎓", value: "graduation"  },
  { label: "Post Graduation",  emoji: "🔬", value: "postgraduate"},
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Puducherry","Jammu & Kashmir","Ladakh",
];

const STEPS = ["Age","Gender","Category","Income","Education","State"] as const;
type StepName = typeof STEPS[number];

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
function OptionCard({
  emoji, label, desc, selected, onClick,
}: {
  emoji: string; label: string; desc?: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 text-left active:scale-[0.97] focus:outline-none
        ${selected
          ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
          : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/40"
        }`}
    >
      <span className="text-2xl flex-shrink-0 w-8 text-center">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-snug ${selected ? "text-green-700" : "text-gray-800"}`}>
          {label}
        </p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${selected ? "border-green-500 bg-green-500" : "border-gray-200"}`}>
        {selected && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
      </div>
    </button>
  );
}

function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-2 tracking-wider ${scheme.tagColor}`}>
              {scheme.tag.toUpperCase()}
            </span>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{scheme.name}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{scheme.ministry}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{scheme.description}</p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-4 py-3 mb-3">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">Key Benefit</p>
          <p className="text-xs text-gray-700 font-medium">{scheme.benefits}</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Eligibility</p>
          <p className="text-xs text-gray-600 leading-relaxed">{scheme.eligibility}</p>
        </div>
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl px-4 py-3 transition-colors group"
        >
          <span>Apply on Official Portal</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500">{new URL(scheme.applyUrl).hostname}</span>
            <ExternalLink className="w-3.5 h-3.5 text-green-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-fadeIn">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
          style={{ opacity: 1 - i * 0.2 }}>
          <div className="flex gap-3">
            <div className="skeleton h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-3 w-20 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          </div>
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        <p className="text-xs text-gray-400">Matching your profile with schemes…</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Step progress bar
// ─────────────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-green-500"
              : i === current
              ? "bg-green-300 step-active"
              : "bg-gray-100"
          }`}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Summary chip
// ─────────────────────────────────────────────────────────────────
function SummaryChip({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
      <Icon className="w-3 h-3 text-green-500 flex-shrink-0" />
      <span className="text-[11px] font-bold text-green-700 whitespace-nowrap capitalize">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
const DEFAULT_DATA: WizardData = {
  age: 0,
  gender: "",
  state: "unknown",
  income_lpa: -1,
  category: "",
  education: "",
};

export default function YojanaForm() {
  const [step, setStep]       = useState(0);
  const [data, setData]       = useState<WizardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState("");

  const totalSteps = STEPS.length;
  const stepName: StepName = STEPS[step];

  // ── Pick and advance ────────────────────────────────────────────
  const pick = (patch: Partial<WizardData>) => {
    const next = { ...data, ...patch };
    setData(next);
    if (step < totalSteps - 1) {
      setTimeout(() => setStep(s => s + 1), 160); // small delay for satisfying feel
    }
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (finalData: WizardData) => {
    setLoading(true);
    setResult(null);
    setApiError("");

    // Build a natural-language sentence from wizard answers so Gemini
    // (and the keyword fallback) can extract it reliably
    const ageBand = AGE_BANDS.find(b => finalData.age >= b.min && finalData.age <= b.max);
    const ageLabel = ageBand
      ? `${ageBand.min === 5 ? "under 18" : `${ageBand.min}-${ageBand.max}`} years old`
      : `${finalData.age} years old`;
    const incBand = INCOME_BANDS.find(b => b.value === finalData.income_lpa);
    const incLabel = incBand ? incBand.label.toLowerCase() : `${finalData.income_lpa} LPA`;
    const userText = `I am a ${ageLabel} ${finalData.gender}, ${finalData.category} category, income ${incLabel}, education: ${finalData.education}, from ${finalData.state}.`;

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 28000);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      const json: ApiResponse = await res.json();
      if (json.error) setApiError(json.error);
      else setResult(json);
    } catch (e: unknown) {
      clearTimeout(tid);
      setApiError(
        e instanceof DOMException && e.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Network error. Check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────
  const handleReset = () => {
    setStep(0);
    setData(DEFAULT_DATA);
    setResult(null);
    setApiError("");
    setLoading(false);
  };

  // ── Render results / loading ────────────────────────────────────
  if (loading) return <Skeleton />;

  if (apiError) {
    return (
      <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3 animate-fadeIn">
        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
        <div>
          <p className="font-bold text-red-700 text-sm">Something went wrong</p>
          <p className="text-red-400 text-xs mt-0.5 leading-relaxed">{apiError}</p>
          <button onClick={handleReset}
            className="mt-3 text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-xl hover:bg-red-200 transition-colors"
            style={{ minHeight: "auto", minWidth: "auto" }}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (result && !apiError) {
    return (
      <div className="animate-fadeIn">
        {/* Profile summary */}
        {result.profile && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-500" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Your Profile</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <SummaryChip icon={User}          value={`${result.profile.age} yrs`} />
              <SummaryChip icon={Users}         value={result.profile.gender} />
              <SummaryChip icon={Users}         value={result.profile.category} />
              <SummaryChip icon={IndianRupee}   value={`${result.profile.income_lpa} LPA`} />
              <SummaryChip icon={GraduationCap} value={result.profile.education} />
              <SummaryChip icon={MapPin}        value={result.profile.state} />
            </div>
          </div>
        )}

        {/* Count banner */}
        {result.schemes && result.schemes.length > 0 ? (
          <div className="flex items-center gap-3 bg-green-500 text-white rounded-2xl px-4 py-3 mb-4 shadow-md shadow-green-200">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-black text-base">{result.schemes.length} Scheme{result.schemes.length !== 1 ? "s" : ""} Matched! 🎉</p>
              <p className="text-green-100 text-xs">You qualify for the following central government schemes</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-800">No central schemes matched</p>
              <p className="text-xs text-amber-500">
                Try <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer"
                  className="underline font-bold">myscheme.gov.in</a> for state-specific schemes
              </p>
            </div>
          </div>
        )}

        {/* Scheme cards */}
        <div className="space-y-3 mb-5">
          {result.schemes?.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            <strong className="text-gray-500">⚠️ Disclaimer:</strong> Independent AI tool — not an official government portal.
            Always verify eligibility on <code className="text-green-600">.gov.in</code> before applying.
          </p>
        </div>

        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-2xl py-3.5 transition-colors shadow-md shadow-green-200">
          <RefreshCw className="w-4 h-4" />
          Check Again for Someone Else
        </button>
      </div>
    );
  }

  // ── WIZARD ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Progress bar */}
      <StepBar current={step} total={totalSteps} />

      {/* Step counter + back */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors"
              style={{ minHeight: "auto", minWidth: "auto" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
        <p className="text-[11px] text-gray-300 font-medium">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Running summary chips */}
      {step > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 mt-2 animate-fadeIn">
          {data.age > 0 && (() => {
            const b = AGE_BANDS.find(x => data.age >= x.min && data.age <= x.max);
            return b ? <SummaryChip key="age" icon={User} value={b.label} /> : null;
          })()}
          {data.gender && <SummaryChip icon={Users} value={data.gender} />}
          {data.category && <SummaryChip icon={Users} value={data.category} />}
          {data.income_lpa >= 0 && (() => {
            const b = INCOME_BANDS.find(x => x.value === data.income_lpa);
            return b ? <SummaryChip key="inc" icon={IndianRupee} value={b.label} /> : null;
          })()}
          {data.education && <SummaryChip icon={GraduationCap} value={data.education} />}
        </div>
      )}

      {/* Step card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden animate-slideIn" key={step}>
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">
            {stepName === "Age" && "How old are you?"}
            {stepName === "Gender" && "What is your gender?"}
            {stepName === "Category" && "Your social category?"}
            {stepName === "Income" && "Annual household income?"}
            {stepName === "Education" && "Highest qualification?"}
            {stepName === "State" && "Which state are you from?"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {stepName === "Age" && "This determines age-based eligibility"}
            {stepName === "Gender" && "Some schemes are gender-specific"}
            {stepName === "Category" && "SC/ST/OBC get additional scheme access"}
            {stepName === "Income" && "Many schemes have income caps"}
            {stepName === "Education" && "For scholarship and loan schemes"}
            {stepName === "State" && "Optional — helps refine results"}
          </p>
        </div>

        <div className="p-5 space-y-2.5">
          {/* ── AGE ── */}
          {stepName === "Age" && AGE_BANDS.map(band => (
            <OptionCard
              key={band.label}
              emoji={band.emoji}
              label={band.label}
              selected={data.age >= band.min && data.age <= band.max}
              onClick={() => pick({ age: Math.round((band.min + band.max) / 2) })}
            />
          ))}

          {/* ── GENDER ── */}
          {stepName === "Gender" && GENDERS.map(g => (
            <OptionCard
              key={g.value}
              emoji={g.emoji}
              label={g.label}
              selected={data.gender === g.value}
              onClick={() => pick({ gender: g.value })}
            />
          ))}

          {/* ── CATEGORY ── */}
          {stepName === "Category" && CATEGORIES.map(c => (
            <OptionCard
              key={c.value}
              emoji={c.emoji}
              label={c.label}
              desc={c.desc}
              selected={data.category === c.value}
              onClick={() => pick({ category: c.value })}
            />
          ))}

          {/* ── INCOME ── */}
          {stepName === "Income" && INCOME_BANDS.map(b => (
            <OptionCard
              key={b.label}
              emoji={b.emoji}
              label={b.label}
              desc={b.desc}
              selected={data.income_lpa === b.value}
              onClick={() => pick({ income_lpa: b.value })}
            />
          ))}

          {/* ── EDUCATION ── */}
          {stepName === "Education" && EDUCATION_LEVELS.map(e => (
            <OptionCard
              key={e.value}
              emoji={e.emoji}
              label={e.label}
              selected={data.education === e.value}
              onClick={() => pick({ education: e.value })}
            />
          ))}

          {/* ── STATE ── */}
          {stepName === "State" && (
            <>
              <OptionCard
                emoji="🌍"
                label="All India / Don't know"
                selected={data.state === "unknown"}
                onClick={() => setData(d => ({ ...d, state: "unknown" }))}
              />
              <div className="relative">
                <select
                  value={data.state === "unknown" ? "" : data.state}
                  onChange={e => setData(d => ({ ...d, state: e.target.value || "unknown" }))}
                  className="w-full appearance-none bg-white border-2 border-gray-100 hover:border-green-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-green-400 transition-colors cursor-pointer"
                  style={{ minHeight: "52px" }}
                >
                  <option value="">Select your state…</option>
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 rotate-90 pointer-events-none" />
              </div>

              {/* Final submit button on last step */}
              <button
                onClick={() => handleSubmit(data)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black rounded-2xl py-4 text-sm shadow-lg shadow-green-200/60 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-2"
              >
                <Search className="w-4 h-4" />
                Find My Schemes
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Skip / manual text fallback for power users */}
      {step === 0 && (
        <p className="text-center text-xs text-gray-300 mt-4">
          Just 6 quick taps · No typing needed
        </p>
      )}
    </div>
  );
}
