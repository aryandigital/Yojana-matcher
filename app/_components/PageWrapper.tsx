"use client";
import { useState } from "react";
import YojanaForm from "./YojanaForm";
import { Shield, ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import { tx, type Lang } from "@/lib/i18n";

const SCHEME_LIST = [
  { name:"PM-KISAN",          nameHi:"PM-किसान",          desc:"₹6,000/yr for farmers",           url:"https://pmkisan.gov.in" },
  { name:"PMAY",              nameHi:"PMAY",              desc:"Housing loan subsidy 3–6.5%",      url:"https://pmaymis.gov.in" },
  { name:"Ayushman Bharat",   nameHi:"आयुष्मान भारत",    desc:"₹5 lakh annual health cover",      url:"https://pmjay.gov.in" },
  { name:"MUDRA Loan",        nameHi:"मुद्रा लोन",        desc:"Business loan up to ₹10 lakh",     url:"https://www.mudra.org.in" },
  { name:"PMEGP",             nameHi:"PMEGP",             desc:"Business subsidy up to 35%",        url:"https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp" },
  { name:"NSP SC Scholarship",nameHi:"NSP SC छात्रवृत्ति", desc:"Post-matric scholarship for SC",  url:"https://scholarships.gov.in" },
  { name:"Sukanya Samriddhi", nameHi:"सुकन्या समृद्धि",   desc:"8.2% savings for girl child",      url:"https://www.nsiindia.gov.in" },
  { name:"Stand-Up India",    nameHi:"स्टैंड-अप इंडिया",  desc:"₹10L–₹1Cr for SC/ST & Women",    url:"https://www.standupmitra.in" },
  { name:"PM SVANidhi",       nameHi:"PM SVANidhi",       desc:"Street vendor loan ₹10K–₹50K",     url:"https://pmsvanidhi.mohua.gov.in" },
  { name:"PMKVY",             nameHi:"PMKVY",             desc:"Free skill training + certificate", url:"https://www.pmkvyofficial.org" },
  { name:"Atal Pension (APY)",nameHi:"अटल पेंशन (APY)",  desc:"₹5,000/month pension from age 60", url:"https://www.npscra.nsdl.co.in/scheme-details.php" },
  { name:"PM Jan Dhan",       nameHi:"PM जन धन",          desc:"Zero-balance bank + free insurance",url:"https://pmjdy.gov.in" },
  { name:"Fasal Bima",        nameHi:"फसल बीमा",          desc:"Crop insurance at 2% premium",     url:"https://pmfby.gov.in" },
];

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q:"Is this an official government website?", a:"No. Yojana Matcher is an independent AI tool. Always apply through the official .gov.in links in the results." },
    { q:"How accurate is the matching?", a:"~90%+ accurate for major criteria. Exact eligibility depends on documentation — always verify officially before applying." },
    { q:"Is my data stored?", a:"No. Your answers are processed in-flight and never stored on our servers." },
    { q:"Can I apply offline?", a:"Yes — tap 'Find Nearest CSC Center' in your results to locate a Common Service Centre where staff can help you apply for free." },
    { q:"Why do I pick a purpose first?", a:"Knowing your goal (farming, business, health…) lets us rank the most relevant schemes for you at the top." },
  ],
  hi: [
    { q:"क्या यह सरकारी वेबसाइट है?", a:"नहीं। Yojana Matcher एक स्वतंत्र AI टूल है। आवेदन हमेशा .gov.in पोर्टल पर करें।" },
    { q:"मिलान कितना सटीक है?", a:"~90%+ सटीक। आवेदन से पहले आधिकारिक पोर्टल पर अपनी पात्रता जरूर जांचें।" },
    { q:"क्या मेरा डेटा सेव होता है?", a:"नहीं। आपके जवाब सिर्फ प्रोसेसिंग के दौरान उपयोग होते हैं, सर्वर पर कुछ भी सेव नहीं होता।" },
    { q:"क्या मैं ऑफलाइन आवेदन कर सकता हूं?", a:"हां — परिणामों में 'नजदीकी CSC केंद्र खोजें' पर क्लिक करें। वहां कर्मचारी मुफ्त में मदद करेंगे।" },
    { q:"पहले उद्देश्य क्यों पूछते हैं?", a:"आपका लक्ष्य जानकर हम सबसे उपयुक्त योजनाएं पहले दिखाते हैं।" },
  ],
};

export default function PageWrapper() {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 pb-20">

        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(l => l === "en" ? "hi" : "en")}
            style={{ minHeight:"auto", minWidth:"auto" }}
            className="flex items-center gap-2 text-xs font-bold border-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 rounded-full px-4 py-2 transition-colors shadow-sm"
          >
            <span className="text-base">{lang === "en" ? "🇮🇳" : "🌐"}</span>
            {tx("langToggle", lang)}
          </button>
        </div>

        {/* Hero */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-200 text-green-700 text-[11px] font-black px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            {tx("badge", lang)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
            {tx("heroTitle1", lang)}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
              {tx("heroTitle2", lang)}
            </span>
            {tx("heroTitle3", lang) ? <>{" "}{tx("heroTitle3", lang)}</> : null}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            {tx("heroSub", lang)}
          </p>
        </header>

        {/* Wizard */}
        <div className="min-h-[400px] mb-10">
          <YojanaForm lang={lang} />
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-300 mb-10">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" />{tx("trustNoData", lang)}</span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>{tx("trustGovOnly", lang)}</span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>{tx("trustNotGov", lang)}</span>
        </div>

        {/* Schemes covered grid */}
        <section className="mb-10">
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4 text-center">
            {tx("schemesTitle", lang)}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SCHEME_LIST.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className="block bg-white border border-gray-100 rounded-2xl p-3.5 hover:border-green-200 hover:shadow-md transition-all group min-h-[80px]">
                <p className="font-bold text-xs text-gray-800 group-hover:text-green-600 transition-colors mb-1 leading-snug">
                  {lang === "hi" ? s.nameHi : s.name}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">{s.desc}</p>
                <ExternalLink className="w-2.5 h-2.5 text-gray-200 group-hover:text-green-300 mt-1.5 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4 text-center">
            {tx("faqTitle", lang)}
          </h2>
          <div className="space-y-2">
            {FAQ[lang].map((item, i) => (
              <details key={`${lang}-${i}`} className="bg-white border border-gray-100 rounded-2xl group cursor-pointer">
                <summary className="flex items-center justify-between gap-3 px-4 py-4 list-none select-none">
                  <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-[11px] text-gray-300 space-y-1 pt-4 border-t border-gray-100">
          <p>{tx("footerLine1", lang)}</p>
          <p>
            {tx("footerLine2", lang)}{" · "}
            <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-green-500">india.gov.in</a>
            {" "}© {new Date().getFullYear()} Yojana Matcher.
          </p>
        </footer>
      </div>
    </div>
  );
}
