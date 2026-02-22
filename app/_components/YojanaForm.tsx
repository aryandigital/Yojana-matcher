"use client";

import { useState, useCallback } from "react";
import {
  Search, Loader2, ExternalLink, AlertCircle,
  ChevronLeft, User, IndianRupee, MapPin,
  GraduationCap, Users, RefreshCw, Sparkles, Share2,
  PhoneCall, ChevronDown, TrendingUp, Star, Briefcase, Copy, CheckCircle2,
} from "lucide-react";
import type { Scheme, UserProfile, SchemeCategory } from "@/lib/schemes";
import { getMatchScore } from "@/lib/schemes";
import { tx, type Lang } from "@/lib/i18n";

interface ApiResponse {
  profile?: UserProfile;
  schemes?: Scheme[];
  error?: string;
}

interface WizardData {
  purpose: string;
  age: number;
  gender: string;
  employment: string;
  state: string;
  income_lpa: number;
  category: string;
  education: string;
}

const DEFAULT: WizardData = {
  purpose:"", age:0, gender:"", employment:"",
  state:"unknown", income_lpa:-1, category:"", education:"",
};

const STEPS = ["purpose","age","gender","employment","category","income","education","state"] as const;
type Step = typeof STEPS[number];

// ── Wizard data ──────────────────────────────────────────────────────
const PURPOSES = [
  { value:"business",  emoji:"🚀", labelKey:"purposeBusiness" as const },
  { value:"farming",   emoji:"🌾", labelKey:"purposeFarming"  as const },
  { value:"education", emoji:"🎓", labelKey:"purposeEdu"      as const },
  { value:"health",    emoji:"🏥", labelKey:"purposeHealth"   as const },
  { value:"housing",   emoji:"🏠", labelKey:"purposeHousing"  as const },
  { value:"skill",     emoji:"⚙️", labelKey:"purposeSkill"    as const },
  { value:"invest",    emoji:"📈", labelKey:"purposeInvest"   as const },
  { value:"all",       emoji:"🌐", labelKey:"purposeAll"      as const },
];

const AGE_BANDS = [
  { label:{ en:"Under 18", hi:"18 से कम" },    emoji:"🧒", mid:14 },
  { label:{ en:"18 – 25",  hi:"18 – 25" },      emoji:"🎓", mid:21 },
  { label:{ en:"26 – 35",  hi:"26 – 35" },      emoji:"💼", mid:30 },
  { label:{ en:"36 – 50",  hi:"36 – 50" },      emoji:"🏠", mid:43 },
  { label:{ en:"51 – 60",  hi:"51 – 60" },      emoji:"🌿", mid:55 },
  { label:{ en:"60+",      hi:"60 से ऊपर" },     emoji:"🧓", mid:65 },
];

const GENDERS = [
  { label:{ en:"Male",   hi:"पुरुष" }, emoji:"👨", value:"male"   },
  { label:{ en:"Female", hi:"महिला" }, emoji:"👩", value:"female" },
  { label:{ en:"Other",  hi:"अन्य" },  emoji:"🧑", value:"other"  },
];

// Employment options with visual illustration gradients
const EMPLOYMENT_OPTIONS = [
  {
    value:"government", emoji:"🏛️",
    gradient:"from-blue-600 to-indigo-600",
    badge:{ en:"⚠️ Some schemes excluded", hi:"⚠️ कुछ योजनाएं लागू नहीं" },
    label:{ en:"Government Employee",       hi:"सरकारी कर्मचारी" },
    desc:{ en:"Central/State govt job",      hi:"केंद्र/राज्य सरकार नौकरी" },
  },
  {
    value:"private", emoji:"🏢",
    gradient:"from-slate-600 to-gray-700",
    badge:{ en:"✅ Most schemes apply", hi:"✅ अधिकांश योजनाएं लागू" },
    label:{ en:"Private Sector Employee",    hi:"प्राइवेट कर्मचारी" },
    desc:{ en:"Company / corporate job",     hi:"कंपनी / कॉर्पोरेट नौकरी" },
  },
  {
    value:"self_employed", emoji:"🏪",
    gradient:"from-orange-500 to-amber-500",
    badge:{ en:"✅ Business loans & subsidies", hi:"✅ बिज़नेस लोन और सब्सिडी" },
    label:{ en:"Self-Employed / Business",   hi:"स्व-रोजगार / व्यापार" },
    desc:{ en:"Own shop/business/profession",hi:"खुद का काम/व्यापार" },
  },
  {
    value:"gig", emoji:"🛵",
    gradient:"from-teal-500 to-cyan-500",
    badge:{ en:"✅ e-SHRAM + gig benefits", hi:"✅ e-श्रम + गिग लाभ" },
    label:{ en:"Gig / Freelance Worker",     hi:"गिग / फ्रीलांस" },
    desc:{ en:"Ola, Uber, Swiggy, Upwork…", hi:"Ola, Uber, Swiggy, Upwork…" },
  },
  {
    value:"farmer", emoji:"🌾",
    gradient:"from-green-500 to-lime-500",
    badge:{ en:"✅ PM-KISAN + crop cover", hi:"✅ PM-किसान + फसल बीमा" },
    label:{ en:"Farmer / Agricultural Worker",hi:"किसान / कृषि मजदूर" },
    desc:{ en:"Own or leased farmland",      hi:"खुद की या पट्टे की जमीन" },
  },
  {
    value:"daily_wage", emoji:"🪚",
    gradient:"from-yellow-500 to-orange-400",
    badge:{ en:"✅ e-SHRAM + APY eligible", hi:"✅ e-श्रम + APY पात्र" },
    label:{ en:"Daily Wage / Construction",  hi:"दिहाड़ी / निर्माण" },
    desc:{ en:"Labour, helper, mason…",      hi:"मजदूर, सहायक, राजमिस्त्री…" },
  },
  {
    value:"student", emoji:"📚",
    gradient:"from-purple-500 to-violet-500",
    badge:{ en:"✅ Scholarships & training", hi:"✅ छात्रवृत्ति और प्रशिक्षण" },
    label:{ en:"Student",                    hi:"छात्र" },
    desc:{ en:"School / college / university",hi:"स्कूल/कॉलेज/यूनिवर्सिटी" },
  },
  {
    value:"unemployed", emoji:"🔍",
    gradient:"from-rose-500 to-pink-500",
    badge:{ en:"✅ Skill training & loans", hi:"✅ कौशल प्रशिक्षण और लोन" },
    label:{ en:"Unemployed / Homemaker",     hi:"बेरोजगार / गृहिणी" },
    desc:{ en:"Looking for work or at home", hi:"काम की तलाश में या घर पर" },
  },
];

const CATEGORIES = [
  { label:{ en:"General", hi:"सामान्य" }, desc:{ en:"No reservation", hi:"कोई आरक्षण नहीं" },       emoji:"🏛️", value:"general" },
  { label:{ en:"OBC",     hi:"OBC" },     desc:{ en:"Other Backward Classes", hi:"अन्य पिछड़ा वर्ग" }, emoji:"📋", value:"OBC" },
  { label:{ en:"SC",      hi:"SC" },      desc:{ en:"Scheduled Caste", hi:"अनुसूचित जाति" },          emoji:"⚖️", value:"SC" },
  { label:{ en:"ST",      hi:"ST" },      desc:{ en:"Scheduled Tribe", hi:"अनुसूचित जनजाति" },        emoji:"🌿", value:"ST" },
];

const INCOME_BANDS = [
  { label:{ en:"No income",     hi:"कोई आमदनी नहीं" },  emoji:"🔍", value:0,   desc:{ en:"Unemployed / Student", hi:"बेरोजगार / छात्र" } },
  { label:{ en:"Under ₹1 LPA", hi:"₹1 लाख से कम" },   emoji:"💧", value:0.8, desc:{ en:"Below poverty line",   hi:"गरीबी रेखा से नीचे" } },
  { label:{ en:"₹1 – 2.5 LPA", hi:"₹1 – 2.5 लाख" },   emoji:"🌱", value:1.8, desc:{ en:"Low income",           hi:"कम आमदनी" } },
  { label:{ en:"₹2.5 – 5 LPA", hi:"₹2.5 – 5 लाख" },   emoji:"🌿", value:3.5, desc:{ en:"Lower-middle",         hi:"निम्न मध्यम वर्ग" } },
  { label:{ en:"₹5 – 10 LPA",  hi:"₹5 – 10 लाख" },     emoji:"💼", value:7.5, desc:{ en:"Middle income",        hi:"मध्यम आमदनी" } },
  { label:{ en:"₹10 – 18 LPA", hi:"₹10 – 18 लाख" },    emoji:"🏢", value:14,  desc:{ en:"Upper-middle",         hi:"उच्च मध्यम वर्ग" } },
  { label:{ en:"Above ₹18 LPA",hi:"₹18 लाख से ऊपर" },  emoji:"🏆", value:25,  desc:{ en:"High income",          hi:"उच्च आमदनी" } },
];

const EDUCATION_LEVELS = [
  { label:{ en:"Below 10th",      hi:"10वीं से कम" },   emoji:"📚", value:"below 10th"   },
  { label:{ en:"10th Pass",       hi:"10वीं पास" },      emoji:"📗", value:"10th pass"    },
  { label:{ en:"12th Pass",       hi:"12वीं पास" },      emoji:"📘", value:"12th pass"    },
  { label:{ en:"Graduation",      hi:"स्नातक" },         emoji:"🎓", value:"graduation"   },
  { label:{ en:"Post Graduation", hi:"परास्नातक" },      emoji:"🔬", value:"postgraduate" },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry","Jammu & Kashmir","Ladakh",
];

// State-wise doorstep service portals
const DOORSTEP_LINKS: Record<string, { name: string; url: string; nameHi: string }> = {
  "Delhi":           { name:"Delhi Doorstep Services",   nameHi:"दिल्ली डोरस्टेप सेवाएं",   url:"https://edistrict.delhigovt.nic.in" },
  "Maharashtra":     { name:"Aaple Sarkar",               nameHi:"आपले सरकार",               url:"https://aaplesarkar.mahaonline.gov.in" },
  "Uttar Pradesh":   { name:"UP e-Seva / Jansewa Kendra", nameHi:"UP e-सेवा / जनसेवा केंद्र",url:"https://edistrict.up.gov.in" },
  "Bihar":           { name:"RTPS Bihar",                 nameHi:"RTPS बिहार",               url:"https://serviceonline.bihar.gov.in" },
  "Rajasthan":       { name:"Rajasthan Single Sign On",   nameHi:"राजस्थान SSO पोर्टल",      url:"https://sso.rajasthan.gov.in" },
  "Madhya Pradesh":  { name:"MP e-Nagar Palika",          nameHi:"MP e-नगर पालिका",          url:"https://mpedistrict.gov.in" },
  "Tamil Nadu":      { name:"TN e-Sevai",                 nameHi:"TN e-सेवाई",               url:"https://www.tnesevai.tn.gov.in" },
  "Telangana":       { name:"TS Mee Seva",                nameHi:"TS मी सेवा",               url:"https://ts.meeseva.telangana.gov.in" },
  "Karnataka":       { name:"Atalji Janasnehi Kendra",    nameHi:"अटलजी जनस्नेही केंद्र",   url:"https://nadakacheri.karnataka.gov.in" },
  "Gujarat":         { name:"Digital Gujarat",            nameHi:"डिजिटल गुजरात",            url:"https://digitalgujarat.gov.in" },
  "West Bengal":     { name:"Duare Sarkar",               nameHi:"दुआरे सरकार",              url:"https://wb.gov.in/government-schemes" },
  "Kerala":          { name:"Kerala Akshaya e-Kendra",    nameHi:"केरल अक्षय e-केंद्र",     url:"https://akshaya.kerala.gov.in" },
  "Haryana":         { name:"Antyodaya Saral Portal",     nameHi:"अंत्योदय सरल पोर्टल",    url:"https://saralharyana.gov.in" },
  "Punjab":          { name:"Punjab Sewa Kendra",         nameHi:"पंजाब सेवा केंद्र",       url:"https://connect.punjab.gov.in" },
  "Assam":           { name:"Assam e-District",           nameHi:"असम e-जिला",               url:"https://edistrict.assam.gov.in" },
  "Andhra Pradesh":  { name:"AP MeeSeva",                 nameHi:"AP MeeSeva",               url:"https://www.meeseva.gov.in" },
  "Odisha":          { name:"Odisha e-District",          nameHi:"ओडिशा e-जिला",            url:"https://edistrict.odisha.gov.in" },
  "Jharkhand":       { name:"Jharkhand e-District",       nameHi:"झारखंड e-जिला",           url:"https://jharkhand.gov.in/eDistrict" },
  "Chhattisgarh":    { name:"CG e-District",              nameHi:"CG e-जिला",                url:"https://edistrict.cgstate.gov.in" },
  "Himachal Pradesh":{ name:"HP e-Samadhan",              nameHi:"HP e-समाधान",              url:"https://edistrict.hp.gov.in" },
};

// Category filter config
const CATEGORY_FILTERS: { key: SchemeCategory | "All"; label: { en: string; hi: string }; emoji: string }[] = [
  { key:"All",        label:{ en:"All",        hi:"सभी" },      emoji:"✨" },
  { key:"Business",   label:{ en:"Business",   hi:"व्यापार" },  emoji:"🚀" },
  { key:"Insurance",  label:{ en:"Insurance",  hi:"बीमा" },     emoji:"🛡️" },
  { key:"Investment", label:{ en:"Investment", hi:"निवेश" },    emoji:"📈" },
  { key:"Agriculture",label:{ en:"Farming",    hi:"कृषि" },     emoji:"🌾" },
  { key:"Health",     label:{ en:"Health",     hi:"स्वास्थ्य" },emoji:"💊" },
  { key:"Education",  label:{ en:"Education",  hi:"शिक्षा" },   emoji:"🎓" },
  { key:"Pension",    label:{ en:"Pension",    hi:"पेंशन" },    emoji:"🧓" },
  { key:"Welfare",    label:{ en:"Welfare",    hi:"कल्याण" },   emoji:"🪪" },
  { key:"Housing",    label:{ en:"Housing",    hi:"आवास" },     emoji:"🏠" },
  { key:"Banking",    label:{ en:"Banking",    hi:"बैंकिंग" },  emoji:"🏧" },
];

// ── Sub-components ───────────────────────────────────────────────────

function OptionCard({ emoji, label, desc, selected, onClick }: {
  emoji: string; label: string; desc?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 text-left active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-green-400
        ${selected ? "border-green-500 bg-green-50 shadow-md shadow-green-100" : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/40"}`}>
      <span className="text-2xl w-8 text-center flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-snug ${selected ? "text-green-700" : "text-gray-800"}`}>{label}</p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-green-500 bg-green-500" : "border-gray-200"}`}>
        {selected && <span className="w-2.5 h-2.5 bg-white rounded-full block" />}
      </div>
    </button>
  );
}

// Employment card with visual illustration header
function EmploymentCard({
  option, selected, onClick, lang,
}: {
  option: typeof EMPLOYMENT_OPTIONS[0]; selected: boolean; onClick: () => void; lang: Lang;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-150 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-green-400
        ${selected ? "border-green-500 shadow-md shadow-green-100" : "border-gray-100 hover:border-green-200"}`}>
      {/* Illustration header */}
      <div className={`relative bg-gradient-to-br ${option.gradient} flex items-center gap-3 px-4 py-3 overflow-hidden`}>
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-white/10 rounded-full" />
        <span className="text-3xl relative z-10" role="img">{option.emoji}</span>
        <p className="text-white font-black text-sm relative z-10">{option.label[lang]}</p>
        {selected && (
          <span className="ml-auto bg-white/30 rounded-full p-0.5 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </span>
        )}
      </div>
      {/* Body */}
      <div className={`px-4 py-2.5 flex items-center justify-between gap-2 ${selected ? "bg-green-50" : "bg-white"}`}>
        <p className="text-[11px] text-gray-500">{option.desc[lang]}</p>
        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{option.badge[lang]}</span>
      </div>
    </button>
  );
}

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-400
          ${i < current ? "bg-green-500" : i === current ? "bg-green-300" : "bg-gray-100"}`} />
      ))}
    </div>
  );
}

function SummaryChip({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
      <Icon className="w-3 h-3 text-green-500 flex-shrink-0" />
      <span className="text-[11px] font-bold text-green-700 capitalize whitespace-nowrap">{value}</span>
    </div>
  );
}

// Scheme illustration header — gives every card a unique visual identity
function SchemeIllustration({ emoji, gradient }: { emoji: string; gradient: string }) {
  return (
    <div className={`relative h-24 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
      <span className="text-5xl relative z-10 drop-shadow-lg" role="img">{emoji}</span>
    </div>
  );
}

function MatchBadge({ score, isTop, lang }: { score: number; isTop: boolean; lang: Lang }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black
      ${isTop ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
      {isTop ? <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> : <TrendingUp className="w-3 h-3" />}
      {isTop ? tx("topPick", lang) : `${tx("matchScore", lang)} ${score}%`}
    </span>
  );
}

function SchemeCard({ scheme, profile, isTop, lang }: {
  scheme: Scheme; profile: UserProfile; isTop: boolean; lang: Lang;
}) {
  const [showSteps, setShowSteps] = useState(false);
  const score = getMatchScore(scheme, profile);
  const hostname = (() => { try { return new URL(scheme.applyUrl).hostname; } catch { return "gov.in"; } })();

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
      {/* Visual illustration header */}
      <SchemeIllustration emoji={scheme.illustration.emoji} gradient={scheme.illustration.gradient} />

      <div className="p-5">
        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider ${scheme.tagColor}`}>
            {lang === "hi" ? scheme.tagHi : scheme.tag}
          </span>
          <MatchBadge score={score} isTop={isTop} lang={lang} />
        </div>

        <h3 className="font-black text-gray-900 text-base leading-snug mb-0.5">
          {lang === "hi" ? scheme.nameHi : scheme.name}
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">
          {lang === "hi" ? scheme.ministryHi : scheme.ministry}
        </p>

        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          {lang === "hi" ? scheme.descriptionHi : scheme.description}
        </p>

        {/* Estimated benefit — hero number */}
        <div className={`bg-gradient-to-r ${scheme.illustration.gradient} rounded-2xl px-4 py-3.5 mb-3 text-white`}>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{tx("estBenefit", lang)}</p>
          <p className="text-lg font-black leading-tight">
            {lang === "hi" ? scheme.estimatedBenefitHi : scheme.estimatedBenefit}
          </p>
        </div>

        {/* Why good */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1">{tx("whyGood", lang)}</p>
          <p className="text-xs text-gray-700 leading-relaxed">
            {lang === "hi" ? scheme.whyGoodForYouHi : scheme.whyGoodForYou}
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{tx("eligibility", lang)}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {lang === "hi" ? scheme.eligibilityHi : scheme.eligibility}
          </p>
        </div>

        {/* How to apply accordion */}
        <button type="button" onClick={() => setShowSteps(v => !v)}
          style={{ minHeight:"auto", minWidth:"auto" }}
          className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl mb-3 hover:bg-blue-100 transition-colors">
          <span className="text-xs font-bold text-blue-700">{tx("howApply", lang)}</span>
          <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform ${showSteps ? "rotate-180" : ""}`} />
        </button>
        {showSteps && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-4 mb-3 animate-fadeIn space-y-3">
            {scheme.applySteps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{lang === "hi" ? s.stepHi : s.step}</p>
              </div>
            ))}
          </div>
        )}

        {/* Apply CTA */}
        <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl px-4 py-3.5 transition-colors group">
          <span>{tx("applyBtn", lang)}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500">{hostname}</span>
            <ExternalLink className="w-3.5 h-3.5 text-green-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </article>
  );
}

function Skeleton({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {[0,1,2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ opacity: 1 - i * 0.2 }}>
          <div className="skeleton h-24 w-full" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-16 rounded-xl" />
            <div className="skeleton h-12 rounded-xl" />
            <div className="skeleton h-10 rounded-xl" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        <p className="text-xs text-gray-400">{tx("loading", lang)}</p>
      </div>
    </div>
  );
}

function buildShareText(schemes: Scheme[], lang: Lang): string {
  const lines = schemes.slice(0, 3).map((s, i) =>
    `${i+1}. *${lang==="hi"?s.nameHi:s.name}* — ${lang==="hi"?s.estimatedBenefitHi:s.estimatedBenefit}`
  );
  if (lang === "hi") {
    return `🇮🇳 *सरकारी योजना मिलान*\n\nमुझे ये योजनाएं मिलीं:\n\n${lines.join("\n")}\n\n✅ अपनी योजना खोजें: yojana-matcher.vercel.app`;
  }
  return `🇮🇳 *Government Scheme Match*\n\nI qualified for:\n\n${lines.join("\n")}\n\n✅ Find yours free: yojana-matcher.vercel.app`;
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────
export default function YojanaForm({ lang }: { lang: Lang }) {
  const [step, setStep]           = useState(0);
  const [data, setData]           = useState<WizardData>(DEFAULT);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<ApiResponse | null>(null);
  const [apiError, setApiError]   = useState("");
  const [activeFilter, setActiveFilter] = useState<SchemeCategory | "All">("All");

  const totalSteps = STEPS.length;
  const stepName   = STEPS[step] as Step;

  const pick = useCallback((patch: Partial<WizardData>) => {
    const next = { ...data, ...patch };
    setData(next);
    if (step < totalSteps - 1) setTimeout(() => setStep(s => s + 1), 150);
  }, [data, step, totalSteps]);

  const handleSubmit = async (finalData: WizardData) => {
    setLoading(true);
    setResult(null);
    setApiError("");
    setActiveFilter("All");

    const ageBand = AGE_BANDS.find(b => b.mid === finalData.age);
    const incBand = INCOME_BANDS.find(b => b.value === finalData.income_lpa);
    const empOpt  = EMPLOYMENT_OPTIONS.find(e => e.value === finalData.employment);
    const userText = [
      `I am a ${ageBand?.label.en ?? (finalData.age+" yrs old")} ${finalData.gender},`,
      `${finalData.category} category,`,
      `employment: ${empOpt?.label.en ?? (finalData.employment || "not specified")},`,
      `income ${incBand?.label.en ?? (finalData.income_lpa+" LPA")},`,
      `education: ${finalData.education},`,
      `from ${finalData.state}.`,
      `My main goal is ${finalData.purpose}.`,
    ].join(" ");

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 28000);
    try {
      const res = await fetch("/api/match", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ userText, purpose:finalData.purpose, employment:finalData.employment }),
        signal:ctrl.signal,
      });
      clearTimeout(tid);
      const json: ApiResponse = await res.json();
      if (json.error) setApiError(json.error);
      else setResult(json);
    } catch (e: unknown) {
      clearTimeout(tid);
      setApiError(e instanceof DOMException && e.name==="AbortError" ? tx("timeout",lang) : tx("networkError",lang));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0); setData(DEFAULT); setResult(null); setApiError(""); setLoading(false); setActiveFilter("All");
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) return <Skeleton lang={lang} />;

  // ── Error ──────────────────────────────────────────────────────────
  if (apiError) return (
    <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3 animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-bold text-red-700 text-sm">{tx("errorTitle",lang)}</p>
        <p className="text-red-400 text-xs mt-0.5">{apiError}</p>
        <button onClick={handleReset} style={{ minHeight:"auto", minWidth:"auto" }}
          className="mt-3 text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-xl">
          {tx("tryAgain",lang)}
        </button>
      </div>
    </div>
  );

  // ── Results ────────────────────────────────────────────────────────
  if (result?.schemes) {
    const allSchemes = result.schemes;
    const profile    = result.profile!;
    const shareText  = buildShareText(allSchemes, lang);
    const waUrl      = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    // Instagram stories doesn't have a direct deep link — we use navigator.share for native sharing
    const [copied, setCopied] = useState(false);
    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText("https://yojana-matcher.vercel.app");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    };
    const handleNativeShare = async () => {
      const text = shareText;
      if (navigator.share) {
        try { await navigator.share({ title: "Yojana Matcher", text, url: "https://yojana-matcher.vercel.app" }); }
        catch {}
      } else { window.open(waUrl, "_blank"); }
    };

    const filtered = activeFilter === "All"
      ? allSchemes
      : allSchemes.filter(s => s.category === activeFilter);

    const doorstep = data.state !== "unknown" ? DOORSTEP_LINKS[data.state] : null;

    return (
      <div className="animate-fadeIn">

        {/* ── ONE-TAP STORY SHARE BANNER — very visible ── */}
        <div className="relative mb-5 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent)]" />
          <div className="relative px-4 py-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-black text-base">
                  {allSchemes.length} {tx("matched",lang)} 🎉
                </p>
                <p className="text-green-100 text-[11px]">{tx("matchedSub",lang)}</p>
              </div>
            </div>
            {/* Share row — 3 big prominent buttons */}
            <div className="grid grid-cols-3 gap-2">
              {/* WhatsApp */}
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 bg-[#25D366] hover:bg-[#20bc5a] rounded-xl py-2.5 transition-colors text-white"
                style={{ minHeight:"auto", minWidth:"auto" }}>
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="text-[10px] font-black">WhatsApp</span>
              </a>
              {/* Story / Native share */}
              <button type="button" onClick={handleNativeShare}
                className="flex flex-col items-center gap-1.5 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 hover:opacity-90 rounded-xl py-2.5 transition-all text-white"
                style={{ minHeight:"auto", minWidth:"auto" }}>
                <Share2 className="w-5 h-5" />
                <span className="text-[10px] font-black">{lang==="hi"?"स्टोरी शेयर":"Share Story"}</span>
              </button>
              {/* Copy link */}
              <button type="button" onClick={handleCopyLink}
                className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 transition-all text-white ${
                  copied ? "bg-green-400" : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                }`}
                style={{ minHeight:"auto", minWidth:"auto" }}>
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span className="text-[10px] font-black">{copied ? (lang==="hi"?"कॉपी हो गया!":"Copied!") : (lang==="hi"?"लिंक कॉपी":"Copy Link")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile pills ── */}
        {profile && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-500" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{tx("yourProfile",lang)}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <SummaryChip icon={User}          value={`${profile.age}y`} />
              <SummaryChip icon={Users}         value={profile.gender} />
              <SummaryChip icon={Briefcase}     value={data.employment || "–"} />
              <SummaryChip icon={Users}         value={profile.category} />
              <SummaryChip icon={IndianRupee}   value={`${profile.income_lpa}L`} />
              <SummaryChip icon={GraduationCap} value={profile.education} />
              {data.state !== "unknown" && <SummaryChip icon={MapPin} value={data.state} />}
            </div>
          </div>
        )}

        {/* ── Category filter tabs ── */}
        {allSchemes.length > 0 && (
          <div className="mb-4 -mx-1">
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {CATEGORY_FILTERS.filter(f =>
                f.key === "All" || allSchemes.some(s => s.category === f.key)
              ).map(f => (
                <button key={f.key} type="button"
                  onClick={() => setActiveFilter(f.key as SchemeCategory | "All")}
                  style={{ minHeight:"auto", minWidth:"auto" }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all flex-shrink-0
                    ${activeFilter === f.key
                      ? "bg-green-500 text-white border-green-500 shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-green-200"
                    }`}>
                  <span>{f.emoji}</span>
                  <span>{f.label[lang]}</span>
                  <span className="bg-black/10 rounded-full px-1.5 py-0.5 text-[10px]">
                    {f.key === "All" ? allSchemes.length : allSchemes.filter(s => s.category === f.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No matches */}
        {allSchemes.length === 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-800">{tx("noMatch",lang)}</p>
              <p className="text-xs text-amber-500">{tx("noMatchSub",lang)}</p>
            </div>
          </div>
        )}

        {/* Scheme cards */}
        <div className="space-y-4 mb-5">
          {filtered.map((s, i) => (
            <SchemeCard key={s.id} scheme={s} profile={profile} isTop={i === 0 && activeFilter === "All"} lang={lang} />
          ))}
        </div>

        {/* ── Action row: CSC + Aadhaar — prominent cards ── */}
        <div className="space-y-2.5 mb-4">
          <a href="https://locator.csccloud.in/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-4 py-3.5 transition-colors group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">{tx("cscLink",lang)}</p>
              <p className="text-[11px] text-blue-200">{lang==="hi"?"आपके घर के पास सरकारी सेवा केंद्र":"Government service center near your home"}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a href="https://appointments.uidai.gov.in/easearch.aspx" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl px-4 py-3.5 transition-colors group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {/* Aadhaar fingerprint icon */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm9-4.5c1.93 0 3.5 1.57 3.5 3.5 0 1.31-.73 2.46-1.8 3.07C12.45 14.49 12 15 12 16v.5h2V16c0-.28.15-.56.42-.74A5.5 5.5 0 0017 11c0-2.76-2.24-5-5-5s-5 2.24-5 5h2c0-1.93 1.57-3.5 3.5-3.5zM11 18h2v2h-2v-2z"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">{tx("aadhaarLink",lang)}</p>
              <p className="text-[11px] text-orange-100">{lang==="hi"?"नजदीकी आधार नामांकन/अपडेट केंद्र खोजें":"Find nearest Aadhaar enrollment & update center"}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* ── State doorstep service ── */}
        {doorstep && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl px-4 py-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-sky-800 mb-0.5">
                  {lang === "hi" ? `${data.state} में डोरस्टेप सेवा` : `Doorstep Services in ${data.state}`}
                </p>
                <p className="text-[11px] text-sky-600 mb-2">
                  {lang === "hi" ? doorstep.nameHi : doorstep.name}
                </p>
                <a href={doorstep.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg px-3 py-1.5 transition-colors"
                  style={{ minHeight:"auto", minWidth:"auto" }}>
                  {lang === "hi" ? "पोर्टल खोलें" : "Open Portal"}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
          <p className="text-[11px] text-gray-400 leading-relaxed">⚠️ {tx("disclaimer",lang)}</p>
        </div>

        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-2xl py-3.5 transition-colors shadow-md shadow-green-200">
          <RefreshCw className="w-4 h-4" />
          {tx("checkAgain",lang)}
        </button>
      </div>
    );
  }

  // ── WIZARD ────────────────────────────────────────────────────────
  const STEP_Q: Record<Step, { q: string; h: string }> = {
    purpose:    { q:tx("purposeQ",lang),    h:tx("purposeHint",lang)    },
    age:        { q:tx("ageQ",lang),        h:tx("ageHint",lang)        },
    gender:     { q:tx("genderQ",lang),     h:tx("genderHint",lang)     },
    employment: { q:tx("employmentQ",lang), h:tx("employmentHint",lang) },
    category:   { q:tx("categoryQ",lang),   h:tx("categoryHint",lang)   },
    income:     { q:tx("incomeQ",lang),     h:tx("incomeHint",lang)     },
    education:  { q:tx("educationQ",lang),  h:tx("educationHint",lang)  },
    state:      { q:tx("stateQ",lang),      h:tx("stateHint",lang)      },
  };

  return (
    <div>
      <StepBar current={step} total={totalSteps} />

      <div className="flex items-center justify-between mb-2">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} style={{ minHeight:"auto", minWidth:"auto" }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />{tx("back",lang)}
          </button>
        ) : <span />}
        <p className="text-[11px] text-gray-300 font-medium">
          {tx("stepOf",lang)} {step+1} {tx("of",lang)} {totalSteps}
        </p>
      </div>

      {/* Running summary */}
      {step > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 animate-fadeIn">
          {data.purpose    && <SummaryChip icon={Sparkles}     value={PURPOSES.find(p=>p.value===data.purpose)?.value ?? data.purpose} />}
          {data.age > 0    && <SummaryChip icon={User}         value={AGE_BANDS.find(b=>b.mid===data.age)?.label[lang] ?? ""} />}
          {data.gender     && <SummaryChip icon={Users}        value={GENDERS.find(g=>g.value===data.gender)?.label[lang] ?? data.gender} />}
          {data.employment && <SummaryChip icon={Briefcase}    value={EMPLOYMENT_OPTIONS.find(e=>e.value===data.employment)?.label[lang] ?? data.employment} />}
          {data.category   && <SummaryChip icon={Users}        value={CATEGORIES.find(c=>c.value===data.category)?.label[lang] ?? data.category} />}
          {data.income_lpa >= 0 && <SummaryChip icon={IndianRupee} value={INCOME_BANDS.find(b=>b.value===data.income_lpa)?.label[lang] ?? ""} />}
          {data.education  && <SummaryChip icon={GraduationCap} value={EDUCATION_LEVELS.find(e=>e.value===data.education)?.label[lang] ?? data.education} />}
        </div>
      )}

      {/* Step card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden" key={step}>
        <div className="px-5 pt-5 pb-4 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">{STEP_Q[stepName].q}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{STEP_Q[stepName].h}</p>
        </div>
        <div className="p-4 space-y-2">

          {/* PURPOSE */}
          {stepName === "purpose" && PURPOSES.map(p => (
            <OptionCard key={p.value} emoji={p.emoji} label={tx(p.labelKey, lang)}
              selected={data.purpose === p.value} onClick={() => pick({ purpose:p.value })} />
          ))}

          {/* AGE */}
          {stepName === "age" && AGE_BANDS.map(b => (
            <OptionCard key={b.mid} emoji={b.emoji} label={b.label[lang]}
              selected={data.age === b.mid} onClick={() => pick({ age:b.mid })} />
          ))}

          {/* GENDER */}
          {stepName === "gender" && GENDERS.map(g => (
            <OptionCard key={g.value} emoji={g.emoji} label={g.label[lang]}
              selected={data.gender === g.value} onClick={() => pick({ gender:g.value })} />
          ))}

          {/* EMPLOYMENT — with visual illustration cards */}
          {stepName === "employment" && (
            <div className="space-y-2">
              {EMPLOYMENT_OPTIONS.map(e => (
                <EmploymentCard key={e.value} option={e} lang={lang}
                  selected={data.employment === e.value} onClick={() => pick({ employment:e.value })} />
              ))}
            </div>
          )}

          {/* CATEGORY */}
          {stepName === "category" && CATEGORIES.map(c => (
            <OptionCard key={c.value} emoji={c.emoji} label={c.label[lang]} desc={c.desc[lang]}
              selected={data.category === c.value} onClick={() => pick({ category:c.value })} />
          ))}

          {/* INCOME */}
          {stepName === "income" && INCOME_BANDS.map(b => (
            <OptionCard key={String(b.value)} emoji={b.emoji} label={b.label[lang]} desc={b.desc[lang]}
              selected={data.income_lpa === b.value} onClick={() => pick({ income_lpa:b.value })} />
          ))}

          {/* EDUCATION */}
          {stepName === "education" && EDUCATION_LEVELS.map(e => (
            <OptionCard key={e.value} emoji={e.emoji} label={e.label[lang]}
              selected={data.education === e.value} onClick={() => pick({ education:e.value })} />
          ))}

          {/* STATE — last step + submit */}
          {stepName === "state" && (
            <>
              <OptionCard emoji="🌐" label={tx("allIndia",lang)}
                selected={data.state==="unknown"} onClick={() => setData(d => ({ ...d, state:"unknown" }))} />
              <div className="relative">
                <select value={data.state==="unknown"?"":data.state}
                  onChange={e => setData(d => ({ ...d, state:e.target.value||"unknown" }))}
                  className="w-full appearance-none bg-white border-2 border-gray-100 hover:border-green-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-green-400 transition-colors pr-10"
                  style={{ minHeight:"52px" }}>
                  <option value="">{tx("selectState",lang)}</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              </div>
              <button onClick={() => handleSubmit(data)} disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black rounded-2xl py-4 text-sm shadow-lg shadow-green-200/60 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-2">
                <Search className="w-4 h-4" />
                {tx("findBtn",lang)}
              </button>
            </>
          )}
        </div>
      </div>

      {step === 0 && (
        <p className="text-center text-[11px] text-gray-300 mt-4">
          {lang==="hi" ? "8 आसान कदम · कोई टाइपिंग नहीं · तुरंत परिणाम" : "8 quick taps · No typing · Instant results"}
        </p>
      )}
    </div>
  );
}
