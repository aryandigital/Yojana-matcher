// lib/schemes.ts — 21 verified Indian government schemes

export interface ApplyStep {
  step: string;
  stepHi: string;
}

export type SchemeCategory =
  | "Business" | "Agriculture" | "Health" | "Housing"
  | "Education" | "Insurance" | "Investment" | "Pension"
  | "Skill" | "Banking" | "Welfare";

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  illustration: { emoji: string; gradient: string }; // visual identity
  ministry: string;
  ministryHi: string;
  description: string;
  descriptionHi: string;
  benefits: string;
  benefitsHi: string;
  eligibility: string;
  eligibilityHi: string;
  whyGoodForYou: string;
  whyGoodForYouHi: string;
  estimatedBenefit: string;
  estimatedBenefitHi: string;
  applySteps: ApplyStep[];
  applyUrl: string;
  tag: string;
  tagHi: string;
  tagColor: string;
  category: SchemeCategory;
  purposeTags: string[];
  eligibilityRules: {
    maxAge?: number;
    minAge?: number;
    maxIncomeLPA?: number;
    genders?: string[];
    categories?: string[];
    minEducation?: "none"|"primary"|"secondary"|"graduation"|"postgrad";
    // employment filters
    excludeEmployment?: string[]; // e.g. ["government"] — govt employees excluded
    includeEmployment?: string[]; // e.g. ["gig","unorganized"] — only for these
  };
}

const EDU_RANK: Record<string, number> = { none:0, primary:1, secondary:2, graduation:3, postgrad:4 };

function educationRank(edu: string): number {
  const e = edu.toLowerCase();
  if (e.includes("post")||e.includes("master")||e.includes("phd")||e.includes("mba")) return 4;
  if (e.includes("graduat")||e.includes("bachelor")||e.includes("degree")||e.includes("b.tech")) return 3;
  if (e.includes("12")||e.includes("hsc")||e.includes("higher secondary")) return 2;
  if (e.includes("10")||e.includes("ssc")||e.includes("matriculat")||e.includes("secondary")) return 1;
  return 0;
}

export const schemes: Scheme[] = [
  // ── BUSINESS ──────────────────────────────────────────────────────
  {
    id:"pmmy",
    name:"MUDRA Loan (PMMY)", nameHi:"मुद्रा लोन (PMMY)",
    illustration:{ emoji:"🏪", gradient:"from-orange-400 to-amber-500" },
    ministry:"Ministry of Finance / MUDRA", ministryHi:"वित्त मंत्रालय / मुद्रा",
    description:"Collateral-free business loans up to ₹10 lakh for micro and small enterprises — no guarantor needed.",
    descriptionHi:"छोटे व्यापार के लिए बिना गारंटर के ₹10 लाख तक का लोन।",
    benefits:"Shishu ≤₹50K · Kishore ₹50K–₹5L · Tarun ₹5L–₹10L. No collateral.",
    benefitsHi:"शिशु ≤₹50K · किशोर ₹50K–₹5L · तरुण ₹5L–₹10L। कोई गिरवी नहीं।",
    eligibility:"Any adult Indian with a non-farm business plan. No prior bank default.",
    eligibilityHi:"18+ भारतीय जिसका खेती से अलग व्यापार हो। कोई बैंक बकाया न हो।",
    whyGoodForYou:"No collateral, no guarantor — just a business idea and your Aadhaar. Perfect for shops, salons, food stalls, tailoring.",
    whyGoodForYouHi:"कोई गिरवी नहीं, कोई गारंटर नहीं — बस एक बिज़नेस आइडिया और आधार चाहिए।",
    estimatedBenefit:"Loan ₹50,000 – ₹10,00,000",
    estimatedBenefitHi:"ऋण ₹50,000 – ₹10,00,000",
    applySteps:[
      { step:"Visit any bank/NBFC with Aadhaar + PAN + business plan", stepHi:"आधार, PAN और बिज़नेस प्लान लेकर किसी भी बैंक जाएं" },
      { step:"Fill MUDRA loan application (also at mudra.org.in)", stepHi:"मुद्रा लोन फॉर्म भरें (mudra.org.in पर भी उपलब्ध)" },
      { step:"Submit photo, address proof, 6-month bank statement", stepHi:"फोटो, पता प्रमाण और 6 महीने का बैंक स्टेटमेंट दें" },
      { step:"Approval in 7–14 working days. Amount credited to account.", stepHi:"7–14 दिनों में मंजूरी। राशि खाते में आती है।" },
    ],
    applyUrl:"https://www.mudra.org.in",
    tag:"Business Loan", tagHi:"बिज़नेस लोन", tagColor:"bg-orange-100 text-orange-700",
    category:"Business", purposeTags:["business"],
    eligibilityRules:{ minAge:18, maxIncomeLPA:15, excludeEmployment:[] },
  },
  {
    id:"pmegp",
    name:"PMEGP — Employment Generation", nameHi:"PMEGP — रोजगार सृजन",
    illustration:{ emoji:"🏭", gradient:"from-amber-500 to-yellow-500" },
    ministry:"Ministry of MSME / KVIC", ministryHi:"MSME मंत्रालय / KVIC",
    description:"Government subsidy of 15–35% on project cost to set up new manufacturing or service enterprises.",
    descriptionHi:"नई मैन्युफैक्चरिंग या सेवा इकाई के लिए परियोजना लागत पर 15–35% सब्सिडी।",
    benefits:"Subsidy: 15% urban general · 25% rural general · 35% SC/ST/Women. Projects up to ₹50L.",
    benefitsHi:"सब्सिडी: शहरी सामान्य 15% · ग्रामीण 25% · SC/ST/महिला 35%।",
    eligibility:"Age 18+, 8th pass for project >₹10L. Indian citizen. No prior government subsidy.",
    eligibilityHi:"18+ वर्ष, ₹10L+ के लिए 8वीं पास। पहले कोई सरकारी सब्सिडी न ली हो।",
    whyGoodForYou:"Government pays up to 35% of your startup cost — best for food processing, garments, handicrafts, rural manufacturing.",
    whyGoodForYouHi:"सरकार आपकी लागत का 35% तक देती है — खाना, कपड़ा, हस्तशिल्प उद्योग के लिए बढ़िया।",
    estimatedBenefit:"Subsidy ₹75,000 – ₹17,50,000",
    estimatedBenefitHi:"सब्सिडी ₹75,000 – ₹17,50,000",
    applySteps:[
      { step:"Register at kviconline.gov.in → fill PMEGP e-application", stepHi:"kviconline.gov.in पर पंजीकरण → PMEGP e-आवेदन भरें" },
      { step:"Submit project report, Aadhaar, PAN, caste cert (if applicable)", stepHi:"प्रोजेक्ट रिपोर्ट, आधार, PAN, जाति प्रमाण जमा करें" },
      { step:"KVIC reviews and forwards to bank for loan sanction", stepHi:"KVIC समीक्षा करके बैंक को भेजता है" },
      { step:"After loan disbursal, subsidy locks for 3 years then is released", stepHi:"लोन मिलने के बाद सब्सिडी 3 साल बाद खाते में आती है" },
    ],
    applyUrl:"https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    tag:"Business Subsidy", tagHi:"बिज़नेस सब्सिडी", tagColor:"bg-amber-100 text-amber-700",
    category:"Business", purposeTags:["business"],
    eligibilityRules:{ minAge:18, maxIncomeLPA:20 },
  },
  {
    id:"standup",
    name:"Stand-Up India", nameHi:"स्टैंड-अप इंडिया",
    illustration:{ emoji:"🚀", gradient:"from-yellow-500 to-orange-400" },
    ministry:"Dept of Financial Services / SIDBI", ministryHi:"वित्तीय सेवा विभाग / SIDBI",
    description:"Bank loans ₹10L–₹1Cr for SC/ST and Women entrepreneurs to set up greenfield enterprises.",
    descriptionHi:"SC/ST और महिला उद्यमियों के लिए ₹10L–₹1Cr तक का बैंक लोन।",
    benefits:"Composite loan covering 75% of project cost. Repayment up to 7 years.",
    benefitsHi:"परियोजना का 75% कवर करने वाला लोन। 7 साल तक वापसी।",
    eligibility:"SC/ST borrowers OR Women entrepreneurs. Age 18+. Greenfield enterprise.",
    eligibilityHi:"SC/ST या महिला उद्यमी। 18+ वर्ष। नई इकाई।",
    whyGoodForYou:"Biggest loan available for SC/ST or women without heavy collateral — up to ₹1 crore.",
    whyGoodForYouHi:"SC/ST या महिलाओं को बिना भारी गारंटी ₹1 करोड़ तक का सबसे बड़ा लोन।",
    estimatedBenefit:"Loan ₹10 lakh – ₹1 crore",
    estimatedBenefitHi:"ऋण ₹10 लाख – ₹1 करोड़",
    applySteps:[
      { step:"Visit standupmitra.in to find nodal banks near you", stepHi:"standupmitra.in पर नजदीकी बैंक खोजें" },
      { step:"Prepare a project report showing business viability", stepHi:"व्यापार की व्यवहार्यता दिखाती प्रोजेक्ट रिपोर्ट बनाएं" },
      { step:"Submit SC/ST certificate or women declaration + Aadhaar + PAN", stepHi:"SC/ST प्रमाण या महिला घोषणा + आधार + PAN जमा करें" },
      { step:"Bank processes in 30–45 days", stepHi:"बैंक 30–45 दिनों में मंजूरी देता है" },
    ],
    applyUrl:"https://www.standupmitra.in",
    tag:"Entrepreneurship", tagHi:"उद्यमिता", tagColor:"bg-yellow-100 text-yellow-700",
    category:"Business", purposeTags:["business"],
    eligibilityRules:{
      minAge:18,
      categories:["sc","st","scheduled caste","scheduled tribe"],
      genders:["female","woman","women","girl"],
    },
  },
  {
    id:"svnidhi",
    name:"PM SVANidhi — Street Vendor Loan", nameHi:"PM SVANidhi — स्ट्रीट वेंडर लोन",
    illustration:{ emoji:"🛒", gradient:"from-teal-400 to-cyan-500" },
    ministry:"Ministry of Housing & Urban Affairs", ministryHi:"आवास और शहरी मामले मंत्रालय",
    description:"Collateral-free working capital loans for street vendors — vegetable sellers, chai stalls, cobblers, and more.",
    descriptionHi:"फेरीवालों के लिए बिना गारंटी कार्यशील पूंजी ऋण।",
    benefits:"₹10K (1st) → ₹20K (2nd) → ₹50K (3rd loan). 7% interest subsidy.",
    benefitsHi:"₹10K (पहला) → ₹20K (दूसरा) → ₹50K (तीसरा)। 7% ब्याज सब्सिडी।",
    eligibility:"Street vendors with Certificate of Vending or ULB recommendation letter.",
    eligibilityHi:"फेरी प्रमाण पत्र या नगर पालिका का पत्र वाले विक्रेता।",
    whyGoodForYou:"If you run a street stall, cart, or vendor business — get quick cash with subsidized interest and no collateral.",
    whyGoodForYouHi:"सब्जी, चाय, मोची, या कोई भी फेरीवाला — जल्दी कैश, कम ब्याज, कोई गारंटी नहीं।",
    estimatedBenefit:"Loan ₹10,000 – ₹50,000",
    estimatedBenefitHi:"ऋण ₹10,000 – ₹50,000",
    applySteps:[
      { step:"Apply online at pmsvanidhi.mohua.gov.in with Aadhaar", stepHi:"pmsvanidhi.mohua.gov.in पर आधार से ऑनलाइन आवेदन करें" },
      { step:"OR visit nearest Urban Local Body office for Certificate of Vending", stepHi:"या नगर पालिका कार्यालय से फेरी प्रमाण पत्र लें" },
      { step:"Submit to bank/NBFC/MFI with ULB certificate", stepHi:"ULB प्रमाण के साथ बैंक में आवेदन दें" },
      { step:"Loan in 30 days. Repay on time → next loan is higher.", stepHi:"30 दिन में लोन। समय पर चुकाएं → अगला लोन ज्यादा।" },
    ],
    applyUrl:"https://pmsvanidhi.mohua.gov.in",
    tag:"Vendor Loan", tagHi:"वेंडर लोन", tagColor:"bg-teal-100 text-teal-700",
    category:"Business", purposeTags:["business"],
    eligibilityRules:{ minAge:18, maxIncomeLPA:5, includeEmployment:["self_employed","gig","unorganized","unemployed"] },
  },
  // ── GIG / UNORGANIZED ─────────────────────────────────────────────
  {
    id:"eshram",
    name:"e-SHRAM Card (Unorganized Workers)", nameHi:"e-श्रम कार्ड (असंगठित श्रमिक)",
    illustration:{ emoji:"🪪", gradient:"from-blue-500 to-indigo-500" },
    ministry:"Ministry of Labour & Employment", ministryHi:"श्रम और रोजगार मंत्रालय",
    description:"National database registration for gig workers, daily wage earners, construction workers, domestic workers, and all unorganized sector workers.",
    descriptionHi:"गिग वर्कर, दिहाड़ी मजदूर, निर्माण कर्मचारी, घरेलू कामगार — सभी असंगठित श्रमिकों का राष्ट्रीय पंजीकरण।",
    benefits:"₹2 lakh accident insurance (PMSBY) free + access to 50+ welfare schemes + priority in govt schemes.",
    benefitsHi:"₹2 लाख दुर्घटना बीमा (PMSBY) मुफ़्त + 50+ कल्याण योजनाओं तक पहुंच।",
    eligibility:"Any unorganized sector worker aged 16–59. Not an EPFO/ESIC member. Not income taxpayer.",
    eligibilityHi:"16–59 वर्ष का कोई भी असंगठित क्षेत्र कर्मचारी। EPFO/ESIC सदस्य न हो।",
    whyGoodForYou:"If you drive for Ola/Uber/Swiggy, do daily wage work, or work in construction — this card gives you accident insurance and priority access to all government schemes.",
    whyGoodForYouHi:"Ola/Uber/Swiggy चलाते हैं, दिहाड़ी करते हैं या निर्माण कार्य में हैं — यह कार्ड दुर्घटना बीमा और सरकारी योजनाओं में प्राथमिकता देता है।",
    estimatedBenefit:"₹2 lakh accident cover + 50+ scheme access",
    estimatedBenefitHi:"₹2 लाख दुर्घटना कवर + 50+ योजनाओं तक पहुंच",
    applySteps:[
      { step:"Go to eshram.gov.in or CSC centre near you", stepHi:"eshram.gov.in पर जाएं या नजदीकी CSC केंद्र जाएं" },
      { step:"Register with Aadhaar-linked mobile number", stepHi:"आधार-लिंक्ड मोबाइल नंबर से पंजीकरण करें" },
      { step:"Enter occupation, income, address details", stepHi:"पेशा, आमदनी, पता जानकारी भरें" },
      { step:"Download e-SHRAM card instantly (UAN number issued)", stepHi:"e-श्रम कार्ड तुरंत डाउनलोड करें (UAN नंबर मिलेगा)" },
    ],
    applyUrl:"https://eshram.gov.in",
    tag:"Gig / Unorganized", tagHi:"गिग / असंगठित", tagColor:"bg-blue-100 text-blue-700",
    category:"Welfare", purposeTags:["skill","all"],
    eligibilityRules:{ minAge:16, maxAge:59, includeEmployment:["gig","unorganized","daily_wage","construction"] },
  },
  // ── INSURANCE ──────────────────────────────────────────────────────
  {
    id:"pmjjby",
    name:"PMJJBY — Life Insurance ₹436/yr", nameHi:"PMJJBY — जीवन बीमा ₹436/वर्ष",
    illustration:{ emoji:"🛡️", gradient:"from-rose-500 to-pink-500" },
    ministry:"Ministry of Finance", ministryHi:"वित्त मंत्रालय",
    description:"₹2 lakh life insurance cover for just ₹436 per year — auto-debited from your savings account each June.",
    descriptionHi:"सिर्फ ₹436 प्रति वर्ष में ₹2 लाख का जीवन बीमा — जून में बचत खाते से ऑटो-डेबिट।",
    benefits:"₹2 lakh death benefit to nominee. Just ₹436/year premium. Renews automatically.",
    benefitsHi:"नॉमिनी को ₹2 लाख मृत्यु लाभ। सिर्फ ₹436/वर्ष प्रीमियम। अपने आप नवीनीकरण।",
    eligibility:"Age 18–50. Savings bank account. Aadhaar-linked mobile. Not already enrolled.",
    eligibilityHi:"18–50 वर्ष। बचत बैंक खाता। आधार-लिंक्ड मोबाइल।",
    whyGoodForYou:"Cheapest life insurance in India — ₹1.19/day protects your family with ₹2 lakh if something happens to you.",
    whyGoodForYouHi:"भारत का सबसे सस्ता जीवन बीमा — ₹1.19/दिन में परिवार को ₹2 लाख की सुरक्षा।",
    estimatedBenefit:"₹2,00,000 life cover at just ₹436/year",
    estimatedBenefitHi:"₹2,00,000 जीवन कवर सिर्फ ₹436/वर्ष में",
    applySteps:[
      { step:"Visit your bank branch or net banking portal", stepHi:"अपनी बैंक शाखा या नेट बैंकिंग पोर्टल जाएं" },
      { step:"Fill PMJJBY enrollment form — takes 2 minutes", stepHi:"PMJJBY नामांकन फॉर्म भरें — 2 मिनट लगते हैं" },
      { step:"Give consent for auto-debit of ₹436 each June", stepHi:"हर जून ₹436 ऑटो-डेबिट के लिए सहमति दें" },
      { step:"Policy certificate issued immediately. Nominee name added.", stepHi:"तुरंत पॉलिसी सर्टिफिकेट मिलेगा। नॉमिनी का नाम जुड़ेगा।" },
    ],
    applyUrl:"https://www.jansuraksha.gov.in",
    tag:"Life Insurance", tagHi:"जीवन बीमा", tagColor:"bg-rose-100 text-rose-700",
    category:"Insurance", purposeTags:["health","all"],
    eligibilityRules:{ minAge:18, maxAge:50, excludeEmployment:[] },
  },
  {
    id:"pmsby",
    name:"PMSBY — Accident Insurance ₹20/yr", nameHi:"PMSBY — दुर्घटना बीमा ₹20/वर्ष",
    illustration:{ emoji:"🏥", gradient:"from-red-400 to-rose-500" },
    ministry:"Ministry of Finance", ministryHi:"वित्त मंत्रालय",
    description:"₹2 lakh accident insurance for just ₹20 per year — the most affordable insurance in India.",
    descriptionHi:"सिर्फ ₹20 प्रति वर्ष में ₹2 लाख का दुर्घटना बीमा — भारत का सबसे सस्ता बीमा।",
    benefits:"₹2 lakh on accidental death/total disability. ₹1 lakh on partial disability. ₹20/year only.",
    benefitsHi:"दुर्घटना मृत्यु/पूर्ण विकलांगता पर ₹2 लाख। आंशिक विकलांगता पर ₹1 लाख। सिर्फ ₹20/वर्ष।",
    eligibility:"Age 18–70. Savings bank account. Auto-renews every June.",
    eligibilityHi:"18–70 वर्ष। बचत बैंक खाता। हर जून ऑटो-नवीनीकरण।",
    whyGoodForYou:"Just ₹20/year — that's less than a cup of chai — protects your family with ₹2 lakh if you have an accident.",
    whyGoodForYouHi:"सिर्फ ₹20/वर्ष — एक चाय से भी कम — दुर्घटना पर परिवार को ₹2 लाख की सुरक्षा।",
    estimatedBenefit:"₹2,00,000 accident cover at just ₹20/year",
    estimatedBenefitHi:"₹2,00,000 दुर्घटना कवर सिर्फ ₹20/वर्ष में",
    applySteps:[
      { step:"Go to your bank branch or net banking / mobile banking app", stepHi:"बैंक शाखा या नेट/मोबाइल बैंकिंग ऐप पर जाएं" },
      { step:"Search 'PMSBY' and click enroll — takes 1 minute", stepHi:"'PMSBY' खोजें और नामांकन करें — 1 मिनट लगता है" },
      { step:"₹20 auto-debited from account each June", stepHi:"हर जून ₹20 खाते से ऑटो-डेबिट होगा" },
      { step:"Download policy certificate from bank portal", stepHi:"बैंक पोर्टल से पॉलिसी सर्टिफिकेट डाउनलोड करें" },
    ],
    applyUrl:"https://www.jansuraksha.gov.in",
    tag:"Accident Insurance", tagHi:"दुर्घटना बीमा", tagColor:"bg-red-100 text-red-700",
    category:"Insurance", purposeTags:["health","all"],
    eligibilityRules:{ minAge:18, maxAge:70, excludeEmployment:[] },
  },
  {
    id:"ayushman",
    name:"Ayushman Bharat – PM-JAY", nameHi:"आयुष्मान भारत – PM-JAY",
    illustration:{ emoji:"💊", gradient:"from-red-500 to-pink-500" },
    ministry:"Ministry of Health & Family Welfare", ministryHi:"स्वास्थ्य और परिवार कल्याण मंत्रालय",
    description:"World's largest government health insurance — ₹5 lakh/family/year for cashless hospital treatment.",
    descriptionHi:"₹5 लाख/परिवार/वर्ष कैशलेस अस्पताल इलाज — दुनिया का सबसे बड़ा सरकारी स्वास्थ्य बीमा।",
    benefits:"₹5L/year per family. No premium. No cap on family size. Covers pre-existing diseases.",
    benefitsHi:"₹5L/वर्ष प्रति परिवार। कोई प्रीमियम नहीं। पुरानी बीमारियां भी कवर।",
    eligibility:"BPL/EWS families listed in SECC 2011. Deprived rural and occupational urban families.",
    eligibilityHi:"SECC 2011 में शामिल BPL/EWS परिवार। वंचित ग्रामीण और शहरी परिवार।",
    whyGoodForYou:"One serious illness can bankrupt a family. This gives ₹5 lakh hospital cover every year — completely free.",
    whyGoodForYouHi:"एक बड़ी बीमारी परिवार को बर्बाद कर सकती है। ₹5 लाख अस्पताल कवर — बिल्कुल मुफ़्त।",
    estimatedBenefit:"₹5,00,000 health cover per year",
    estimatedBenefitHi:"₹5,00,000 स्वास्थ्य कवर प्रति वर्ष",
    applySteps:[
      { step:"Check eligibility at pmjay.gov.in with Aadhaar/ration card", stepHi:"pmjay.gov.in पर आधार/राशन कार्ड से पात्रता जांचें" },
      { step:"Visit nearest Ayushman Bharat hospital or CSC centre", stepHi:"नजदीकी आयुष्मान भारत अस्पताल या CSC केंद्र जाएं" },
      { step:"Get free Ayushman Bharat (Golden) Card issued", stepHi:"मुफ़्त आयुष्मान भारत (गोल्डन) कार्ड बनवाएं" },
      { step:"Show card at any empanelled hospital for cashless treatment", stepHi:"सूचीबद्ध अस्पताल में कार्ड दिखाकर कैशलेस इलाज पाएं" },
    ],
    applyUrl:"https://pmjay.gov.in",
    tag:"Health Insurance", tagHi:"स्वास्थ्य बीमा", tagColor:"bg-red-100 text-red-700",
    category:"Health", purposeTags:["health"],
    eligibilityRules:{ maxIncomeLPA:3, excludeEmployment:["government"] },
  },
  // ── INVESTMENT ────────────────────────────────────────────────────
  {
    id:"ppf",
    name:"PPF — Public Provident Fund", nameHi:"PPF — सार्वजनिक भविष्य निधि",
    illustration:{ emoji:"📈", gradient:"from-green-500 to-emerald-600" },
    ministry:"Ministry of Finance / NSI", ministryHi:"वित्त मंत्रालय / NSI",
    description:"Government-backed 15-year savings scheme with 7.1% tax-free interest — safest long-term investment in India.",
    descriptionHi:"7.1% कर-मुक्त ब्याज के साथ सरकार-समर्थित 15 वर्षीय बचत योजना — भारत का सबसे सुरक्षित दीर्घकालिक निवेश।",
    benefits:"7.1% tax-free interest. 80C deduction up to ₹1.5L/year. Loan against PPF from year 3.",
    benefitsHi:"7.1% कर-मुक्त ब्याज। ₹1.5L/वर्ष तक 80C कटौती। 3 साल बाद PPF पर लोन।",
    eligibility:"Any Indian resident. Min ₹500/year, max ₹1.5L/year. Account runs for 15 years.",
    eligibilityHi:"कोई भी भारतीय निवासी। न्यूनतम ₹500/वर्ष, अधिकतम ₹1.5L/वर्ष। 15 साल का खाता।",
    whyGoodForYou:"₹1.5L/year invested in PPF grows tax-free — ideal for building a safe retirement corpus or child's education fund.",
    whyGoodForYouHi:"₹1.5L/वर्ष PPF में निवेश करें और कर-मुक्त कॉर्पस बनाएं — रिटायरमेंट या बच्चे की शिक्षा के लिए।",
    estimatedBenefit:"~₹40L corpus on ₹1.5L/yr for 15 yrs",
    estimatedBenefitHi:"₹1.5L/वर्ष × 15 साल → ~₹40L कॉर्पस",
    applySteps:[
      { step:"Visit any bank branch or post office with Aadhaar + PAN", stepHi:"आधार + PAN लेकर किसी भी बैंक या पोस्ट ऑफिस जाएं" },
      { step:"Fill PPF account opening form. Deposit minimum ₹500.", stepHi:"PPF खाता खोलने का फॉर्म भरें। न्यूनतम ₹500 जमा करें।" },
      { step:"Get PPF passbook. Deposit any amount each year (max ₹1.5L).", stepHi:"PPF पासबुक मिलेगी। हर साल जमा करें (अधिकतम ₹1.5L)।" },
      { step:"Account matures in 15 years. Can extend in 5-year blocks.", stepHi:"15 साल में खाता परिपक्व। 5-5 साल के ब्लॉक में बढ़ा सकते हैं।" },
    ],
    applyUrl:"https://www.nsiindia.gov.in",
    tag:"Investment", tagHi:"निवेश", tagColor:"bg-green-100 text-green-700",
    category:"Investment", purposeTags:["all"],
    eligibilityRules:{ minAge:18 },
  },
  {
    id:"sgb",
    name:"Sovereign Gold Bond (SGB)", nameHi:"सॉवरेन गोल्ड बॉन्ड (SGB)",
    illustration:{ emoji:"🥇", gradient:"from-yellow-400 to-amber-500" },
    ministry:"Reserve Bank of India / Govt of India", ministryHi:"भारतीय रिज़र्व बैंक / भारत सरकार",
    description:"Invest in digital gold backed by the Government of India — earn 2.5% annual interest + capital gain on gold price rise.",
    descriptionHi:"भारत सरकार समर्थित डिजिटल सोने में निवेश — 2.5% सालाना ब्याज + सोने की कीमत बढ़ने पर पूंजीगत लाभ।",
    benefits:"2.5% p.a. interest (semi-annual) + gold price appreciation. Capital gains tax exempt on maturity.",
    benefitsHi:"2.5% प्रति वर्ष ब्याज (अर्धवार्षिक) + सोने की कीमत बढ़ने पर लाभ। परिपक्वता पर पूंजीगत लाभ कर मुक्त।",
    eligibility:"Indian residents and HUFs. Min 1 gram gold. Max 4 kg/individual per year. Available in tranches via RBI.",
    eligibilityHi:"भारतीय निवासी और HUF। न्यूनतम 1 ग्राम सोना। अधिकतम 4 किग्रा/व्यक्ति/वर्ष।",
    whyGoodForYou:"Better than physical gold — you earn interest, avoid making charges, and government guarantees the value. No theft risk.",
    whyGoodForYouHi:"फिजिकल सोने से बेहतर — ब्याज मिलता है, बनाई नहीं लगती, सरकार गारंटी देती है। चोरी का खतरा नहीं।",
    estimatedBenefit:"2.5% annual interest + gold price gain",
    estimatedBenefitHi:"2.5% सालाना ब्याज + सोने की कीमत में बढ़ोतरी",
    applySteps:[
      { step:"Check RBI website for next SGB issue window (4–5 per year)", stepHi:"RBI वेबसाइट पर अगला SGB issue window देखें (साल में 4–5)" },
      { step:"Apply through your bank's net banking, stockbroker, or post office", stepHi:"बैंक नेट बैंकिंग, स्टॉकब्रोकर, या पोस्ट ऑफिस से आवेदन करें" },
      { step:"Pay in ₹. Bonds issued as DEMAT or in certificate form.", stepHi:"₹ में भुगतान करें। बॉन्ड DEMAT या प्रमाण पत्र रूप में मिलेगा।" },
      { step:"Matures in 8 years. Exit option after 5 years on interest dates.", stepHi:"8 साल में परिपक्व। 5 साल बाद ब्याज तिथि पर निकलने का विकल्प।" },
    ],
    applyUrl:"https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
    tag:"Gold Investment", tagHi:"गोल्ड निवेश", tagColor:"bg-yellow-100 text-yellow-700",
    category:"Investment", purposeTags:["all"],
    eligibilityRules:{ minAge:18 },
  },
  {
    id:"nps",
    name:"NPS — National Pension System", nameHi:"NPS — राष्ट्रीय पेंशन प्रणाली",
    illustration:{ emoji:"🏦", gradient:"from-indigo-500 to-blue-600" },
    ministry:"PFRDA / Ministry of Finance", ministryHi:"PFRDA / वित्त मंत्रालय",
    description:"Market-linked pension system — invest monthly, choose your equity/debt mix, build a large retirement corpus with tax benefits.",
    descriptionHi:"बाजार-लिंक्ड पेंशन प्रणाली — मासिक निवेश, इक्विटी/डेट मिश्रण चुनें, कर लाभ के साथ बड़ा रिटायरमेंट कॉर्पस बनाएं।",
    benefits:"Additional ₹50K deduction under 80CCD(1B) beyond 80C. 60% lump sum + 40% compulsory annuity at 60.",
    benefitsHi:"80C से अलग 80CCD(1B) में ₹50K अतिरिक्त कटौती। 60 साल पर 60% एकमुश्त + 40% पेंशन।",
    eligibility:"Any Indian citizen aged 18–70. Not mandated for private employees but very beneficial.",
    eligibilityHi:"18–70 वर्ष का कोई भी भारतीय नागरिक।",
    whyGoodForYou:"Best tax-saving retirement tool for private employees — extra ₹50K deduction and market-linked growth.",
    whyGoodForYouHi:"प्राइवेट कर्मचारियों के लिए सबसे अच्छा टैक्स-सेविंग रिटायरमेंट टूल — ₹50K अतिरिक्त कटौती।",
    estimatedBenefit:"₹50,000 extra tax deduction + pension at 60",
    estimatedBenefitHi:"₹50,000 अतिरिक्त कर कटौती + 60 पर पेंशन",
    applySteps:[
      { step:"Open NPS account at any bank, post office, or eNPS portal (enps.nsdl.com)", stepHi:"किसी भी बैंक, पोस्ट ऑफिस या enps.nsdl.com पर NPS खाता खोलें" },
      { step:"Complete KYC with Aadhaar + PAN. Choose Tier I (mandatory) or Tier II.", stepHi:"आधार + PAN से KYC करें। Tier I (अनिवार्य) या Tier II चुनें।" },
      { step:"Select fund manager (SBI, HDFC, ICICI, Kotak, etc.) and asset allocation", stepHi:"फंड मैनेजर और एसेट एलोकेशन चुनें" },
      { step:"Contribute minimum ₹1,000/year. Claim deduction in ITR.", stepHi:"न्यूनतम ₹1,000/वर्ष योगदान करें। ITR में कटौती क्लेम करें।" },
    ],
    applyUrl:"https://enps.nsdl.com",
    tag:"Pension / Investment", tagHi:"पेंशन / निवेश", tagColor:"bg-indigo-100 text-indigo-700",
    category:"Investment", purposeTags:["all"],
    eligibilityRules:{ minAge:18, maxAge:70 },
  },
  // ── AGRICULTURE ──────────────────────────────────────────────────
  {
    id:"pmkisan",
    name:"PM-KISAN — Kisan Samman Nidhi", nameHi:"PM-किसान — किसान सम्मान निधि",
    illustration:{ emoji:"🌾", gradient:"from-green-400 to-lime-500" },
    ministry:"Ministry of Agriculture & Farmers Welfare", ministryHi:"कृषि और किसान कल्याण मंत्रालय",
    description:"Direct income support of ₹6,000/year for farmer families — sent in 3 instalments to Aadhaar-linked bank account.",
    descriptionHi:"किसान परिवारों को साल में ₹6,000 — तीन किस्तों में आधार-लिंक्ड बैंक खाते में।",
    benefits:"₹6,000/year in 3 instalments of ₹2,000 each via Direct Benefit Transfer.",
    benefitsHi:"₹2,000 की 3 किस्तों में साल में ₹6,000 सीधे खाते में।",
    eligibility:"All landholding farmer families. Excludes income taxpayers and government employees.",
    eligibilityHi:"सभी भूमिधारक किसान परिवार। आयकर दाता और सरकारी कर्मचारी शामिल नहीं।",
    whyGoodForYou:"If you own farmland, get guaranteed ₹2,000 every 4 months — no applications after first registration.",
    whyGoodForYouHi:"खेत है तो हर 4 महीने पर ₹2,000 पक्के — एक बार रजिस्ट्रेशन के बाद अपने आप आता है।",
    estimatedBenefit:"₹6,000 per year (guaranteed)",
    estimatedBenefitHi:"₹6,000 प्रति वर्ष (गारंटीड)",
    applySteps:[
      { step:"Go to pmkisan.gov.in → Farmer Corner → New Farmer Registration", stepHi:"pmkisan.gov.in → किसान कोना → नया किसान पंजीकरण" },
      { step:"Enter Aadhaar + mobile number linked to bank account", stepHi:"बैंक से जुड़ा आधार नंबर और मोबाइल नंबर डालें" },
      { step:"Submit land ownership documents (Khasra/Khatauni)", stepHi:"जमीन के कागज (खसरा/खतौनी) जमा करें" },
      { step:"Patwari verification → first instalment within 60 days", stepHi:"पटवारी जांच → 60 दिन में पहली किस्त" },
    ],
    applyUrl:"https://pmkisan.gov.in",
    tag:"Agriculture", tagHi:"कृषि", tagColor:"bg-green-100 text-green-700",
    category:"Agriculture", purposeTags:["farming"],
    eligibilityRules:{ maxIncomeLPA:5, excludeEmployment:["government"] },
  },
  {
    id:"fasalbima",
    name:"PM Fasal Bima Yojana", nameHi:"PM फसल बीमा योजना",
    illustration:{ emoji:"🌱", gradient:"from-lime-400 to-green-500" },
    ministry:"Ministry of Agriculture & Farmers Welfare", ministryHi:"कृषि और किसान कल्याण मंत्रालय",
    description:"Crop insurance protecting farmers from drought, flood, pest, and natural calamities at very low premium.",
    descriptionHi:"सूखा, बाढ़, कीट और प्राकृतिक आपदाओं से फसल बर्बादी पर बीमा — बहुत कम प्रीमियम पर।",
    benefits:"Premium just 2% Kharif · 1.5% Rabi · 5% commercial crops. Full sum insured on crop loss.",
    benefitsHi:"प्रीमियम: खरीफ 2% · रबी 1.5% · व्यावसायिक फसल 5%। नुकसान पर पूरी बीमित राशि।",
    eligibility:"All farmers including sharecroppers and tenant farmers growing notified crops.",
    eligibilityHi:"सभी किसान — बटाईदार और किराएदार भी — जो अधिसूचित फसल उगाते हैं।",
    whyGoodForYou:"If your crop fails from bad weather or pests, you get the full insured amount — your whole year's income is protected.",
    whyGoodForYouHi:"खराब मौसम या कीट से फसल बर्बाद हो तो पूरी बीमित राशि — पूरे साल की मेहनत सुरक्षित।",
    estimatedBenefit:"Full insured amount on crop loss",
    estimatedBenefitHi:"नुकसान पर पूरी बीमित राशि",
    applySteps:[
      { step:"Visit pmfby.gov.in or nearest bank before sowing season", stepHi:"बुवाई से पहले pmfby.gov.in या नजदीकी बैंक जाएं" },
      { step:"Fill PMFBY application with crop, land area, Aadhaar, bank details", stepHi:"PMFBY फॉर्म में फसल, जमीन, आधार, बैंक जानकारी भरें" },
      { step:"Pay your share of premium (just 1.5–5%)", stepHi:"अपना प्रीमियम (सिर्फ 1.5–5%) जमा करें" },
      { step:"Crop damage? Report within 72 hours to bank/insurance company", stepHi:"फसल नुकसान पर 72 घंटे में बैंक/बीमा कंपनी को सूचित करें" },
    ],
    applyUrl:"https://pmfby.gov.in",
    tag:"Crop Insurance", tagHi:"फसल बीमा", tagColor:"bg-lime-100 text-lime-700",
    category:"Agriculture", purposeTags:["farming"],
    eligibilityRules:{ maxIncomeLPA:8, includeEmployment:["farmer","self_employed"] },
  },
  // ── HOUSING ───────────────────────────────────────────────────────
  {
    id:"pmay",
    name:"PMAY — Pradhan Mantri Awas Yojana", nameHi:"PMAY — प्रधानमंत्री आवास योजना",
    illustration:{ emoji:"🏠", gradient:"from-blue-400 to-indigo-500" },
    ministry:"Ministry of Housing & Urban Affairs", ministryHi:"आवास और शहरी मामले मंत्रालय",
    description:"Interest subsidy and cash assistance for housing to EWS, LIG, and MIG families under 'Housing for All'.",
    descriptionHi:"'सबके लिए मकान' के तहत EWS, LIG और MIG परिवारों को ब्याज सब्सिडी और नकद सहायता।",
    benefits:"Interest subsidy 3–6.5% on home loans up to ₹12L; ₹1.5L direct cash for rural beneficiaries.",
    benefitsHi:"₹12L तक होम लोन पर 3–6.5% ब्याज सब्सिडी; ग्रामीण को ₹1.5L नकद सहायता।",
    eligibility:"Annual income up to ₹18 LPA. No pucca house owned by family anywhere in India.",
    eligibilityHi:"सालाना आमदनी ₹18 लाख तक। परिवार के पास कोई पक्का मकान न हो।",
    whyGoodForYou:"No pucca home? This cuts your home loan interest significantly — saving lakhs over the loan term.",
    whyGoodForYouHi:"पक्का मकान नहीं है? होम लोन का ब्याज काफी कम हो जाता है — लाखों की बचत।",
    estimatedBenefit:"Interest saving ₹2–6 lakh over loan period",
    estimatedBenefitHi:"लोन अवधि में ₹2–6 लाख ब्याज की बचत",
    applySteps:[
      { step:"Check pmaymis.gov.in to see if your area is covered", stepHi:"pmaymis.gov.in पर देखें कि आपका इलाका PMAY में है" },
      { step:"Apply at any bank, HFC, or PMAY-registered lender", stepHi:"किसी भी बैंक, HFC या PMAY ऋणदाता पर आवेदन करें" },
      { step:"Submit income proof, Aadhaar, address proof, no-house affidavit", stepHi:"आय प्रमाण, आधार, पता प्रमाण, मकान न होने का शपथ पत्र दें" },
      { step:"Subsidy credited to loan account → EMI reduces automatically", stepHi:"सब्सिडी लोन खाते में जमा होती है → EMI कम हो जाती है" },
    ],
    applyUrl:"https://pmaymis.gov.in",
    tag:"Housing", tagHi:"आवास", tagColor:"bg-blue-100 text-blue-700",
    category:"Housing", purposeTags:["housing"],
    eligibilityRules:{ maxIncomeLPA:18 },
  },
  // ── EDUCATION ─────────────────────────────────────────────────────
  {
    id:"nsp-sc",
    name:"NSP SC Post-Matric Scholarship", nameHi:"NSP SC पोस्ट-मैट्रिक छात्रवृत्ति",
    illustration:{ emoji:"🎓", gradient:"from-purple-500 to-violet-600" },
    ministry:"Ministry of Social Justice & Empowerment", ministryHi:"सामाजिक न्याय और अधिकारिता मंत्रालय",
    description:"Full fees + monthly allowance for SC students pursuing education beyond Class 10.",
    descriptionHi:"SC छात्रों को 10वीं के बाद की पढ़ाई के लिए पूरी फीस + मासिक भत्ता।",
    benefits:"Full tuition fee reimbursement + maintenance allowance ₹380–₹1,200/month.",
    benefitsHi:"पूरी ट्यूशन फीस + ₹380–₹1,200/माह रखरखाव भत्ता।",
    eligibility:"SC category. Family income ≤ ₹2.5 LPA. Enrolled in 11th+ or recognized higher education.",
    eligibilityHi:"SC वर्ग। परिवारिक आय ≤ ₹2.5 लाख। 11वीं या उच्च शिक्षा में।",
    whyGoodForYou:"SC students can pursue higher education without fee worry — government pays everything plus gives a monthly stipend.",
    whyGoodForYouHi:"SC छात्र बिना फीस की चिंता के उच्च शिक्षा लें — सरकार सब देती है और वजीफा भी।",
    estimatedBenefit:"Full fees + ₹380–1,200/month allowance",
    estimatedBenefitHi:"पूरी फीस + ₹380–1,200/माह भत्ता",
    applySteps:[
      { step:"Register at scholarships.gov.in (National Scholarship Portal)", stepHi:"scholarships.gov.in पर पंजीकरण करें" },
      { step:"Fill application with Aadhaar, income cert, caste cert, mark sheets", stepHi:"आधार, आय प्रमाण, जाति प्रमाण पत्र, अंकसूची के साथ आवेदन भरें" },
      { step:"Institution verifies and forwards to state nodal department", stepHi:"संस्थान जांच करके राज्य नोडल विभाग को भेजता है" },
      { step:"Scholarship credited to Aadhaar-linked bank account", stepHi:"छात्रवृत्ति आधार-लिंक्ड बैंक खाते में आती है" },
    ],
    applyUrl:"https://scholarships.gov.in",
    tag:"Scholarship", tagHi:"छात्रवृत्ति", tagColor:"bg-purple-100 text-purple-700",
    category:"Education", purposeTags:["education"],
    eligibilityRules:{ categories:["sc","scheduled caste"], maxIncomeLPA:2.5, minAge:15, maxAge:30, minEducation:"secondary" },
  },
  {
    id:"pmkvy",
    name:"PMKVY — Skill Development Training", nameHi:"PMKVY — कौशल विकास प्रशिक्षण",
    illustration:{ emoji:"⚙️", gradient:"from-cyan-500 to-blue-500" },
    ministry:"Ministry of Skill Development", ministryHi:"कौशल विकास मंत्रालय",
    description:"Free skill training (3 months–1 year) in 30+ sectors with government certification and placement support.",
    descriptionHi:"30+ क्षेत्रों में मुफ़्त कौशल प्रशिक्षण (3 महीने–1 साल) — सरकारी सर्टिफिकेट और नौकरी में मदद।",
    benefits:"Free training + ₹500–₹1,500/month stipend + government certificate + job placement support.",
    benefitsHi:"मुफ़्त प्रशिक्षण + ₹500–₹1,500/माह वजीफा + सरकारी सर्टिफिकेट + नौकरी में मदद।",
    eligibility:"Indian citizens aged 15–45. Dropouts to graduates. No prior training in same sector.",
    eligibilityHi:"15–45 वर्ष के भारतीय। ड्रॉपआउट से ग्रेजुएट तक।",
    whyGoodForYou:"Get a job-ready government certificate for free — even get paid while training with a monthly stipend.",
    whyGoodForYouHi:"मुफ़्त सरकारी सर्टिफिकेट — प्रशिक्षण के दौरान वजीफा भी मिलता है।",
    estimatedBenefit:"Free training + ₹500–1,500/month stipend",
    estimatedBenefitHi:"मुफ़्त प्रशिक्षण + ₹500–1,500/माह",
    applySteps:[
      { step:"Visit skillindiadigital.gov.in → search courses near you", stepHi:"skillindiadigital.gov.in → अपने पास के कोर्स खोजें" },
      { step:"Register with Aadhaar, select a trade/course", stepHi:"आधार से रजिस्टर करें, अपना कोर्स चुनें" },
      { step:"Visit nearest PMKVY training centre for enrollment", stepHi:"नजदीकी PMKVY केंद्र जाकर दाखिला लें" },
      { step:"Complete training → pass assessment → get government certificate", stepHi:"प्रशिक्षण पूरा → परीक्षा दें → सरकारी सर्टिफिकेट" },
    ],
    applyUrl:"https://www.pmkvyofficial.org",
    tag:"Skill Training", tagHi:"कौशल प्रशिक्षण", tagColor:"bg-cyan-100 text-cyan-700",
    category:"Skill", purposeTags:["skill","business"],
    eligibilityRules:{ minAge:15, maxAge:45, maxIncomeLPA:10 },
  },
  {
    id:"sukanya",
    name:"Sukanya Samriddhi Yojana", nameHi:"सुकन्या समृद्धि योजना",
    illustration:{ emoji:"👧", gradient:"from-pink-400 to-rose-500" },
    ministry:"Ministry of Finance", ministryHi:"वित्त मंत्रालय",
    description:"High-interest savings scheme for girl children — build a tax-free corpus for education and marriage.",
    descriptionHi:"बालिकाओं के लिए उच्च ब्याज बचत योजना — शिक्षा और विवाह के लिए कर-मुक्त राशि।",
    benefits:"~8.2% annual interest (highest). Tax-free maturity. 80C deduction up to ₹1.5L/year.",
    benefitsHi:"~8.2% सालाना ब्याज (सर्वोच्च)। कर-मुक्त परिपक्वता। ₹1.5L/वर्ष तक 80C कटौती।",
    eligibility:"Parent/guardian of a girl child below 10 years. Max 2 accounts per family.",
    eligibilityHi:"10 साल से कम की बालिका के माता-पिता। प्रति परिवार अधिकतम 2 खाते।",
    whyGoodForYou:"Invest ₹250/month and build India's highest guaranteed return for your daughter's future.",
    whyGoodForYouHi:"सिर्फ ₹250/माह से शुरू — बेटी के भविष्य के लिए भारत का सबसे ऊंचा गारंटीड ब्याज।",
    estimatedBenefit:"~₹15–69 lakh at maturity (deposit-based)",
    estimatedBenefitHi:"परिपक्वता पर ~₹15–69 लाख (जमा राशि के अनुसार)",
    applySteps:[
      { step:"Visit any post office or bank with girl's birth certificate", stepHi:"बालिका का जन्म प्रमाण पत्र लेकर पोस्ट ऑफिस या बैंक जाएं" },
      { step:"Fill SSY account opening form + parent Aadhaar + address proof", stepHi:"SSY फॉर्म + माता-पिता का आधार + पता प्रमाण भरें" },
      { step:"Deposit minimum ₹250. Maximum ₹1.5L/year.", stepHi:"न्यूनतम ₹250 जमा। अधिकतम ₹1.5L/वर्ष।" },
      { step:"Deposit annually for 15 years. Matures in 21 years.", stepHi:"15 साल जमा करें। 21 साल में परिपक्व।" },
    ],
    applyUrl:"https://www.nsiindia.gov.in",
    tag:"Girl Child Savings", tagHi:"बालिका बचत", tagColor:"bg-pink-100 text-pink-700",
    category:"Investment", purposeTags:["education","all"],
    eligibilityRules:{ genders:["female","girl","woman"], maxAge:10 },
  },
  // ── PENSION / WELFARE ────────────────────────────────────────────
  {
    id:"apy",
    name:"Atal Pension Yojana (APY)", nameHi:"अटल पेंशन योजना (APY)",
    illustration:{ emoji:"🧓", gradient:"from-indigo-400 to-purple-500" },
    ministry:"PFRDA / Ministry of Finance", ministryHi:"PFRDA / वित्त मंत्रालय",
    description:"Guaranteed pension of ₹1,000–₹5,000/month after age 60 for unorganised sector workers.",
    descriptionHi:"असंगठित क्षेत्र के श्रमिकों के लिए 60 साल के बाद ₹1,000–₹5,000/माह की गारंटीड पेंशन।",
    benefits:"Guaranteed ₹1,000–₹5,000/month from age 60. Govt co-contributes 50% for first 5 years.",
    benefitsHi:"60 साल के बाद ₹1,000–₹5,000/माह गारंटीड पेंशन। शुरुआती 5 साल सरकार 50% देती है।",
    eligibility:"Age 18–40. Savings bank account. Not an income taxpayer.",
    eligibilityHi:"18–40 वर्ष। बचत बैंक खाता। आयकर दाता न हो।",
    whyGoodForYou:"Daily wage or informal worker? This is the simplest pension plan — government adds money too.",
    whyGoodForYouHi:"दिहाड़ी मजदूर हैं? यह बुढ़ापे की पेंशन का सबसे आसान तरीका — सरकार भी पैसा देती है।",
    estimatedBenefit:"₹1,000–5,000/month pension after age 60",
    estimatedBenefitHi:"60 साल के बाद ₹1,000–5,000/माह पेंशन",
    applySteps:[
      { step:"Visit your bank branch where you hold a savings account", stepHi:"जिस बैंक में बचत खाता है वहां जाएं" },
      { step:"Fill APY subscription form — choose pension amount (₹1K–₹5K)", stepHi:"APY फॉर्म भरें — पेंशन राशि चुनें (₹1K–₹5K)" },
      { step:"Auto-debit set for monthly contribution", stepHi:"मासिक योगदान के लिए ऑटो-डेबिट सेट होगा" },
      { step:"Get pension at 60. Nominee gets corpus on death.", stepHi:"60 साल में पेंशन। मृत्यु पर नॉमिनी को राशि।" },
    ],
    applyUrl:"https://www.npscra.nsdl.co.in/scheme-details.php",
    tag:"Pension", tagHi:"पेंशन", tagColor:"bg-indigo-100 text-indigo-700",
    category:"Pension", purposeTags:["all"],
    eligibilityRules:{ minAge:18, maxAge:40, excludeEmployment:["government"] },
  },
  {
    id:"jandhan",
    name:"PM Jan Dhan Yojana", nameHi:"PM जन धन योजना",
    illustration:{ emoji:"🏧", gradient:"from-sky-400 to-blue-500" },
    ministry:"Ministry of Finance", ministryHi:"वित्त मंत्रालय",
    description:"Zero-balance bank account with free RuPay card, ₹2L accident insurance, and ₹30K life insurance.",
    descriptionHi:"जीरो बैलेंस खाता — मुफ़्त RuPay कार्ड, ₹2L दुर्घटना बीमा, ₹30K जीवन बीमा।",
    benefits:"Zero-balance + RuPay card + ₹2L accident insurance + ₹30K life insurance + ₹10K overdraft.",
    benefitsHi:"जीरो बैलेंस + RuPay कार्ड + ₹2L दुर्घटना बीमा + ₹30K जीवन बीमा + ₹10K ओवरड्राफ्ट।",
    eligibility:"Any Indian citizen 10+ without a bank account. No minimum balance required.",
    eligibilityHi:"बिना बैंक खाते वाला कोई भी 10+ वर्ष का भारतीय।",
    whyGoodForYou:"Opens the door to ALL other schemes — most government benefits come directly to your bank account.",
    whyGoodForYouHi:"बाकी सभी योजनाओं का दरवाजा खुलता है — ज्यादातर सरकारी लाभ सीधे बैंक खाते में।",
    estimatedBenefit:"₹2L accident + ₹30K life insurance — free",
    estimatedBenefitHi:"₹2L दुर्घटना + ₹30K जीवन बीमा — मुफ़्त",
    applySteps:[
      { step:"Visit any bank branch or Business Correspondent (BC) agent", stepHi:"नजदीकी बैंक शाखा या BC एजेंट के पास जाएं" },
      { step:"Bring Aadhaar card + one passport-size photo", stepHi:"आधार कार्ड + एक पासपोर्ट साइज फोटो लाएं" },
      { step:"Fill account opening form. Account opened instantly.", stepHi:"खाता खोलने का फॉर्म भरें। खाता तुरंत खुलता है।" },
      { step:"Get RuPay card in 15 days. Activate at ATM.", stepHi:"15 दिन में RuPay कार्ड। ATM पर एक बार उपयोग से सक्रिय।" },
    ],
    applyUrl:"https://pmjdy.gov.in",
    tag:"Banking", tagHi:"बैंकिंग", tagColor:"bg-sky-100 text-sky-700",
    category:"Banking", purposeTags:["all"],
    eligibilityRules:{ minAge:10, maxIncomeLPA:5 },
  },
];

export interface UserProfile {
  age: number;
  gender: string;
  state: string;
  income_lpa: number;
  category: string;
  education: string;
  purpose?: string;
  employment?: string;
}

export function matchSchemes(profile: UserProfile): Scheme[] {
  const userEduRank  = educationRank(profile.education || "none");
  const userCategory = (profile.category || "").toLowerCase();
  const userGender   = (profile.gender || "").toLowerCase();
  const userPurpose  = (profile.purpose || "all").toLowerCase();
  const userEmploy   = (profile.employment || "").toLowerCase();

  function genderMatches(userGnd: string, allowed: string[]): boolean {
    const words = userGnd.split(/\s+/);
    return allowed.some(g => userGnd === g || words.includes(g));
  }

  const matched = schemes.filter(s => {
    const r = s.eligibilityRules;
    if (r.minAge !== undefined && profile.age < r.minAge) return false;
    if (r.maxAge !== undefined && profile.age > r.maxAge) return false;
    if (r.maxIncomeLPA !== undefined && profile.income_lpa > r.maxIncomeLPA) return false;
    if (r.minEducation !== undefined && userEduRank < (EDU_RANK[r.minEducation] ?? 0)) return false;
    // Employment exclusion (e.g. govt employees blocked from some schemes)
    if (r.excludeEmployment?.length && userEmploy && r.excludeEmployment.includes(userEmploy)) return false;
    // Employment inclusion (only certain worker types eligible)
    if (r.includeEmployment?.length && userEmploy && !r.includeEmployment.includes(userEmploy)) {
      // Still show if employment not specified by user
      if (userEmploy !== "") return false;
    }
    // Stand-up India: SC/ST OR female
    if (s.id === "standup") {
      const catOk = r.categories?.some(c => userCategory.includes(c));
      const genOk = r.genders ? genderMatches(userGender, r.genders) : false;
      return !!(catOk || genOk);
    }
    if (r.categories?.length && !r.categories.some(c => userCategory.includes(c))) return false;
    if (r.genders?.length && !genderMatches(userGender, r.genders)) return false;
    return true;
  });

  // Sort: purpose-matched first, then by income relevance
  return matched.sort((a, b) => {
    const aP = a.purposeTags.includes(userPurpose) ? 2 : a.purposeTags.includes("all") ? 1 : 0;
    const bP = b.purposeTags.includes(userPurpose) ? 2 : b.purposeTags.includes("all") ? 1 : 0;
    return bP - aP;
  });
}

export function getMatchScore(scheme: Scheme, profile: UserProfile): number {
  let score = 65;
  const p = (profile.purpose || "all").toLowerCase();
  if (scheme.purposeTags.includes(p)) score += 25;
  if (scheme.purposeTags.includes("all")) score += 5;
  if (profile.income_lpa < 3 && scheme.eligibilityRules.maxIncomeLPA && scheme.eligibilityRules.maxIncomeLPA <= 5) score += 5;
  return Math.min(score, 99);
}
