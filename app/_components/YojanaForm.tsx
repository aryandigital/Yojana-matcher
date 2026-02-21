"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Search, Loader2, ExternalLink, AlertCircle, CheckCircle2,
  ChevronRight, User, IndianRupee, MapPin, GraduationCap,
  Users, RefreshCw, Mic, Square, Sparkles, ArrowRight,
} from "lucide-react";
import type { Scheme, UserProfile } from "@/lib/schemes";

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────
interface ApiResponse {
  profile?: UserProfile;
  schemes?: Scheme[];
  error?: string;
  usedFallback?: boolean;
}

type VoiceState = "idle" | "listening" | "processing" | "done";

// Web Speech API types (not in TS lib by default)
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  { label: "Student", text: "24 year old SC girl from Bihar, ₹1.8 LPA family income, just completed graduation." },
  { label: "Farmer",  text: "35 year old male OBC farmer from Punjab, income ₹2.5 lakh per year, 10th pass." },
  { label: "Entrepreneur", text: "28 year old woman from Maharashtra, general category, ₹4 LPA income, 12th pass, want to start a business." },
];

// ─────────────────────────────────────────────────────────────────────
// Sound bar animation (shown during voice listening)
// ─────────────────────────────────────────────────────────────────────
function SoundBars() {
  return (
    <div className="flex items-end gap-[3px] h-5" aria-hidden="true">
      {["bar-1","bar-2","bar-3","bar-4","bar-5"].map((cls, i) => (
        <div
          key={i}
          className={`w-[3px] bg-white rounded-full origin-bottom ${cls}`}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Profile pill
// ─────────────────────────────────────────────────────────────────────
function Pill({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string | number;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-green-100 rounded-full px-3 py-1.5 shadow-sm">
      <Icon className="w-3.5 h-3.5 text-green-500" aria-hidden />
      <span className="text-[11px] text-gray-400">{label}</span>
      <span className="text-[11px] font-bold text-gray-800 capitalize">{String(value)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Scheme card
// ─────────────────────────────────────────────────────────────────────
function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 tracking-wide ${scheme.tagColor}`}>
              {scheme.tag.toUpperCase()}
            </span>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{scheme.name}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{scheme.ministry}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-4">{scheme.description}</p>

        {/* Benefit highlight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-4 py-3 mb-3">
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Benefit</p>
          <p className="text-xs text-gray-700 font-medium">{scheme.benefits}</p>
        </div>

        {/* Eligibility */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Eligibility</p>
          <p className="text-xs text-gray-600">{scheme.eligibility}</p>
        </div>

        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl px-4 py-3 transition-colors group"
        >
          <span>Apply on Official Portal</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">{new URL(scheme.applyUrl).hostname}</span>
            <ExternalLink className="w-3.5 h-3.5 text-green-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3 animate-fadeIn">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
          style={{ opacity: 1 - i * 0.15 }}>
          <div className="flex gap-3">
            <div className="skeleton h-12 w-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      ))}
      <p className="text-center text-xs text-gray-400 pt-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1.5" />
        AI is reading your profile…
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────
export default function YojanaForm() {
  const [userText, setUserText]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<ApiResponse | null>(null);

  // Voice state
  const [voiceState, setVoiceState]         = useState<VoiceState>("idle");
  const [interimText, setInterimText]       = useState("");   // live partial transcript
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [autoSubmitCount, setAutoSubmitCount] = useState<number | null>(null);

  const recognitionRef  = useRef<ISpeechRecognition | null>(null);
  const finalTextRef    = useRef("");   // accumulates confirmed transcript across results
  const autoSubmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef     = useRef<HTMLTextAreaElement>(null);

  // Detect browser support once on mount
  useEffect(() => {
    setVoiceSupported(
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  // ── Submit handler ──────────────────────────────────────────────
  const handleSubmit = useCallback(async (overrideText?: string) => {
    const query = (overrideText ?? userText).trim();
    if (!query || loading) return;
    if (overrideText) setUserText(overrideText);
    setLoading(true);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: query }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setResult(await res.json());
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      setResult({
        error: err instanceof DOMException && err.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Network error. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  }, [userText, loading]);

  // ── Clear any pending auto-submit timers ────────────────────────
  const clearAutoSubmit = useCallback(() => {
    if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
    if (countdownTimer.current)  clearInterval(countdownTimer.current);
    setAutoSubmitCount(null);
  }, []);

  // ── Start auto-submit countdown (called when speech ends) ───────
  const startAutoSubmit = useCallback((text: string) => {
    clearAutoSubmit();
    let count = 3;
    setAutoSubmitCount(count);

    countdownTimer.current = setInterval(() => {
      count--;
      if (count > 0) {
        setAutoSubmitCount(count);
      } else {
        clearInterval(countdownTimer.current!);
        setAutoSubmitCount(null);
      }
    }, 1000);

    autoSubmitTimer.current = setTimeout(() => {
      handleSubmit(text);
    }, 3000);
  }, [clearAutoSubmit, handleSubmit]);

  // ── Start voice recognition ─────────────────────────────────────
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    clearAutoSubmit();
    finalTextRef.current = "";
    setInterimText("");
    setVoiceState("listening");

    const recognition = new SR();
    recognitionRef.current = recognition;

    // Use en-IN for broadest Android compatibility; accepts Hindi words naturally
    recognition.lang = "en-IN";
    recognition.continuous = true;       // keeps mic open until user stops
    recognition.interimResults = true;   // live partial results in textarea
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState("listening");
    };

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let finalChunk = "";

      // Iterate ALL results (not just last) to accumulate full session
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalChunk) {
        finalTextRef.current = finalChunk;
        setUserText(finalChunk.trim());
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (e: Event) => {
      const errName = (e as Event & { error?: string }).error;
      console.warn("[Voice] error:", errName);
      // "no-speech" is normal — user was silent; treat as end
      setVoiceState("idle");
      setInterimText("");
    };

    recognition.onend = () => {
      setVoiceState("done");
      setInterimText("");
      const captured = finalTextRef.current.trim();
      if (captured.length > 3) {
        setUserText(captured);
        startAutoSubmit(captured);
      } else {
        setVoiceState("idle");
      }
    };

    recognition.start();
  }, [clearAutoSubmit, startAutoSubmit]);

  // ── Stop voice recognition ──────────────────────────────────────
  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    // onend fires automatically → triggers startAutoSubmit
  }, []);

  // ── Cancel auto-submit and stay in edit mode ────────────────────
  const cancelAutoSubmit = useCallback(() => {
    clearAutoSubmit();
    setVoiceState("idle");
  }, [clearAutoSubmit]);

  // ── Reset everything ────────────────────────────────────────────
  const handleReset = useCallback(() => {
    clearAutoSubmit();
    stopVoice();
    setResult(null);
    setUserText("");
    setVoiceState("idle");
    setInterimText("");
    finalTextRef.current = "";
  }, [clearAutoSubmit, stopVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      clearAutoSubmit();
    };
  }, [clearAutoSubmit]);

  // Display text: live interim overlaid while speaking, else confirmed text
  const displayText = voiceState === "listening" && interimText
    ? (finalTextRef.current ? finalTextRef.current + interimText : interimText)
    : userText;

  const canSubmit = userText.trim().length >= 3 && !loading;

  return (
    <section>
      {/* ══════════════════════════════════════════════════════
          INPUT CARD
      ══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-5">

        {/* Card header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Apne baare mein batao</h2>
              <p className="text-xs text-gray-400 mt-0.5">Tell us about yourself</p>
            </div>
            {/* Voice trigger button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={voiceState === "listening" ? stopVoice : startVoice}
                disabled={loading}
                aria-label={voiceState === "listening" ? "Stop recording" : "Start voice input"}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-40 ${
                  voiceState === "listening"
                    ? "bg-red-500 shadow-lg shadow-red-200"
                    : "bg-green-500 hover:bg-green-600 shadow-md shadow-green-200"
                }`}
              >
                {/* Ripple rings when listening */}
                {voiceState === "listening" && (
                  <>
                    <span className="absolute inset-0 rounded-2xl bg-red-400 voice-ring" />
                    <span className="absolute inset-0 rounded-2xl bg-red-400 voice-ring-2" />
                  </>
                )}
                {voiceState === "listening" ? (
                  <Square className="w-4 h-4 text-white fill-white relative z-10" />
                ) : (
                  <Mic className="w-5 h-5 text-white relative z-10" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Voice listening banner */}
        {voiceState === "listening" && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center gap-3 animate-scaleIn">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <SoundBars />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-700">Listening… speak now</p>
              <p className="text-[11px] text-red-400 truncate">
                {interimText || "Waiting for speech…"}
              </p>
            </div>
            <button
              onClick={stopVoice}
              className="text-[11px] font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg px-3 py-1.5 flex-shrink-0 transition-colors min-h-0 min-w-0 h-auto"
            >
              Done
            </button>
          </div>
        )}

        {/* Auto-submit countdown banner */}
        {voiceState === "done" && autoSubmitCount !== null && (
          <div className="mx-5 mt-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-center gap-3 animate-scaleIn">
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#dcfce7" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={(1 - autoSubmitCount / 3) * 100}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-green-600">
                {autoSubmitCount}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700">Got it! Searching in {autoSubmitCount}s…</p>
              <p className="text-[11px] text-green-500">Edit text above or cancel</p>
            </div>
            <button
              onClick={cancelAutoSubmit}
              className="text-[11px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 flex-shrink-0 transition-colors min-h-0 min-w-0 h-auto"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Textarea */}
        <div className="px-5 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => {
              setUserText(e.target.value);
              if (voiceState === "done") cancelAutoSubmit();
            }}
            placeholder={
              voiceSupported
                ? "Type here, or tap the green 🎤 button to speak in English or Hindi…"
                : "E.g. I am 28, female, UP, OBC, ₹2.5 lakh income, 12th pass, want to start a business…"
            }
            className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-relaxed placeholder-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
              voiceState === "listening"
                ? "border-red-200 bg-red-50/30 text-gray-700"
                : "border-gray-100 bg-gray-50 text-gray-800"
            }`}
            rows={4}
            maxLength={2000}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[11px] text-gray-300">age · gender · state · income · category · education</p>
            <span className="text-[11px] text-gray-200">{displayText.length}/2000</span>
          </div>
        </div>

        {/* Search button */}
        <div className="px-5 pb-5 pt-3">
          <button
            onClick={() => handleSubmit()}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-bold rounded-2xl py-4 text-sm transition-all duration-200 shadow-md shadow-green-200/50 disabled:shadow-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-busy={loading}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />AI is matching schemes…</>
            ) : (
              <><Search className="w-4 h-4" />Find My Schemes<ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EXAMPLE PROMPTS
      ══════════════════════════════════════════════════════ */}
      {!result && !loading && (
        <div className="mb-5">
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-3 text-center">
            Quick examples
          </p>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(p.text)}
                disabled={loading}
                className="w-full text-left bg-white hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-2xl px-4 py-3.5 transition-all shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-green-100 text-green-600 rounded-lg px-2 py-1 flex-shrink-0">
                    {p.label}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 min-w-0">{p.text}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-400 flex-shrink-0 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          LOADING
      ══════════════════════════════════════════════════════ */}
      {loading && <Skeleton />}

      {/* ══════════════════════════════════════════════════════
          ERROR
      ══════════════════════════════════════════════════════ */}
      {result?.error && (
        <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3 mb-5 animate-fadeIn">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-700 text-sm">Something went wrong</p>
            <p className="text-red-500 text-xs mt-0.5 leading-relaxed">{result.error}</p>
            <button onClick={handleReset} className="mt-2.5 text-xs font-bold text-red-600 underline min-h-0 min-w-0 h-auto">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          RESULTS
      ══════════════════════════════════════════════════════ */}
      {result?.schemes !== undefined && !result.error && (
        <div className="animate-fadeIn">

          {/* Profile summary card */}
          {result.profile && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-green-600" />
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Profile understood {result.usedFallback ? "(keyword mode)" : "by AI"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Pill icon={User}          label="Age"       value={`${result.profile.age} yrs`} />
                <Pill icon={Users}         label="Gender"    value={result.profile.gender} />
                <Pill icon={MapPin}        label="State"     value={result.profile.state} />
                <Pill icon={IndianRupee}   label="Income"    value={`${result.profile.income_lpa} LPA`} />
                <Pill icon={Users}         label="Category"  value={result.profile.category} />
                <Pill icon={GraduationCap} label="Education" value={result.profile.education} />
              </div>
            </div>
          )}

          {/* Result count banner */}
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 ${
            result.schemes.length > 0
              ? "bg-green-500 text-white shadow-md shadow-green-200"
              : "bg-amber-50 border border-amber-100"
          }`}>
            {result.schemes.length > 0 ? (
              <>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="font-bold text-sm">
                  {result.schemes.length} scheme{result.schemes.length !== 1 ? "s" : ""} matched for you!
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-amber-800">No schemes matched</p>
                  <p className="text-[11px] text-amber-600">
                    Try <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="underline">myscheme.gov.in</a> for state schemes
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Scheme cards */}
          <div className="space-y-3 mb-5">
            {result.schemes.map((scheme, i) => (
              <SchemeCard key={scheme.id} scheme={scheme} index={i} />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <strong className="text-gray-600">⚠️ Disclaimer:</strong> This is an independent AI tool, not an official government portal. Eligibility estimates are approximate — always verify on official <code className="text-green-600">.gov.in</code> sites before applying.
            </p>
          </div>

          {/* New search */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-green-600 py-3 transition-colors focus:outline-none rounded-2xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Search again
          </button>
        </div>
      )}
    </section>
  );
}
