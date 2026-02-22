"use client";
import { useState } from "react";
import YojanaForm from "./YojanaForm";
import { Shield, ExternalLink, ChevronDown, Sparkles, TrendingUp } from "lucide-react";
import { tx, type Lang } from "@/lib/i18n";

const SCHEME_LIST = [
  { name: "PM-KISAN", nameHi: "PM-किसान", desc: "₹6,000/yr for farmers", url: "https://pmkisan.gov.in" },
  { name: "PMAY", nameHi: "PMAY", desc: "Housing loan subsidy 3–6.5%", url: "https://pmaymis.gov.in" },
  { name: "Ayushman Bharat", nameHi: "आयुष्मान भारत", desc: "₹5 lakh health cover/year", url: "https://pmjay.gov.in" },
  { name: "MUDRA Loan", nameHi: "मुद्रा लोन", desc: "Business loan up to ₹10 lakh", url: "https://www.mudra.org.in" },
  { name: "PMEGP", nameHi: "PMEGP", desc: "Business subsidy 15–35%", url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp" },
  { name: "PMJJBY", nameHi: "PMJJBY", desc: "Life insurance ₹2L at ₹436/yr", url: "https://www.jansuraksha.gov.in" },
  { name: "PMSBY", nameHi: "PMSBY", desc: "Accident cover ₹2L at ₹20/yr", url: "https://www.jansuraksha.gov.in" },
  { name: "e-SHRAM Card", nameHi: "e-श्रम कार्ड", desc: "Gig/unorganized worker benefits", url: "https://eshram.gov.in" },
  { name: "PPF", nameHi: "PPF", desc: "7.1% tax-free investment", url: "https://www.nsiindia.gov.in" },
  { name: "Sovereign Gold Bond", nameHi: "सॉवरेन गोल्ड बॉन्ड", desc: "Digital gold + 2.5% interest", url: "https://rbi.org.in" },
  { name: "NPS", nameHi: "NPS", desc: "Pension + extra ₹50K tax deduction", url: "https://enps.nsdl.com" },
  { name: "NSP SC Scholarship", nameHi: "NSP SC छात्रवृत्ति", desc: "Full fees + monthly allowance", url: "https://scholarships.gov.in" },
  { name: "Sukanya Samriddhi", nameHi: "सुकन्या समृद्धि", desc: "8.2% savings for girl child", url: "https://www.nsiindia.gov.in" },
  { name: "Stand-Up India", nameHi: "स्टैंड-अप इंडिया", desc: "₹10L–₹1Cr for SC/ST & women", url: "https://www.standupmitra.in" },
  { name: "PM SVANidhi", nameHi: "PM SVANidhi", desc: "Street vendor loan ₹10K–₹50K", url: "https://pmsvanidhi.mohua.gov.in" },
  { name: "PMKVY", nameHi: "PMKVY", desc: "Free skill training + certificate", url: "https://www.pmkvyofficial.org" },
  { name: "Atal Pension (APY)", nameHi: "अटल पेंशन (APY)", desc: "₹5,000/month pension from age 60", url: "https://www.npscra.nsdl.co.in" },
  { name: "PM Jan Dhan", nameHi: "PM जन धन", desc: "Zero-balance bank + free insurance", url: "https://pmjdy.gov.in" },
  { name: "Fasal Bima", nameHi: "फसल बीमा", desc: "Crop insurance at 2% premium", url: "https://pmfby.gov.in" },
];

// What India's govt is building — major investment/infrastructure programs
const GOV_BUILDING = [
  { emoji: "🛤️", name: "PM Gati Shakti", nameHi: "PM गति शक्ति", desc: "₹100 lakh crore national infrastructure master plan — roads, rail, airports, waterways integrated.", descHi: "₹100 लाख करोड़ का राष्ट्रीय अवसंरचना मास्टर प्लान — सड़क, रेल, हवाई अड्डे, जलमार्ग।", url: "https://www.pmindia.gov.in/en/government_tr_rec/pm-gatishakti/" },
  { emoji: "⚡", name: "PM Surya Ghar", nameHi: "PM सूर्य घर", desc: "1 crore households to get free solar rooftop — save ₹15,000–₹18,000/year on electricity bills.", descHi: "1 करोड़ घरों को मुफ़्त सोलर रूफटॉप — बिजली बिल में ₹15,000–₹18,000/वर्ष की बचत।", url: "https://pmsuryaghar.gov.in" },
  { emoji: "💧", name: "Jal Jeevan Mission", nameHi: "जल जीवन मिशन", desc: "Tap water connection to every rural home by 2024 — 19 crore households covered under mission.", descHi: "2024 तक हर ग्रामीण घर को नल जल कनेक्शन — 19 करोड़ परिवार लक्षित।", url: "https://jaljeevanmission.gov.in" },
  { emoji: "🏥", name: "PM ABHIM Health", nameHi: "PM ABHIM स्वास्थ्य", desc: "₹64,180 crore for 75 medical colleges, new hospitals and health infrastructure across India.", descHi: "₹64,180 करोड़ — 75 मेडिकल कॉलेज, नए अस्पताल और स्वास्थ्य अवसंरचना।", url: "https://www.mohfw.gov.in" },
  { emoji: "🌾", name: "PM PRANAM Scheme", nameHi: "PM PRANAM योजना", desc: "Incentives for states to reduce chemical fertilizer use — sustainable farming for the future.", descHi: "राज्यों को रासायनिक उर्वरक उपयोग घटाने के लिए प्रोत्साहन — टिकाउ खेती।", url: "https://www.india.gov.in" },
  { emoji: "🚀", name: "India Semiconductor", nameHi: "भारत सेमीकंडक्टर", desc: "₹76,000 crore to build India's own chip industry — 3 major fabs, 50,000+ jobs being created.", descHi: "₹76,000 करोड़ से भारत का अपना चिप उद्योग — 3 बड़े fab, 50,000+ नौकरियां।", url: "https://www.india.gov.in/spotlight/india-semiconductor-mission" },
  { emoji: "👨‍🔨", name: "PM Vishwakarma", nameHi: "PM विश्वकर्मा", desc: "₹13,000 crore scheme for 18 traditional trades — free training, toolkit, ₹3 lakh loan at 5% for artisans & craftsmen.", descHi: "18 पारंपरिक कारोबारों के लिए ₹13,000 करोड़ — मुफ़्त प्रशिक्षण, टूलकिट, 5% पर ₹3 लाख लोन।", url: "https://pmvishwakarma.gov.in" },
  { emoji: "🏭", name: "PLI Scheme", nameHi: "PLI योजना", desc: "₹1.97 lakh crore Production Linked Incentive across 14 sectors — mobile, pharma, solar, textiles, food processing.", descHi: "14 क्षेत्रों में ₹1.97 लाख करोड़ PLI — मोबाइल, फार्मा, सोलर, कपड़ा, खाद्य प्रसंस्करण।", url: "https://www.investindia.gov.in/pli" },
  { emoji: "📱", name: "Digital India", nameHi: "डिजिटल इंडिया", desc: "Connect 6 lakh villages with broadband and 5G — digital public infrastructure, DigiLocker, UPI, BHIM.", descHi: "6 लाख गांवों को ब्रॉडबैंड और 5G — DigiLocker, UPI, BHIM से डिजिटल भारत ।", url: "https://www.digitalindia.gov.in" },
  { emoji: "🏙️", name: "AMRUT 2.0", nameHi: "AMRUT 2.0", desc: "₹2.99 lakh crore for urban water supply, sewerage & faecal management in 500 cities across India.", descHi: "500 शहरों में जल आपूर्ति, सीवरेज और शहरी सुधार के लिए ₹2.99 लाख करोड़।", url: "https://amrut.gov.in" },
];

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Is this an official government website?", a: "No. Yojana Matcher is an independent AI tool. Always apply through the official .gov.in links shown in results." },
    { q: "How accurate is the matching?", a: "~90%+ accurate for major criteria. Always verify your exact eligibility at the official portal before applying." },
    { q: "Is my data stored anywhere?", a: "No. Your answers are processed in real-time and never stored on our servers." },
    { q: "What is the employment status step for?", a: "Some schemes exclude government employees (PM-KISAN, APY) while others are only for gig/unorganized workers (e-SHRAM, SVANidhi). This helps us filter correctly." },
    { q: "Can I apply offline at a center?", a: "Yes — tap 'Find Nearest CSC Center' in your results to locate a Common Service Centre where staff will help you apply for free." },
    { q: "What is an e-SHRAM card and who needs it?", a: "It's a national ID card for unorganized workers (gig drivers, daily wage, construction, domestic workers). It gives free accident insurance and priority in welfare schemes." },
    { q: "Why see PPF/NPS/Gold Bond here?", a: "Yojana Matcher now covers all government-backed financial products — not just welfare schemes. PPF, NPS, and Sovereign Gold Bond are government investment instruments with significant tax benefits." },
  ],
  hi: [
    { q: "क्या यह सरकारी वेबसाइट है?", a: "नहीं। Yojana Matcher एक स्वतंत्र AI टूल है। आवेदन हमेशा .gov.in पोर्टल पर करें।" },
    { q: "मिलान कितना सटीक है?", a: "~90%+ सटीक। आवेदन से पहले आधिकारिक पोर्टल पर अपनी पात्रता जरूर जांचें।" },
    { q: "क्या मेरा डेटा सेव होता है?", a: "नहीं। आपके जवाब सिर्फ प्रोसेसिंग के दौरान उपयोग होते हैं, सर्वर पर कुछ भी सेव नहीं होता।" },
    { q: "रोजगार का दर्जा पूछना क्यों जरूरी है?", a: "कुछ योजनाएं सरकारी कर्मचारियों के लिए नहीं हैं (PM-KISAN, APY) और कुछ केवल गिग/असंगठित कर्मचारियों के लिए हैं (e-SHRAM, SVANidhi)।" },
    { q: "क्या मैं ऑफलाइन आवेदन कर सकता हूं?", a: "हां — परिणामों में 'नजदीकी CSC केंद्र खोजें' पर क्लिक करें। वहां कर्मचारी मुफ्त में मदद करेंगे।" },
    { q: "e-SHRAM कार्ड क्या है और किसे चाहिए?", a: "यह असंगठित क्षेत्र के कर्मचारियों के लिए राष्ट्रीय ID कार्ड है — गिग ड्राइवर, दिहाड़ी मजदूर, निर्माण कर्मचारी। इससे मुफ्त दुर्घटना बीमा और योजनाओं में प्राथमिकता मिलती है।" },
    { q: "यहां PPF/NPS/गोल्ड बॉन्ड क्यों दिखता है?", a: "Yojana Matcher अब सभी सरकारी वित्तीय उत्पादों को कवर करता है — केवल कल्याण योजनाएं नहीं। PPF, NPS और Sovereign Gold Bond सरकारी निवेश साधन हैं जिनमें महत्वपूर्ण कर लाभ हैं।" },
  ],
};

const SHARE_TEXT = {
  en: "🇮🇳 I just found the government schemes I qualify for — took just 8 taps, completely free!\n\nCheck yours at yojana-matcher.vercel.app",
  hi: "🇮🇳 मुझे सरकारी योजनाएं मिल गईं जिनके लिए मैं पात्र हूं — सिर्फ 8 टैप में, बिल्कुल मुफ़्त!\n\nअपनी योजनाएं खोजें: yojana-matcher.vercel.app",
};

export default function PageWrapper() {
  const [lang, setLang] = useState<Lang>("en");

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT[lang])}`;

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 pb-20">

        {/* ── Top bar: lang toggle + story share ── */}
        <div className="flex items-center justify-between mb-5 gap-3">
          {/* SHARE ON STORY — very visible, always at top */}
          <a href={shareUrl} target="_blank" rel="noopener noreferrer"
            style={{ minHeight: "auto", minWidth: "auto" }}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white text-[11px] font-black rounded-full px-4 py-2 shadow-md shadow-rose-200 hover:shadow-rose-300 hover:scale-105 transition-all">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white flex-shrink-0">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            {lang === "hi" ? "स्टोरी पर शेयर करें" : "Share on Story"}
          </a>

          {/* Lang toggle */}
          <button onClick={() => setLang(l => l === "en" ? "hi" : "en")}
            style={{ minHeight: "auto", minWidth: "auto" }}
            className="flex items-center gap-2 text-xs font-bold border-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 rounded-full px-4 py-2 transition-colors shadow-sm flex-shrink-0">
            <span className="text-base">{lang === "en" ? "🇮🇳" : "🌐"}</span>
            {tx("langToggle", lang)}
          </button>
        </div>

        {/* ── Hero ── */}
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

        {/* ── Wizard ── */}
        <div className="min-h-[400px] mb-10">
          <YojanaForm lang={lang} />
        </div>

        {/* ── Trust bar ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-300 mb-12">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" />{tx("trustNoData", lang)}</span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>{tx("trustGovOnly", lang)}</span>
          <span className="hidden sm:block w-px h-3 bg-gray-100" />
          <span>{tx("trustNotGov", lang)}</span>
        </div>

        {/* ── What India's Government Is Building ── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h2 className="text-sm font-black text-gray-800">{tx("govBuilding", lang)}</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">{tx("govBuildingSub", lang)}</p>
          <div className="space-y-2.5">
            {GOV_BUILDING.map(g => (
              <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3.5 bg-white border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-md transition-all group">
                <div className="text-2xl flex-shrink-0 w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  {g.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-gray-900 group-hover:text-green-600 transition-colors mb-0.5">
                    {lang === "hi" ? g.nameHi : g.name}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {lang === "hi" ? g.descHi : g.desc}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-200 group-hover:text-green-400 flex-shrink-0 mt-0.5 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* ── Schemes grid ── */}
        <section className="mb-12">
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

        {/* ── FAQ ── */}
        <section className="mb-12">
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

        {/* ── Footer ── */}
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
