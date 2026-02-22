"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import YojanaForm from "./YojanaForm";
import {
    ChevronRight,
    ChevronDown,
    Briefcase,
    Wheat,
    GraduationCap,
    HeartPulse,
    Home,
    Wrench,
    SunMedium,
    Droplet,
    Share2,
    ExternalLink,
    Sparkles,
    ArrowDown,
} from "lucide-react";

/* ─── Translation helper ─── */
const tx = (key: string, lang: "en" | "hi") => {
    const t: Record<string, Record<"en" | "hi", string>> = {
        shareStatus: { en: "Share on Status", hi: "स्टेटस शेयर" },
        findYojana: { en: "Find Your", hi: "अपनी खोजें" },
        yojana: { en: "Yojana", hi: "योजना" },
        subtitle: {
            en: "Match instantly with 100+ government schemes, insurance & investments you qualify for.",
            hi: "100+ सरकारी योजनाओं, बीमा और निवेश से तुरंत मैच करें।",
        },
        startMatching: { en: "Start Matching →", hi: "मैचिंग शुरू करें →" },
        lookingFor: { en: "What are you looking for?", hi: "आप क्या खोज रहे हैं?" },
        govInitiatives: { en: "Government Initiatives", hi: "सरकारी पहल" },
        schemesWeCover: { en: "Schemes We Cover", hi: "योजनाएं जो हम कवर करते हैं" },
        faq: { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न" },
        viewAll: { en: "View All Schemes ↗", hi: "सभी योजनाएं देखें ↗" },
        tapToExplore: { en: "Tap any category to explore", hi: "किसी भी श्रेणी पर टैप करें" },
    };
    return t[key]?.[lang] || key;
};

/* ─── SVG Watermarks ─── */
const AshokaChakra = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900/[0.04]" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
        {[...Array(24)].map((_, i) => (
            <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="1.5"
                transform={`rotate(${i * 15} 50 50)`} />
        ))}
    </svg>
);

/* ─── Data ─── */
const CATEGORIES = [
    {
        id: "business", icon: Briefcase, label: { en: "Start a Business", hi: "व्यापार शुरू करें" },
        color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
        img: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=60&w=400&h=200&fit=crop",
        url: "https://www.mudra.org.in",
    },
    {
        id: "farming", icon: Wheat, label: { en: "Farming & Agriculture", hi: "कृषि और खेती" },
        color: "text-green-600", bg: "bg-green-50", border: "border-green-100",
        img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=60&w=400&h=200&fit=crop",
        url: "https://pmkisan.gov.in",
    },
    {
        id: "education", icon: GraduationCap, label: { en: "Education & Scholarship", hi: "शिक्षा और छात्रवृत्ति" },
        color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=60&w=400&h=200&fit=crop",
        url: "https://scholarships.gov.in",
    },
    {
        id: "health", icon: HeartPulse, label: { en: "Health & Insurance", hi: "स्वास्थ्य और बीमा" },
        color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100",
        img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=60&w=400&h=200&fit=crop",
        url: "https://pmjay.gov.in",
    },
    {
        id: "housing", icon: Home, label: { en: "Housing", hi: "आवास" },
        color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100",
        img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=60&w=400&h=200&fit=crop",
        url: "https://pmaymis.gov.in",
    },
    {
        id: "skills", icon: Wrench, label: { en: "Skill Training", hi: "कौशल प्रशिक्षण" },
        color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=60&w=400&h=200&fit=crop",
        url: "https://www.skillindia.gov.in",
    },
];

const INITIATIVES = [
    {
        id: "surya-ghar", title: "PM Surya Ghar",
        desc: { en: "Free electricity via rooftop solar. Subsidy up to ₹78,000.", hi: "छत पर सोलर से मुफ्त बिजली। ₹78,000 तक सब्सिडी।" },
        icon: SunMedium,
        img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=60&w=600&fit=crop",
        url: "https://pmsuryaghar.gov.in",
    },
    {
        id: "jal-jeevan", title: "Jal Jeevan Mission",
        desc: { en: "Safe drinking water via household tap connections for every home.", hi: "हर घर में नल से सुरक्षित पेयजल।" },
        icon: Droplet,
        img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=60&w=600&fit=crop",
        url: "https://jaljeevanmission.gov.in",
    },
];

const SCHEMES = [
    { id: "pmkisan", acronym: "PM-KISAN", desc: { en: "₹6,000/yr for farmers", hi: "किसानों को ₹6,000/वर्ष" }, emoji: "🌾", url: "https://pmkisan.gov.in" },
    { id: "pmay", acronym: "PMAY", desc: { en: "Housing for All", hi: "सबके लिए आवास" }, emoji: "🏠", url: "https://pmaymis.gov.in" },
    { id: "epfo", acronym: "EPFO", desc: { en: "Retirement Fund", hi: "भविष्य निधि" }, emoji: "💼", url: "https://www.epfindia.gov.in" },
    { id: "eshram", acronym: "e-SHRAM", desc: { en: "Unorganized Workers", hi: "असंगठित श्रमिक" }, emoji: "🪪", url: "https://eshram.gov.in" },
    { id: "ayushman", acronym: "Ayushman", desc: { en: "₹5L health cover", hi: "₹5 लाख स्वास्थ्य कवर" }, emoji: "🏥", url: "https://pmjay.gov.in" },
    { id: "mudra", acronym: "MUDRA", desc: { en: "Business loans ₹10L", hi: "व्यापार ऋण ₹10 लाख" }, emoji: "💰", url: "https://www.mudra.org.in" },
];

const FAQS = [
    {
        q: { en: "Is this an official government website?", hi: "क्या यह सरकारी वेबसाइट है?" },
        a: { en: "No. We are an independent platform that helps you discover schemes. We redirect you to official .gov.in sites to apply.", hi: "नहीं। हम एक स्वतंत्र प्लेटफॉर्म हैं। आवेदन के लिए हम आपको .gov.in साइट पर भेजते हैं।" }
    },
    {
        q: { en: "How accurate is the matching?", hi: "मैचिंग कितनी सटीक है?" },
        a: { en: "Our AI uses the latest eligibility criteria from government portals to estimate your eligibility.", hi: "हमारा AI सरकारी पोर्टल से नवीनतम पात्रता मानदंड का उपयोग करता है।" }
    },
    {
        q: { en: "Where is my data stored?", hi: "मेरा डेटा कहाँ स्टोर है?" },
        a: { en: "We do not store any personal data. Your answers stay on your device only.", hi: "हम कोई व्यक्तिगत डेटा स्टोर नहीं करते। आपके उत्तर केवल आपके डिवाइस पर रहते हैं।" }
    },
];

/* ─── Motion variants ─── */
const stagger: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
};

/* ─── Main Component ─── */
export default function NewHomePage() {
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const wizardRef = useRef<HTMLDivElement>(null);

    const scrollToCategories = () => categoriesRef.current?.scrollIntoView({ behavior: "smooth" });

    const launchWizard = () => {
        setShowWizard(true);
        setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    };

    const handleShare = () => {
        const text = lang === "hi"
            ? "🇮🇳 अपनी सरकारी योजना खोजें — मुफ्त AI मैचिंग!\nhttps://yojana-matcher.vercel.app"
            : "🇮🇳 Find your government scheme — free AI matching!\nhttps://yojana-matcher.vercel.app";
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ text }).catch(() => { });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden font-sans text-slate-800">
            {/* ── Fixed Background ── */}
            <div className="fixed inset-0 -z-30 bg-gradient-to-b from-[#FFF3E0] via-white to-[#E8F5E9]" />
            <div className="fixed inset-0 -z-20 pointer-events-none flex items-center justify-center opacity-[0.035]">
                <div className="w-[500px] h-[500px]"><AshokaChakra /></div>
            </div>

            {/* ── Main Container ── */}
            <main className="max-w-md mx-auto min-h-screen bg-white/60 backdrop-blur-md border-x border-white/40 shadow-2xl relative">

                {/* ── Sticky Header ── */}
                <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100/60">
                    <motion.button whileTap={{ scale: 0.93 }} onClick={handleShare}
                        className="flex items-center gap-1.5 border border-[#25D366]/40 text-[#25D366] pl-3 pr-4 py-1.5 rounded-full text-xs font-bold bg-white shadow-sm active:bg-green-50 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        {tx("shareStatus", lang)}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.93 }}
                        onClick={() => setLang(lang === "en" ? "hi" : "en")}
                        className="flex items-center gap-1.5 border border-slate-200 pl-3 pr-4 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white shadow-sm active:bg-slate-50 transition-colors">
                        🇮🇳 {lang === "en" ? "हिंदी" : "EN"}
                    </motion.button>
                </header>

                <div className="px-5 pb-20">

                    {/* ── Hero Section ── */}
                    <section className="text-center pt-8 pb-6">
                        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full mb-4 border border-green-100">
                            <Sparkles className="w-3 h-3" /> FREE · AI-POWERED · 8 QUICK TAPS
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-[2.5rem] leading-[1.1] font-black text-slate-900 tracking-tight">
                            {tx("findYojana", lang)}{" "}
                            <span className="text-[#166534] relative">
                                {tx("yojana", lang)}
                                <svg className="absolute -bottom-1 left-0 w-full h-2 text-green-200" viewBox="0 0 100 8" preserveAspectRatio="none">
                                    <path d="M0 7 Q 25 0, 50 4 Q 75 8, 100 1" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                            </span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                            className="text-slate-500 text-sm font-medium leading-relaxed mt-4 max-w-xs mx-auto">
                            {tx("subtitle", lang)}
                        </motion.p>

                        <motion.button whileTap={{ scale: 0.96 }} onClick={showWizard ? scrollToCategories : launchWizard}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="mt-6 inline-flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-green-200/50 active:scale-[0.97] transition-all">
                            <ArrowDown className="w-4 h-4" />
                            {tx("startMatching", lang)}
                        </motion.button>
                    </section>

                    {/* ── Inline Wizard (appears when Start Matching is clicked) ── */}
                    <AnimatePresence>
                        {showWizard && (
                            <motion.section ref={wizardRef}
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className="overflow-hidden">
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-green-100 shadow-lg p-5 mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-base font-black text-slate-800">
                                            {lang === "en" ? "🎯 Your Eligibility Check" : "🎯 आपकी पात्रता जांच"}
                                        </h2>
                                        <button onClick={() => setShowWizard(false)} className="text-xs text-slate-400 hover:text-red-500 font-bold transition-colors">
                                            ✕ {lang === "en" ? "Close" : "बंद करें"}
                                        </button>
                                    </div>
                                    <YojanaForm lang={lang} />
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* ── Section 1: Categories ── */}
                    <section ref={categoriesRef} className="pt-2 pb-2">
                        <h2 className="text-lg font-bold text-slate-800 mb-1">{tx("lookingFor", lang)}</h2>
                        <p className="text-xs text-slate-400 font-medium mb-4">{tx("tapToExplore", lang)}</p>
                        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
                            className="flex flex-col gap-2.5">
                            {CATEGORIES.map((cat) => (
                                <motion.a key={cat.id} href={cat.url} target="_blank" rel="noopener noreferrer"
                                    variants={fadeUp} whileTap={{ scale: 0.97 }}
                                    onClick={(e) => { e.preventDefault(); launchWizard(); }}
                                    className={`flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border ${cat.border} hover:shadow-md active:bg-slate-50 transition-all group overflow-hidden relative cursor-pointer`}>
                                    <div className="flex items-center gap-3.5 relative z-10">
                                        <div className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                                            <cat.icon className={`w-5 h-5 ${cat.color}`} />
                                        </div>
                                        <span className="font-bold text-sm text-slate-700">{cat.label[lang]}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#166534] group-active:translate-x-0.5 transition-all relative z-10 flex-shrink-0" />

                                    {/* Masked Right Image */}
                                    <div className="absolute right-0 top-0 h-full w-2/5 z-0 pointer-events-none"
                                        style={{ WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 60%)", maskImage: "linear-gradient(to right, transparent 0%, black 60%)" }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={cat.img} alt="" loading="lazy" className="w-full h-full object-cover opacity-60" />
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </section>

                    {/* ── Section 2: Government Initiatives ── */}
                    <section className="pt-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">{tx("govInitiatives", lang)}</h2>
                        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                            className="flex flex-col gap-4">
                            {INITIATIVES.map((init) => (
                                <motion.a key={init.id} href={init.url} target="_blank" rel="noopener noreferrer"
                                    variants={fadeUp} whileTap={{ scale: 0.97 }}
                                    className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 active:bg-slate-50 transition-all group block">
                                    {/* Image Band */}
                                    <div className="h-28 w-full relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={init.img} alt={init.title} loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                                        <div className="absolute inset-0 flex items-center pl-5 z-10">
                                            <div className={`w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center`}>
                                                <init.icon className="w-6 h-6 text-[#166534]" />
                                            </div>
                                        </div>
                                        <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-white/70 z-10" />
                                    </div>
                                    <div className="px-5 py-4">
                                        <h3 className="font-black text-base text-slate-800">{init.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1 leading-snug">{init.desc[lang]}</p>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </section>

                    {/* ── Section 3: Scheme Grid ── */}
                    <section className="pt-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">{tx("schemesWeCover", lang)}</h2>
                        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                            className="grid grid-cols-2 gap-2.5">
                            {SCHEMES.map((s) => (
                                <motion.a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                                    variants={fadeUp} whileTap={{ scale: 0.94 }}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left hover:shadow-md active:bg-slate-50 transition-all relative overflow-hidden block">
                                    <h4 className="font-black text-slate-800 text-sm">{s.acronym}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1 pr-7 line-clamp-2">{s.desc[lang]}</p>
                                    <div className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-lg">{s.emoji}</div>
                                </motion.a>
                            ))}
                        </motion.div>
                        <a href="https://www.india.gov.in/my-government/schemes" target="_blank" rel="noopener noreferrer"
                            className="mt-4 block text-center text-sm font-bold text-[#166534] hover:underline active:opacity-70 transition-opacity">
                            {tx("viewAll", lang)}
                        </a>
                    </section>

                    {/* ── Section 4: FAQ ── */}
                    <section className="pt-8 pb-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">{tx("faq", lang)}</h2>
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100/80">
                            {FAQS.map((faq, idx) => (
                                <div key={idx}>
                                    <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full text-left px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none">
                                        <span className="font-bold text-[13px] text-slate-700 pr-3 leading-snug">{faq.q[lang]}</span>
                                        <motion.div animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${expandedFaq === idx ? "bg-[#166534] text-white" : "bg-slate-100 text-slate-400"}`}>
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === idx && (
                                            <motion.div initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}>
                                                <div className="px-4 pb-4 text-sm text-slate-500 font-medium leading-relaxed">
                                                    {faq.a[lang]}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Footer ── */}
                    <footer className="text-center text-[10px] text-slate-400 pt-4 pb-6 space-y-1 border-t border-slate-100">
                        <p>Not affiliated with the Government of India.</p>
                        <p>Data sourced from <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="underline">india.gov.in</a> · © 2026 Yojana Matcher</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
