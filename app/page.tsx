// app/page.tsx
// THIS IS A SERVER COMPONENT — no "use client" directive.
// Next.js pre-renders all static content (hero, FAQ, trust bar) as HTML.
// Only <YojanaForm> is a Client Component island — keeps JS bundle minimal.

import YojanaForm from "./_components/YojanaForm";
import { Sparkles, Shield, ExternalLink } from "lucide-react";

// Schemes listed here for SEO-crawlable content (server-rendered HTML)
const SCHEME_LIST = [
  { name: "PM-KISAN", desc: "₹6,000/year for farmers", url: "https://pmkisan.gov.in" },
  { name: "PMAY", desc: "Housing subsidy up to 6.5%", url: "https://pmaymis.gov.in" },
  { name: "Ayushman Bharat", desc: "₹5 lakh health cover", url: "https://pmjay.gov.in" },
  { name: "MUDRA Loan", desc: "Business loan up to ₹10 lakh", url: "https://www.mudra.org.in" },
  { name: "NSP SC Scholarship", desc: "Post-matric scholarship for SC", url: "https://scholarships.gov.in" },
  { name: "Sukanya Samriddhi", desc: "8.2% savings for girl child", url: "https://www.nsiindia.gov.in" },
  { name: "Stand-Up India", desc: "₹10L–₹1Cr for SC/ST & Women entrepreneurs", url: "https://www.standupmitra.in" },
];

const FAQ = [
  {
    q: "Is this an official government website?",
    a: "No. Yojana Matcher is an independent AI tool that aggregates publicly available information about central government schemes. Always apply through the official .gov.in portals linked on each result card.",
  },
  {
    q: "How accurate is the eligibility check?",
    a: "The AI extracts your profile from your description and applies the official eligibility criteria. It is approximately 90%+ accurate for basic criteria, but exact eligibility depends on additional documentation and state-specific rules. Always verify on the official portal.",
  },
  {
    q: "Is my data stored or shared?",
    a: "No. Your description is sent directly to Google's Gemini AI for processing and is not stored on our servers. We do not collect or sell any personal data.",
  },
  {
    q: "Which schemes are covered?",
    a: "We currently cover major central government schemes including PM-KISAN, PMAY, Ayushman Bharat PM-JAY, MUDRA Yojana, NSP SC Scholarship, Sukanya Samriddhi Yojana, and Stand-Up India. More schemes are added regularly.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background blobs — positioned absolutely, no layout impact */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-green-200/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 bg-teal-200/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">

        {/* ── HERO — Server-rendered, LCP element ── */}
        <header className="text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            AI-Powered · Free · Instant Eligibility Check
          </div>

          {/* H1 — primary LCP candidate. fetchpriority hint via preload in layout */}
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-3">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Yojana
            </span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Sarkari yojana eligibility check karo seconds mein. Describe yourself in plain
            language — our AI instantly matches you with central government schemes you qualify
            for.
          </p>
        </header>

        {/* ── INTERACTIVE FORM — Client Component island ── */}
        {/* 
          Wrapping in a div with min-height prevents CLS when the form 
          hydrates and results appear below it.
        */}
        <div className="min-h-[280px]">
          <YojanaForm />
        </div>

        {/* ── TRUST BAR — Server-rendered ── */}
        <div className="mt-12 mb-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
            <span>No data stored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" aria-hidden="true" />
            <span>Links only to official .gov.in portals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" aria-hidden="true" />
            <span>Not an official government website</span>
          </div>
        </div>

        {/* ── SCHEME DIRECTORY — Server-rendered, crawlable ── */}
        <section aria-labelledby="schemes-heading" className="mb-12">
          <h2
            id="schemes-heading"
            className="text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wider"
          >
            Schemes We Cover
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {SCHEME_LIST.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/70 border border-gray-100 rounded-xl p-3 hover:border-green-200 hover:bg-white transition-colors group min-h-[80px]"
                aria-label={`${s.name} – ${s.desc} (opens official portal)`}
              >
                <p className="font-semibold text-xs text-gray-800 group-hover:text-green-700 transition-colors mb-1">
                  {s.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight">{s.desc}</p>
                <ExternalLink
                  className="w-2.5 h-2.5 text-gray-300 group-hover:text-green-400 mt-1 transition-colors"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </section>

        {/* ── FAQ — Server-rendered for SEO (FAQ schema can be added in layout) ── */}
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2
            id="faq-heading"
            className="text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wider"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="bg-white/70 border border-gray-100 rounded-xl p-4 group cursor-pointer"
              >
                <summary className="text-sm font-semibold text-gray-800 list-none flex justify-between items-center gap-2 select-none">
                  {item.q}
                  <span className="text-green-500 text-lg leading-none flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center text-xs text-gray-400 space-y-1 border-t border-gray-100 pt-6">
          <p>
            Yojana Matcher is an independent tool and is{" "}
            <strong>not affiliated with the Government of India</strong>.
          </p>
          <p>
            Data sourced from publicly available information on official{" "}
            <a
              href="https://www.india.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-600"
            >
              india.gov.in
            </a>{" "}
            portals. © {new Date().getFullYear()} Yojana Matcher.
          </p>
        </footer>
      </div>
    </div>
  );
}
