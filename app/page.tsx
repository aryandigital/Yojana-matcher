// app/page.tsx — Server Component
import YojanaForm from "./_components/YojanaForm";
import { Shield, ExternalLink, ChevronDown, Sparkles } from "lucide-react";

const SCHEME_LIST = [
  { name: "PM-KISAN",           desc: "₹6,000/yr for farmers",         url: "https://pmkisan.gov.in" },
  { name: "PMAY",               desc: "Housing loan subsidy 3–6.5%",   url: "https://pmaymis.gov.in" },
  { name: "Ayushman Bharat",    desc: "₹5 lakh annual health cover",   url: "https://pmjay.gov.in" },
  { name: "MUDRA Loan",         desc: "Business loan up to ₹10 lakh",  url: "https://www.mudra.org.in" },
  { name: "NSP SC Scholarship", desc: "Post-matric scholarship for SC", url: "https://scholarships.gov.in" },
  { name: "Sukanya Samriddhi",  desc: "8.2% savings for girl child",    url: "https://www.nsiindia.gov.in" },
  { name: "Stand-Up India",     desc: "₹10L–₹1Cr for SC/ST & Women",  url: "https://www.standupmitra.in" },
];

const FAQ = [
  { q: "Is this an official government website?", a: "No. Yojana Matcher is an independent AI tool. Always apply through the official .gov.in portals linked on each result card." },
  { q: "How accurate is the eligibility check?",  a: "Approximately 90%+ accurate for major criteria. Exact eligibility depends on documentation and state rules. Always verify officially." },
  { q: "Is my data stored?",                      a: "No. Your answers are processed on-the-fly and never stored on our servers." },
  { q: "Why a tap wizard instead of typing?",     a: "Tapping is faster and works perfectly on any phone — no keyboard friction, no spelling errors, instant results." },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 pb-20">

        {/* HERO */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-200 text-green-700 text-[11px] font-black px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            AI-Powered · Free · 6 Taps
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
              Yojana
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            Answer 6 simple questions. Our AI instantly matches you with government schemes you qualify for — no typing, no hassle.
          </p>
        </header>

        {/* WIZARD */}
        <div className="min-h-[400px] mb-10">
          <YojanaForm />
        </div>

        {/* TRUST BAR */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-300 mb-10">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-green-400" />No data stored
          </span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>Links only to official .gov.in</span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>Not a government website</span>
        </div>

        {/* SCHEMES COVERED */}
        <section aria-labelledby="schemes-h" className="mb-10">
          <h2 id="schemes-h" className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4 text-center">
            Schemes We Cover
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SCHEME_LIST.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className="block bg-white border border-gray-100 rounded-2xl p-3.5 hover:border-green-200 hover:shadow-md transition-all group min-h-[80px]">
                <p className="font-bold text-xs text-gray-800 group-hover:text-green-600 transition-colors mb-1 leading-snug">{s.name}</p>
                <p className="text-[11px] text-gray-400 leading-tight">{s.desc}</p>
                <ExternalLink className="w-2.5 h-2.5 text-gray-200 group-hover:text-green-300 mt-1.5 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-h" className="mb-10">
          <h2 id="faq-h" className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4 text-center">FAQ</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="bg-white border border-gray-100 rounded-2xl group cursor-pointer">
                <summary className="flex items-center justify-between gap-3 px-4 py-4 list-none select-none">
                  <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-gray-300 space-y-1 pt-4 border-t border-gray-100">
          <p>Not affiliated with the Government of India.</p>
          <p>
            Data sourced from{" "}
            <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-500">india.gov.in</a>
            {" "}public portals. © {new Date().getFullYear()} Yojana Matcher.
          </p>
        </footer>
      </div>
    </div>
  );
}
