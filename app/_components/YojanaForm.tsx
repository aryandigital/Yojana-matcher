"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Loader2, ExternalLink, AlertCircle, CheckCircle2,
  ChevronRight, User, IndianRupee, MapPin, GraduationCap,
  Users, RefreshCw, Mic, Square, Sparkles, ArrowRight,
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

type VoicePhase =
  | "idle"
  | "listening"   // mic open, receiving audio
  | "countdown"   // speech ended, auto-submitting in N seconds
  | "submitting"; // fetch in progress

// Minimal Web Speech API types (avoid relying on incomplete lib.dom)
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    item(i: number): { isFinal: boolean; 0: { transcript: string } };
    [i: number]: { isFinal: boolean; 0: { transcript: string } };
  };
}
interface SpeechRec extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart:  (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror:  ((e: { error: string }) => void) | null;
  onend:    (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  }
}

// ─────────────────────────────────────────────────────────────────
// Example prompts
// ─────────────────────────────────────────────────────────────────
const EXAMPLES = [
  { label: "Student",       text: "24 year old SC girl from Bihar, ₹1.8 LPA family income, just completed graduation." },
  { label: "Farmer",        text: "35 year old male OBC farmer from Punjab, income ₹2.5 lakh per year, 10th pass." },
  { label: "Entrepreneur",  text: "28 year old woman from Maharashtra, general category, ₹4 LPA income, 12th pass, want to start a business." },
];

const COUNTDOWN_SECS = 3;

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
function SoundBars() {
  return (
    <span className="flex items-end gap-0.5 h-4 w-5" aria-hidden>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`block w-0.5 bg-white rounded-full origin-bottom bar-${i}`}
          style={{ height: "100%" }} />
      ))}
    </span>
  );
}

function Pill({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string | number;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-green-100 rounded-full px-3 py-1 shadow-sm">
      <Icon className="w-3 h-3 text-green-500 flex-shrink-0" aria-hidden />
      <span className="text-[11px] text-gray-400 whitespace-nowrap">{label}</span>
      <span className="text-[11px] font-bold text-gray-800 capitalize whitespace-nowrap">{String(value)}</span>
    </div>
  );
}

function SchemeCard({ scheme, index }: { scheme: Scheme; index: number }) {
  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-1.5 tracking-wider ${scheme.tagColor}`}>
              {scheme.tag.toUpperCase()}
            </span>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{scheme.name}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{scheme.ministry}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5 text-green-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">{scheme.description}</p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl px-4 py-2.5 mb-3">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-0.5">Benefit</p>
          <p className="text-xs text-gray-700 font-medium">{scheme.benefits}</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Eligibility</p>
          <p className="text-xs text-gray-600">{scheme.eligibility}</p>
        </div>
        <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl px-4 py-3 transition-colors group">
          <span>Apply on Official Portal</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500">{new URL(scheme.applyUrl).hostname}</span>
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
      {[0,1,2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3" style={{ opacity: 1 - i * 0.15 }}>
          <div className="flex gap-3">
            <div className="skeleton h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          </div>
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
      ))}
      <p className="text-center text-xs text-gray-400 pt-1">
        <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1.5" />
        AI is reading your profile…
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function YojanaForm() {
  const [text, setText]             = useState("");
  const [phase, setPhase]           = useState<VoicePhase>("idle");
  const [interim, setInterim]       = useState("");       // live partial transcript
  const [countdown, setCountdown]   = useState(0);
  const [voiceOK, setVoiceOK]       = useState(false);
  const [result, setResult]         = useState<ApiResponse | null>(null);
  const [apiError, setApiError]     = useState("");

  // All voice refs — no stale closures possible
  const recRef        = useRef<SpeechRec | null>(null);
  const finalRef      = useRef("");                         // accumulated confirmed transcript
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittingRef = useRef(false);                      // prevent double-submits

  // ── Detect support (client-only) ─────────────────────────────────
  useEffect(() => {
    setVoiceOK(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // ── Core submit — uses ref to avoid stale closure ─────────────────
  const doSubmit = async (query: string) => {
    if (submittingRef.current) return;
    const trimmed = query.trim();
    if (!trimmed) return;

    submittingRef.current = true;
    setPhase("submitting");
    setText(trimmed);
    setResult(null);
    setApiError("");

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 28000);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: trimmed }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      const data: ApiResponse = await res.json();
      if (data.error) setApiError(data.error);
      else setResult(data);
    } catch (e: unknown) {
      clearTimeout(tid);
      setApiError(
        e instanceof DOMException && e.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Network error. Check your connection and try again."
      );
    } finally {
      submittingRef.current = false;
      setPhase("idle");
    }
  };

  // ── Clear countdown timers ────────────────────────────────────────
  const clearCountdown = () => {
    if (countdownRef.current)  clearInterval(countdownRef.current);
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    countdownRef.current  = null;
    submitTimerRef.current = null;
    setCountdown(0);
  };

  // ── Auto-submit countdown after speech ends ───────────────────────
  const startCountdown = (capturedText: string) => {
    clearCountdown();
    let n = COUNTDOWN_SECS;
    setCountdown(n);

    countdownRef.current = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) clearInterval(countdownRef.current!);
    }, 1000);

    // Use setTimeout + ref text so no stale closure issue
    submitTimerRef.current = setTimeout(() => {
      doSubmit(capturedText);
    }, COUNTDOWN_SECS * 1000);
  };

  // ── Start microphone ──────────────────────────────────────────────
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    // Stop any previous session cleanly
    if (recRef.current) {
      recRef.current.onend = null;  // prevent stale onend from firing
      recRef.current.abort();
      recRef.current = null;
    }
    clearCountdown();

    finalRef.current = "";
    setInterim("");
    setPhase("listening");

    const rec = new SR();
    recRef.current = rec;

    // en-IN works on Android Chrome and accepts Hinglish naturally
    // continuous:false is MORE reliable across devices — re-starts automatically
    rec.lang = "en-IN";
    rec.continuous = false;          // ← key fix: false is universally supported
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setPhase("listening");
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let fin = "";
      let inf = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          fin += e.results[i][0].transcript;
        } else {
          inf += e.results[i][0].transcript;
        }
      }
      if (fin) {
        finalRef.current += (finalRef.current ? " " : "") + fin.trim();
        setText(finalRef.current);
        setInterim("");
      }
      if (inf) {
        setInterim(inf);
      }
    };

    rec.onerror = (e: { error: string }) => {
      // "no-speech" = silence timeout, not a real error — restart mic
      if (e.error === "no-speech") {
        try { rec.start(); } catch { setPhase("idle"); }
        return;
      }
      // "aborted" happens when we call abort() intentionally — ignore
      if (e.error === "aborted") return;

      console.warn("[Voice] error:", e.error);
      setPhase("idle");
      setInterim("");
    };

    rec.onend = () => {
      setInterim("");
      // Only transition if we're still in listening mode (not stopped intentionally)
      setPhase(prev => {
        if (prev !== "listening") return prev;
        const captured = finalRef.current.trim();
        if (captured.length >= 3) {
          // Delay to let React flush setState before countdown
          setTimeout(() => startCountdown(captured), 0);
          return "countdown";
        }
        return "idle";
      });
    };

    try {
      rec.start();
    } catch (e) {
      console.error("[Voice] start() failed:", e);
      setPhase("idle");
    }
  };

  // ── Stop microphone intentionally ────────────────────────────────
  const stopVoice = () => {
    if (!recRef.current) return;
    // Nullify onend BEFORE calling stop so we handle transition ourselves
    const rec = recRef.current;
    recRef.current = null;
    rec.onend = null;
    rec.onerror = null;
    rec.stop();

    setInterim("");
    const captured = finalRef.current.trim();
    if (captured.length >= 3) {
      setText(captured);
      setPhase("countdown");
      setTimeout(() => startCountdown(captured), 0);
    } else {
      setPhase("idle");
    }
  };

  // ── Cancel auto-submit ────────────────────────────────────────────
  const cancelCountdown = () => {
    clearCountdown();
    setPhase("idle");
  };

  // ── Manual submit ─────────────────────────────────────────────────
  const handleManualSubmit = (overrideText?: string) => {
    clearCountdown();
    const query = overrideText ?? text;
    doSubmit(query);
  };

  // ── Reset ─────────────────────────────────────────────────────────
  const handleReset = () => {
    if (recRef.current) {
      recRef.current.onend = null;
      recRef.current.abort();
      recRef.current = null;
    }
    clearCountdown();
    submittingRef.current = false;
    finalRef.current = "";
    setText("");
    setInterim("");
    setPhase("idle");
    setResult(null);
    setApiError("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recRef.current?.abort();
      clearCountdown();
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading    = phase === "submitting";
  const isListening  = phase === "listening";
  const isCountdown  = phase === "countdown";
  const canSubmit    = text.trim().length >= 3 && !isLoading && !isListening;

  // What to show in the textarea
  const displayText = isListening && interim
    ? finalRef.current
      ? `${finalRef.current} ${interim}`
      : interim
    : text;

  return (
    <section>

      {/* ═══════════════════════════════════════
          INPUT CARD
      ═══════════════════════════════════════ */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-5">

        {/* Card header row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Apne baare mein batao</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tell us about yourself</p>
          </div>

          {/* MIC BUTTON */}
          {voiceOK && (
            <button
              type="button"
              onClick={isListening ? stopVoice : startVoice}
              disabled={isLoading || isCountdown}
              aria-label={isListening ? "Stop recording" : "Start voice input"}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 disabled:opacity-40
                ${isListening
                  ? "bg-red-500 shadow-lg shadow-red-200/60"
                  : "bg-green-500 hover:bg-green-600 shadow-md shadow-green-200/60"
                }`}
            >
              {/* Pulse rings when listening */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-2xl bg-red-400 voice-ring"  />
                  <span className="absolute inset-0 rounded-2xl bg-red-400 voice-ring-2" />
                </>
              )}
              {isListening
                ? <Square className="w-4 h-4 text-white fill-white relative z-10" />
                : <Mic className="w-5 h-5 text-white relative z-10" />
              }
            </button>
          )}
        </div>

        {/* LISTENING BANNER */}
        {isListening && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center gap-3 animate-scaleIn">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <SoundBars />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-700">🎙 Listening… speak now</p>
              <p className="text-[11px] text-red-400 truncate mt-0.5">
                {interim || finalRef.current || "Waiting for speech…"}
              </p>
            </div>
            <button
              onClick={stopVoice}
              className="text-[11px] font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-xl px-3 py-2 flex-shrink-0 transition-colors"
              style={{ minHeight: "auto", minWidth: "auto" }}
            >
              Done ✓
            </button>
          </div>
        )}

        {/* COUNTDOWN BANNER */}
        {isCountdown && (
          <div className="mx-4 mt-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-center gap-3 animate-scaleIn">
            {/* Circular progress */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="none" stroke="#dcfce7" strokeWidth="3" />
                <circle cx="20" cy="20" r="17" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(countdown / COUNTDOWN_SECS) * 106.8} 106.8`}
                  style={{ transition: "stroke-dasharray 0.9s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-green-600">
                {countdown}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-700">Got it! Searching in {countdown}s…</p>
              <p className="text-[11px] text-green-500 truncate">
                {text.slice(0, 60)}{text.length > 60 ? "…" : ""}
              </p>
            </div>
            <button
              onClick={cancelCountdown}
              className="text-[11px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 flex-shrink-0 transition-colors"
              style={{ minHeight: "auto", minWidth: "auto" }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* TEXTAREA */}
        <div className="px-5 pt-4 pb-2">
          <textarea
            value={displayText}
            onChange={e => {
              setText(e.target.value);
              if (isCountdown) cancelCountdown();
            }}
            placeholder={voiceOK
              ? "Type here — or tap the green mic 🎤 to speak in Hindi or English…"
              : "E.g. I am 28, female, UP, OBC, ₹2.5 lakh income, 12th pass, want to start a business…"
            }
            rows={4}
            maxLength={2000}
            readOnly={isListening}
            className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-relaxed placeholder-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
              ${isListening
                ? "border-red-200 bg-red-50/30 text-gray-600 focus:ring-red-300 cursor-default"
                : isCountdown
                ? "border-green-200 bg-green-50/20 text-gray-800 focus:ring-green-300"
                : "border-gray-100 bg-gray-50 text-gray-800 focus:ring-green-400"
              }`}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleManualSubmit();
            }}
          />
          <div className="flex items-center justify-between mt-1.5 px-1">
            <p className="text-[11px] text-gray-300">age · gender · state · income · category · education</p>
            <span className="text-[11px] text-gray-200">{displayText.length}/2000</span>
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <div className="px-5 pb-5 pt-2">
          <button
            onClick={() => handleManualSubmit()}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2.5 font-bold rounded-2xl py-4 text-sm transition-all duration-200 shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
              bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600
              text-white shadow-green-200/50
              disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" />AI is matching…</>
              : <><Search className="w-4 h-4" />Find My Schemes<ChevronRight className="w-4 h-4" /></>
            }
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          EXAMPLES
      ═══════════════════════════════════════ */}
      {!result && !apiError && !isLoading && (
        <div className="mb-5">
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-3 text-center">
            Quick examples
          </p>
          <div className="space-y-2">
            {EXAMPLES.map((p, i) => (
              <button key={i} onClick={() => handleManualSubmit(p.text)} disabled={isLoading}
                className="w-full text-left bg-white hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-2xl px-4 py-3.5 transition-all shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-green-100 text-green-600 rounded-lg px-2 py-1 flex-shrink-0">
                    {p.label}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 min-w-0">{p.text}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-green-400 flex-shrink-0 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          LOADING
      ═══════════════════════════════════════ */}
      {isLoading && <Skeleton />}

      {/* ═══════════════════════════════════════
          ERROR
      ═══════════════════════════════════════ */}
      {apiError && (
        <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3 mb-5 animate-fadeIn">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-700 text-sm">Something went wrong</p>
            <p className="text-red-400 text-xs mt-0.5 leading-relaxed">{apiError}</p>
            <button onClick={handleReset}
              className="mt-2.5 text-xs font-bold text-red-600 underline"
              style={{ minHeight: "auto", minWidth: "auto" }}>
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          RESULTS
      ═══════════════════════════════════════ */}
      {result && !apiError && (
        <div className="animate-fadeIn">
          {/* Profile pills */}
          {result.profile && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Profile understood{result.usedFallback ? " (keyword mode)" : " by AI"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Pill icon={User}          label="Age"      value={`${result.profile.age} yrs`} />
                <Pill icon={Users}         label="Gender"   value={result.profile.gender} />
                <Pill icon={MapPin}        label="State"    value={result.profile.state} />
                <Pill icon={IndianRupee}   label="Income"   value={`${result.profile.income_lpa} LPA`} />
                <Pill icon={Users}         label="Category" value={result.profile.category} />
                <Pill icon={GraduationCap} label="Edu"      value={result.profile.education} />
              </div>
            </div>
          )}

          {/* Count banner */}
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 ${
            result.schemes && result.schemes.length > 0
              ? "bg-green-500 text-white shadow-md shadow-green-200"
              : "bg-amber-50 border border-amber-100"
          }`}>
            {result.schemes && result.schemes.length > 0 ? (
              <>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="font-bold text-sm">
                  {result.schemes.length} scheme{result.schemes.length !== 1 ? "s" : ""} matched!
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-amber-800">No central schemes matched</p>
                  <p className="text-[11px] text-amber-500">
                    Try{" "}
                    <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer"
                      className="underline font-bold">myscheme.gov.in</a> for state schemes
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Scheme cards */}
          <div className="space-y-3 mb-5">
            {result.schemes?.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <strong className="text-gray-500">⚠️ Disclaimer:</strong> Independent AI tool, not an official government portal.
              Always verify on official <code className="text-green-600">.gov.in</code> sites before applying.
            </p>
          </div>

          <button onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-300 hover:text-green-500 py-3 transition-colors rounded-2xl focus:outline-none"
            style={{ minHeight: "auto" }}>
            <RefreshCw className="w-3.5 h-3.5" />
            Search again
          </button>
        </div>
      )}
    </section>
  );
}
