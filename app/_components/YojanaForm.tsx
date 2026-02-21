"use client";

// app/_components/YojanaForm.tsx
// Isolated Client Component for interactivity.
// The parent page.tsx is a Server Component, meaning Google crawls
// the full HTML including hero text, FAQ, and trust signals without JS.

import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  User,
  IndianRupee,
  MapPin,
  GraduationCap,
  Users,
  RefreshCw,
} from "lucide-react";
import type { Scheme, UserProfile } from "@/lib/schemes";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ApiResponse {
  profile?: UserProfile;
  schemes?: Scheme[];
  error?: string;
}

// ─────────────────────────────────────────────
// Example prompts — clickable shortcuts
// ─────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  "24 saal ki SC category ki ladki hoon Bihar se, ₹1.8 LPA income, graduation complete ki abhi.",
  "35 year old male farmer from Punjab, annual income around 2.5 lakh, OBC category, 10th pass.",
  "28 year old woman, Maharashtra, family earns ₹4 LPA, general category, 12th pass, want to start a business.",
];

// ─────────────────────────────────────────────
// Sub-components (no separate files needed)
// ─────────────────────────────────────────────

function ProfilePill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    // Pre-defined height prevents CLS when pills appear
    <div className="flex items-center gap-1.5 bg-white/80 border border-green-100 rounded-full px-3 py-1.5 shadow-sm h-8">
      <Icon className="w-3.5 h-3.5 text-green-600 flex-shrink-0" aria-hidden="true" />
      <span className="text-gray-500 text-xs">{label}:</span>
      <span className="text-gray-800 font-semibold text-xs capitalize">{String(value)}</span>
    </div>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <article
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-200 p-5"
      aria-label={`Scheme: ${scheme.name}`}
    >
      {/* Tag + Title */}
      <div className="mb-3">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${scheme.tagColor}`}
        >
          {scheme.tag}
        </span>
        <h3 className="font-bold text-gray-900 text-sm leading-snug">{scheme.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{scheme.ministry}</p>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mb-3">{scheme.description}</p>

      {/* Benefit highlight */}
      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-3">
        <p className="text-xs font-semibold text-green-700 mb-0.5">Key Benefit</p>
        <p className="text-xs text-green-800">{scheme.benefits}</p>
      </div>

      {/* Eligibility */}
      <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-0.5">Eligibility Criteria</p>
        <p className="text-xs text-gray-600">{scheme.eligibility}</p>
      </div>

      {/* CTA → official .gov.in portal (no cloaking) */}
      <a
        href={scheme.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-xs font-bold rounded-xl py-3 shadow-sm shadow-green-200 transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        aria-label={`Apply for ${scheme.name} on official government portal (opens in new tab)`}
      >
        Apply on Official Portal
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fadeIn" aria-label="Loading results…" aria-busy="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl p-5 space-y-3 bg-white/60 border border-white/60">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-5 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
export default function YojanaForm() {
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSubmit = useCallback(
    async (overrideText?: string) => {
      const query = (overrideText ?? userText).trim();
      if (!query || loading) return;

      if (overrideText) setUserText(overrideText);
      setLoading(true);
      setResult(null);

      try {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userText: query }),
          // Abort if no response in 25 seconds
          signal: AbortSignal.timeout(25_000),
        });

        const data: ApiResponse = await res.json();
        setResult(data);
      } catch (err: unknown) {
        const isTimeout =
          err instanceof DOMException && err.name === "TimeoutError";
        setResult({
          error: isTimeout
            ? "Request timed out. Please try again."
            : "Network error. Please check your connection and try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [userText, loading]
  );

  const handleReset = () => {
    setResult(null);
    setUserText("");
  };

  return (
    <section aria-label="Scheme eligibility checker">
      {/* ── Input card ── */}
      {/* Pre-defined min-height prevents CLS when results load below */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-5 sm:p-6 mb-6">
        <label
          htmlFor="user-description"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Apne baare mein batao (Tell us about yourself)
        </label>
        <textarea
          id="user-description"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="E.g. I am a 28 year old woman from UP, OBC category, annual income 2.5 lakh, completed 12th standard, want to start a small business…"
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors leading-relaxed"
          // Fixed rows keep height stable → no CLS on content change
          rows={4}
          maxLength={2000}
          aria-describedby="input-hint"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />
        <p id="input-hint" className="text-xs text-gray-400 mt-1.5 mb-4">
          Include: <strong>age</strong> · <strong>gender</strong> · <strong>state</strong> ·{" "}
          <strong>income</strong> · <strong>category</strong> (SC/ST/OBC/General) ·{" "}
          <strong>education</strong>
          <span className="float-right">{userText.length}/2000</span>
        </p>

        <button
          onClick={() => handleSubmit()}
          disabled={loading || userText.trim().length < 10}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold rounded-xl py-3.5 text-sm shadow-lg shadow-green-200/50 transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              AI Matching Schemes…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" aria-hidden="true" />
              Find My Schemes
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* ── Example prompts (hidden once results shown) ── */}
      {!result && !loading && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">
            Try an example
          </p>
          <div className="space-y-2" role="list" aria-label="Example descriptions">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(prompt)}
                className="w-full text-left text-xs text-gray-600 bg-white/60 hover:bg-white border border-gray-100 hover:border-green-200 rounded-xl px-4 py-3 transition-all duration-150 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                role="listitem"
                aria-label={`Use example: ${prompt}`}
              >
                <span className="text-green-500 font-bold mr-2 group-hover:mr-3 transition-all" aria-hidden="true">→</span>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && <LoadingSkeleton />}

      {/* ── Error state ── */}
      {result?.error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3 shadow-sm mb-6 animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-red-700 text-sm">Something went wrong</p>
            <p className="text-red-600 text-xs mt-0.5">{result.error}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs text-red-600 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {result?.schemes !== undefined && !result.error && (
        <div className="animate-fadeIn">
          {/* Extracted profile pills */}
          {result.profile && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Profile extracted by AI — verify before applying
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                <ProfilePill icon={User} label="Age" value={result.profile.age} />
                <ProfilePill icon={Users} label="Gender" value={result.profile.gender} />
                <ProfilePill icon={MapPin} label="State" value={result.profile.state} />
                <ProfilePill icon={IndianRupee} label="Income" value={`${result.profile.income_lpa} LPA`} />
                <ProfilePill icon={Users} label="Category" value={result.profile.category} />
                <ProfilePill icon={GraduationCap} label="Education" value={result.profile.education} />
              </div>
            </div>
          )}

          {/* Count header */}
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
            <h2 className="text-base font-bold text-gray-800">
              {result.schemes.length > 0
                ? `${result.schemes.length} scheme${result.schemes.length !== 1 ? "s" : ""} matched for you`
                : "No schemes matched your profile"}
            </h2>
          </div>

          {/* Zero results state */}
          {result.schemes.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <p className="text-amber-700 text-sm font-medium mb-1">
                No central schemes matched your current profile.
              </p>
              <p className="text-amber-600 text-xs">
                Try adjusting your income, category, or check state-specific schemes directly on{" "}
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  myscheme.gov.in
                </a>
                .
              </p>
            </div>
          )}

          {/* Scheme cards */}
          {result.schemes.length > 0 && (
            <div className="space-y-4">
              {result.schemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* YMYL disclaimer — required for E-E-A-T */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>⚠️ Disclaimer:</strong> Yojana Matcher is an independent AI tool that
              aggregates publicly available information. It is{" "}
              <strong>not an official government portal</strong>. Eligibility estimates are
              approximate — always verify on the official <code>.gov.in</code> website before
              applying. The information provided does not constitute legal or financial advice.
            </p>
          </div>

          {/* Reset CTA */}
          <button
            onClick={handleReset}
            className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 font-medium py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Start a new search
          </button>
        </div>
      )}
    </section>
  );
}
