"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Search,
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
    ArrowRight,
    Share2,
} from "lucide-react";
import Image from "next/image";

// Reusable translation wrapper (simplified for this demo)
const tx = (key: string, lang: "en" | "hi") => {
    const translations: Record<string, Record<"en" | "hi", string>> = {
        shareStatus: { en: "Share on Status", hi: "स्टेटस पर शेयर करें" },
        findYojana: { en: "Find Your", hi: "अपनी खोजें" },
        yojana: { en: "Yojana", hi: "योजना" },
        subtitle: {
            en: "Secure and match with government schemes you qualify for.",
            hi: "सुरक्षित रहें और उन सरकारी योजनाओं से जुड़ें जिनके आप योग्य हैं।",
        },
        searchPlaceholder: { en: "Search for schemes...", hi: "योजनाएं खोजें..." },
        lookingFor: { en: "What are you looking for?", hi: "आप क्या खोज रहे हैं?" },
        govInitiatives: { en: "Government Initiatives", hi: "सरकारी पहल" },
        schemesWeCover: { en: "Schemes We Cover", hi: "योजनाएं जो हम कवर करते हैं" },
        faq: { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न" },
    };
    return translations[key]?.[lang] || key;
};

// SVG Watermarks (Inline for portability and styling)
const AshokaChakra = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-900/5 spin-slow" fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
        {[...Array(24)].map((_, i) => (
            <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke="currentColor"
                strokeWidth="1.5"
                transform={`rotate(${i * 15} 50 50)`}
            />
        ))}
    </svg>
);

const TajMahalSilhoutte = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full text-green-900/10" fill="currentColor">
        <path d="M100 10 C90 30, 80 50, 70 50 L70 90 L130 90 L130 50 C120 50, 110 30, 100 10 Z" />
        <path d="M40 40 C35 55, 30 70, 30 90 L50 90 L50 55 C45 55, 42 45, 40 40 Z" />
        <path d="M160 40 C165 55, 170 70, 170 90 L150 90 L150 55 C155 55, 158 45, 160 40 Z" />
    </svg>
);

const RedFortSilhoutte = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full text-orange-900/10" fill="currentColor">
        <rect x="20" y="50" width="30" height="40" />
        <rect x="150" y="50" width="30" height="40" />
        <rect x="60" y="40" width="80" height="50" />
        <polygon points="20,50 35,30 50,50" />
        <polygon points="150,50 165,30 180,50" />
        <polygon points="60,40 100,20 140,40" />
    </svg>
)

// Data Arrays
const CATEGORIES = [
    { id: "business", icon: Briefcase, label: "Start a Business", color: "text-blue-600", bg: "bg-blue-50", img: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=600" },
    { id: "farming", icon: Wheat, label: "Farming & Agriculture", color: "text-green-600", bg: "bg-green-50", img: "https://images.unsplash.com/photo-1586771107445-d3afeb0dece5?q=80&w=600" },
    { id: "education", icon: GraduationCap, label: "Education & Scholarship", color: "text-purple-600", bg: "bg-purple-50", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600" },
    { id: "health", icon: HeartPulse, label: "Health & Insurance", color: "text-rose-600", bg: "bg-rose-50", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600" },
    { id: "housing", icon: Home, label: "Housing", color: "text-amber-600", bg: "bg-amber-50", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600" },
    { id: "skills", icon: Wrench, label: "Skill Training", color: "text-slate-600", bg: "bg-slate-50", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600" },
];

const INITIATIVES = [
    {
        id: "surya-ghar",
        title: "PM Surya Ghar",
        desc: "Free electricity via rooftop solar panels. Subsidy up to ₹78,000.",
        icon: SunMedium,
        bgImg: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
    },
    {
        id: "jal-jeevan",
        title: "Jal Jeevan Mission",
        desc: "Safe and adequate drinking water through individual household tap connections.",
        icon: Droplet,
        bgImg: "https://images.unsplash.com/photo-1519494336049-7557e4e16447?q=80&w=800",
    },
];

const SCHEMES = [
    { id: "pmkisan", acronym: "PM-KISAN", desc: "₹6,000/yr for farmers", img: "🌾" },
    { id: "pmay", acronym: "PMAY", desc: "Housing for All", img: "🏠" },
    { id: "epfo", acronym: "EPFO", desc: "Retirement Fund", img: "💼" },
    { id: "eshram", acronym: "e-SHRAM", desc: "Unorganized Workers", img: "🪪" },
];

const FAQS = [
    {
        q: "Is this an official government website?",
        a: "No, this is an independent platform that helps you discover schemes. We direct you to official .gov.in websites to apply.",
    },
    {
        q: "How accurate is the matching?",
        a: "Our AI uses the latest criteria published by government portals to estimate your eligibility accurately.",
    },
    {
        q: "Where is my data stored?",
        a: "We do not store your personal data. Your answers reside temporarily on your device to find matches.",
    },
];

// Animation Variants
const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function NewHomePage() {
    const [lang, setLang] = useState<"en" | "hi">("en");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen relative overflow-hidden font-sans text-slate-800">
            {/* Global Background */}
            <div className="fixed inset-0 z-[-20] bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000')] bg-center bg-cover" />
            <div className="fixed inset-0 z-[-15] bg-gradient-to-b from-orange-200/90 via-white/95 to-green-200/90" />

            {/* Background Watermarks */}
            <div className="fixed top-20 left-10 w-64 h-64 -z-10 pointer-events-none opacity-40">
                <RedFortSilhoutte />
            </div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 -z-10 pointer-events-none opacity-20 hidden md:block">
                <AshokaChakra />
            </div>
            <div className="fixed bottom-0 right-10 w-80 h-80 -z-10 pointer-events-none opacity-40">
                <TajMahalSilhoutte />
            </div>

            {/* Main Glassmorphism Container */}
            <main className="max-w-md mx-auto min-h-screen bg-white/40 backdrop-blur-sm border-l border-r border-white/50 shadow-2xl relative pb-20">

                {/* Header Top Bar */}
                <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-white/40">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white border border-[#25D366]/30 text-[#25D366] px-4 py-2 rounded-full shadow-sm text-sm font-bold shadow-[#25D366]/10"
                    >
                        <Share2 className="w-4 h-4" />
                        {tx("shareStatus", lang)}
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLang(lang === "en" ? "hi" : "en")}
                        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-700"
                    >
                        <span>🇮🇳</span> {lang === "en" ? "A/अ HI" : "A/अ EN"}
                    </motion.button>
                </header>

                <div className="p-5 space-y-10">

                    {/* Hero Section */}
                    <section className="text-center space-y-4 tracking-tight pt-4">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-slate-900 drop-shadow-sm"
                        >
                            {tx("findYojana", lang)} <span className="text-[#166534]">{tx("yojana", lang)}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-slate-600 font-medium text-sm leading-relaxed px-4"
                        >
                            {tx("subtitle", lang)}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                            className="relative max-w-sm mx-auto mt-6 group"
                        >
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#166534] transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#166534]/20 focus:border-[#166534] transition-all shadow-sm font-medium"
                                placeholder={tx("searchPlaceholder", lang)}
                            />
                            <button className="absolute inset-y-2 right-2 bg-[#166534] text-white rounded-xl px-3 hover:bg-[#155e30] transition-colors flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </section>

                    {/* Section 1: Categories */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{tx("lookingFor", lang)}</h2>
                        <motion.div
                            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
                            className="flex flex-col gap-3"
                        >
                            {CATEGORIES.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    variants={fadeUpItem}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-[#166534]/30 hover:shadow-md transition-all group overflow-hidden relative"
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center`}>
                                            <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                        </div>
                                        <span className="font-bold text-slate-700">{cat.label}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#166534] transition-colors relative z-10" />

                                    {/* Subtly Masked Right Image */}
                                    <div
                                        className="absolute right-0 top-0 h-full w-1/3 z-0 pointer-events-none"
                                        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black)' }}
                                    >
                                        <img src={cat.img} alt={cat.label} className="w-full h-full object-cover opacity-80" />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </section>

                    {/* Section 2: Highlighted Schemes */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{tx("govInitiatives", lang)}</h2>
                        <motion.div
                            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                            className="flex flex-col gap-4"
                        >
                            {INITIATIVES.map((init) => (
                                <motion.div
                                    key={init.id}
                                    variants={fadeUpItem}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer group"
                                >
                                    {/* Image Header Band */}
                                    <div className="h-24 w-full relative overflow-hidden p-5">
                                        <img src={init.bgImg} alt={init.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
                                        <div className="relative z-20 h-full flex items-center">
                                            <init.icon className="w-12 h-12 text-[#166534] drop-shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="p-5 pt-4">
                                        <h3 className="font-black text-lg text-slate-800 mb-1">{init.title}</h3>
                                        <p className="text-sm font-medium text-slate-500 leading-snug">{init.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* Section 3: Scheme Grid */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{tx("schemesWeCover", lang)}</h2>
                        <motion.div
                            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {SCHEMES.map((scheme) => (
                                <motion.button
                                    key={scheme.id}
                                    variants={fadeUpItem}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left hover:border-green-200 transition-colors relative overflow-hidden"
                                >
                                    <h4 className="font-black text-slate-800 text-sm">{scheme.acronym}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1 pr-6 tracking-tight line-clamp-2">{scheme.desc}</p>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-lg shadow-inner">
                                        {scheme.img}
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </section>

                    {/* Section 4: FAQ */}
                    <section className="pb-10">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{tx("faq", lang)}</h2>
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            {FAQS.map((faq, idx) => (
                                <div key={idx} className="overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                        className="w-full text-left p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors focus:outline-none"
                                    >
                                        <span className="font-bold text-sm text-slate-700 pr-4">{faq.q}</span>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${expandedFaq === idx ? "bg-[#166534] text-white" : "bg-slate-100 text-slate-400"}`}
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="px-4 pb-4 pt-1 text-sm text-slate-500 font-medium leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
