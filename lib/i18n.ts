// lib/i18n.ts — Full Hindi/English translations

export type Lang = "en" | "hi";

export const t = {
  // ── Nav / Hero ─────────────────────────────
  badge:           { en: "Free · AI-Powered · 7 Quick Taps", hi: "मुफ़्त · AI · 7 आसान कदम" },
  heroTitle1:      { en: "Find Your",        hi: "अपनी" },
  heroTitle2:      { en: "Yojana",           hi: "योजना" },
  heroTitle3:      { en: "",                 hi: "खोजें" },
  heroSub:         { en: "Answer 7 simple questions. AI instantly matches you with government schemes you qualify for — no forms, no jargon.", hi: "7 आसान सवालों के जवाब दें। AI तुरंत बताएगा कि आप किन सरकारी योजनाओं के लिए योग्य हैं — कोई फॉर्म नहीं, कोई झंझट नहीं।" },
  langToggle:      { en: "हिंदी में देखें",  hi: "View in English" },

  // ── Step labels ────────────────────────────
  stepOf:          { en: "Step",             hi: "चरण" },
  of:              { en: "of",               hi: "में से" },
  back:            { en: "← Back",           hi: "← वापस" },

  // ── Step questions ─────────────────────────
  purposeQ:        { en: "What are you looking for?",           hi: "आप क्या ढूंढ रहे हैं?" },
  purposeHint:     { en: "We'll prioritize schemes that match your goal", hi: "हम आपके लक्ष्य के अनुसार योजनाएं दिखाएंगे" },
  ageQ:            { en: "How old are you?",                    hi: "आपकी उम्र कितनी है?" },
  ageHint:         { en: "Determines age-based scheme eligibility", hi: "उम्र के आधार पर योजना की पात्रता तय होती है" },
  genderQ:         { en: "What is your gender?",                hi: "आपका लिंग क्या है?" },
  genderHint:      { en: "Some schemes are gender-specific",    hi: "कुछ योजनाएं लिंग के अनुसार होती हैं" },
  categoryQ:       { en: "Your social category?",               hi: "आपकी सामाजिक श्रेणी?" },
  categoryHint:    { en: "SC/ST/OBC get additional scheme access", hi: "SC/ST/OBC को अतिरिक्त योजनाओं का लाभ मिलता है" },
  incomeQ:         { en: "Annual household income?",            hi: "परिवार की सालाना आमदनी?" },
  incomeHint:      { en: "Many schemes have income limits",     hi: "कई योजनाओं में आय की सीमा होती है" },
  educationQ:      { en: "Highest qualification?",              hi: "सबसे ऊंची शिक्षा?" },
  educationHint:   { en: "For scholarship and training schemes", hi: "छात्रवृत्ति और प्रशिक्षण योजनाओं के लिए" },
  stateQ:          { en: "Which state are you from?",           hi: "आप किस राज्य से हैं?" },
  stateHint:       { en: "Optional — helps refine your matches", hi: "वैकल्पिक — परिणाम बेहतर होंगे" },

  // ── Options ───────────────────────────────
  allIndia:        { en: "All India / Don't know", hi: "पूरे भारत के लिए / पता नहीं" },
  selectState:     { en: "Select your state…",     hi: "अपना राज्य चुनें…" },

  // ── Purposes ──────────────────────────────
  purposeBusiness: { en: "Start or Grow a Business", hi: "व्यापार शुरू या बढ़ाना" },
  purposeFarming:  { en: "Farming & Agriculture",    hi: "खेती और कृषि" },
  purposeEdu:      { en: "Education & Scholarship",  hi: "शिक्षा और छात्रवृत्ति" },
  purposeHealth:   { en: "Health Coverage",          hi: "स्वास्थ्य सुरक्षा" },
  purposeHousing:  { en: "Housing & Home Loan",      hi: "मकान और होम लोन" },
  purposeSkill:    { en: "Skill Training & Jobs",    hi: "कौशल प्रशिक्षण और रोजगार" },
  purposeAll:      { en: "Show All Schemes",         hi: "सभी योजनाएं देखें" },

  // ── CTA ───────────────────────────────────
  findBtn:         { en: "Find My Schemes →",        hi: "मेरी योजनाएं खोजें →" },
  loading:         { en: "Matching your profile…",   hi: "आपकी जानकारी मिलाई जा रही है…" },
  checkAgain:      { en: "Check Again",              hi: "दोबारा जांचें" },

  // ── Results ───────────────────────────────
  yourProfile:     { en: "Your Profile",             hi: "आपकी प्रोफ़ाइल" },
  matched:         { en: "Schemes Matched",          hi: "योजनाएं मिलीं" },
  noMatch:         { en: "No schemes matched",       hi: "कोई योजना नहीं मिली" },
  noMatchSub:      { en: "Try myscheme.gov.in for state-specific schemes", hi: "राज्य स्तरीय योजनाओं के लिए myscheme.gov.in देखें" },
  matchedSub:      { en: "You qualify for these central government schemes", hi: "आप इन केंद्र सरकार की योजनाओं के लिए पात्र हैं" },
  whyGood:         { en: "Why this is good for you", hi: "यह आपके लिए क्यों अच्छी है" },
  howApply:        { en: "How to Apply",             hi: "आवेदन कैसे करें" },
  applyBtn:        { en: "Apply on Official Portal", hi: "सरकारी पोर्टल पर आवेदन करें" },
  estBenefit:      { en: "Estimated Benefit",        hi: "अनुमानित लाभ" },
  shareWA:         { en: "Share on WhatsApp",        hi: "WhatsApp पर शेयर करें" },
  savePDF:         { en: "Save Results",             hi: "परिणाम सेव करें" },
  cscLink:         { en: "Find Nearest CSC Center",  hi: "नजदीकी CSC केंद्र खोजें" },
  cscHint:         { en: "Apply offline at your local Common Service Centre", hi: "अपने नजदीकी जनसेवा केंद्र पर ऑफलाइन आवेदन करें" },
  matchScore:      { en: "Match",                    hi: "मिलान" },
  topPick:         { en: "⭐ Best for You",          hi: "⭐ आपके लिए सबसे अच्छा" },

  // ── Scheme card labels ────────────────────
  benefit:         { en: "Key Benefit",              hi: "मुख्य लाभ" },
  eligibility:     { en: "Eligibility",              hi: "पात्रता" },
  ministry:        { en: "Ministry",                 hi: "मंत्रालय" },

  // ── Trust / footer ────────────────────────
  trustNoData:     { en: "No data stored",           hi: "डेटा सेव नहीं होता" },
  trustGovOnly:    { en: "Links only to .gov.in",   hi: "सिर्फ सरकारी लिंक" },
  trustNotGov:     { en: "Not a government website", hi: "यह सरकारी वेबसाइट नहीं है" },
  disclaimer:      { en: "Independent AI tool. Not an official government portal. Always verify on .gov.in before applying.", hi: "यह एक स्वतंत्र AI टूल है, सरकारी पोर्टल नहीं। आवेदन से पहले .gov.in पर जांचें।" },
  schemesTitle:    { en: "Schemes We Cover",         hi: "हम इन योजनाओं को कवर करते हैं" },
  faqTitle:        { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले सवाल" },
  footerLine1:     { en: "Not affiliated with the Government of India.", hi: "भारत सरकार से संबद्ध नहीं।" },
  footerLine2:     { en: "Data sourced from india.gov.in public portals.", hi: "डेटा india.gov.in से लिया गया है।" },

  // ── Summary pills ─────────────────────────
  age:             { en: "Age",         hi: "उम्र" },
  gender:          { en: "Gender",      hi: "लिंग" },
  category:        { en: "Category",    hi: "वर्ग" },
  income:          { en: "Income",      hi: "आमदनी" },
  education:       { en: "Education",   hi: "शिक्षा" },
  state:           { en: "State",       hi: "राज्य" },
  purpose:         { en: "Goal",        hi: "लक्ष्य" },

  // ── Error ─────────────────────────────────
  errorTitle:      { en: "Something went wrong",     hi: "कुछ गलत हो गया" },
  tryAgain:        { en: "Try again",                hi: "दोबारा कोशिश करें" },
  timeout:         { en: "Request timed out. Please try again.", hi: "अनुरोध समय से बाहर हो गया। कृपया दोबारा कोशिश करें।" },
  networkError:    { en: "Network error. Check your connection.", hi: "नेटवर्क त्रुटि। अपना कनेक्शन जांचें।" },
};

export function tx(key: keyof typeof t, lang: Lang): string {
  return t[key][lang];
}
