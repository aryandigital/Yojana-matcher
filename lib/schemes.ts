// lib/schemes.ts — 14 verified Indian government schemes

export interface ApplyStep {
  step: string;       // English
  stepHi: string;     // Hindi
}

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  ministryHi: string;
  description: string;
  descriptionHi: string;
  benefits: string;
  benefitsHi: string;
  eligibility: string;
  eligibilityHi: string;
  whyGoodForYou: string;   // plain English, short
  whyGoodForYouHi: string; // plain Hindi, short
  estimatedBenefit: string;
  estimatedBenefitHi: string;
  applySteps: ApplyStep[];
  applyUrl: string;
  tag: string;
  tagHi: string;
  tagColor: string;
  purposeTags: string[]; // matches wizard purpose step
  eligibilityRules: {
    maxAge?: number;
    minAge?: number;
    maxIncomeLPA?: number;
    genders?: string[];
    categories?: string[];
    minEducation?: "none" | "primary" | "secondary" | "graduation" | "postgrad";
    purposes?: string[]; // optional purpose filter
  };
}

const EDUCATION_RANK: Record<string, number> = {
  none: 0, primary: 1, secondary: 2, graduation: 3, postgrad: 4,
};

function educationRank(edu: string): number {
  const e = edu.toLowerCase();
  if (e.includes("post") || e.includes("master") || e.includes("phd") || e.includes("mba")) return 4;
  if (e.includes("graduat") || e.includes("bachelor") || e.includes("degree") || e.includes("b.tech")) return 3;
  if (e.includes("12") || e.includes("hsc") || e.includes("inter") || e.includes("higher secondary")) return 2;
  if (e.includes("10") || e.includes("ssc") || e.includes("matriculat") || e.includes("secondary")) return 1;
  return 0;
}

export const schemes: Scheme[] = [
  {
    id: "pmmy",
    name: "MUDRA Loan (PMMY)",
    nameHi: "मुद्रा लोन (PMMY)",
    ministry: "Ministry of Finance / MUDRA",
    ministryHi: "वित्त मंत्रालय / मुद्रा",
    description: "Collateral-free business loans up to ₹10 lakh for micro and small enterprises — no guarantor needed.",
    descriptionHi: "छोटे व्यापार के लिए बिना गारंटर के ₹10 लाख तक का लोन — कोई जमानत नहीं चाहिए।",
    benefits: "Loan up to ₹10 lakh: Shishu (≤₹50K), Kishore (₹50K–₹5L), Tarun (₹5L–₹10L). No collateral.",
    benefitsHi: "शिशु: ₹50K तक | किशोर: ₹50K–₹5L | तरुण: ₹5L–₹10L। कोई गिरवी नहीं।",
    eligibility: "Any adult Indian with a non-farm business plan. No prior bank default.",
    eligibilityHi: "कोई भी 18+ भारतीय जिसका खेती से अलग व्यापार हो। कोई बैंक बकाया न हो।",
    whyGoodForYou: "Perfect if you want to start or expand a small shop, salon, tailoring unit, or any small business with zero collateral.",
    whyGoodForYouHi: "अगर आप दुकान, सैलून, दर्जी, या कोई छोटा व्यापार शुरू करना चाहते हैं — बिना किसी चीज गिरवी रखे।",
    estimatedBenefit: "Loan ₹50,000 – ₹10,00,000",
    estimatedBenefitHi: "ऋण ₹50,000 – ₹10,00,000",
    applySteps: [
      { step: "Go to any bank or NBFC with your Aadhaar + PAN + business plan", stepHi: "आधार, PAN और बिज़नेस प्लान लेकर किसी भी बैंक जाएं" },
      { step: "Fill the MUDRA loan application form (also at mudra.org.in)", stepHi: "मुद्रा लोन फॉर्म भरें (mudra.org.in पर भी उपलब्ध)" },
      { step: "Submit passport photo, address proof, and 6-month bank statement", stepHi: "फोटो, पता प्रमाण और 6 महीने का बैंक स्टेटमेंट दें" },
      { step: "Bank approves within 7–14 working days. Amount credited to account.", stepHi: "बैंक 7–14 दिनों में मंजूरी देता है। राशि खाते में आती है।" },
    ],
    applyUrl: "https://www.mudra.org.in",
    tag: "Business Loan", tagHi: "बिज़नेस लोन",
    tagColor: "bg-orange-100 text-orange-700",
    purposeTags: ["business"],
    eligibilityRules: { minAge: 18, maxIncomeLPA: 15 },
  },
  {
    id: "pmegp",
    name: "PMEGP (PM Employment Generation Programme)",
    nameHi: "PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम)",
    ministry: "Ministry of MSME / KVIC",
    ministryHi: "MSME मंत्रालय / KVIC",
    description: "Government subsidy of 15–35% on project cost to set up new manufacturing or service enterprises in rural/urban areas.",
    descriptionHi: "नई मैन्युफैक्चरिंग या सेवा इकाई के लिए परियोजना लागत पर 15–35% सब्सिडी।",
    benefits: "Subsidy: 15% urban general, 25% rural general, 35% SC/ST/Women/Ex-servicemen. Project up to ₹50 lakh (manufacturing) or ₹20 lakh (services).",
    benefitsHi: "सब्सिडी: शहरी सामान्य 15%, ग्रामीण सामान्य 25%, SC/ST/महिला 35%। परियोजना ₹50 लाख (मैन्युफैक्चरिंग) या ₹20 लाख (सेवाएं) तक।",
    eligibility: "Age 18+, at least 8th pass for project above ₹10 lakh. Indian citizen. No prior government subsidy taken.",
    eligibilityHi: "18+ वर्ष, ₹10 लाख से ऊपर के प्रोजेक्ट के लिए 8वीं पास। कोई पुरानी सरकारी सब्सिडी न ली हो।",
    whyGoodForYou: "Best for starting a medium-sized business like food processing, garment making, or a workshop — government pays up to 35% of your setup cost.",
    whyGoodForYouHi: "खाना प्रसंस्करण, कपड़ा उद्योग, या कोई वर्कशॉप शुरू करने के लिए — सरकार आपकी लागत का 35% तक देती है।",
    estimatedBenefit: "Subsidy ₹75,000 – ₹17,50,000",
    estimatedBenefitHi: "सब्सिडी ₹75,000 – ₹17,50,000",
    applySteps: [
      { step: "Register on kviconline.gov.in and fill the PMEGP e-application", stepHi: "kviconline.gov.in पर पंजीकरण करें और PMEGP e-आवेदन भरें" },
      { step: "Submit project report, Aadhaar, PAN, caste certificate (if applicable)", stepHi: "प्रोजेक्ट रिपोर्ट, आधार, PAN, जाति प्रमाण (यदि लागू हो) जमा करें" },
      { step: "KVIC/KVIB reviews and forwards to bank for loan sanction", stepHi: "KVIC/KVIB समीक्षा करके बैंक को ऋण मंजूरी के लिए भेजता है" },
      { step: "After loan disbursement, subsidy is locked for 3 years then released", stepHi: "ऋण मिलने के बाद सब्सिडी 3 साल बाद खाते में आती है" },
    ],
    applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    tag: "Business Subsidy", tagHi: "बिज़नेस सब्सिडी",
    tagColor: "bg-amber-100 text-amber-700",
    purposeTags: ["business"],
    eligibilityRules: { minAge: 18, maxIncomeLPA: 20 },
  },
  {
    id: "standup-india",
    name: "Stand-Up India",
    nameHi: "स्टैंड-अप इंडिया",
    ministry: "Department of Financial Services / SIDBI",
    ministryHi: "वित्तीय सेवा विभाग / SIDBI",
    description: "Bank loans from ₹10 lakh to ₹1 crore for SC/ST and Women entrepreneurs to set up new manufacturing, service, or trade enterprises.",
    descriptionHi: "SC/ST और महिला उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक का बैंक लोन।",
    benefits: "Composite loan of ₹10 lakh–₹1 crore covering 75% of project cost. Repayment up to 7 years.",
    benefitsHi: "₹10 लाख – ₹1 करोड़ का लोन (परियोजना का 75%)। 7 साल तक वापसी का समय।",
    eligibility: "SC/ST borrowers OR Women entrepreneurs. Age 18+. Setting up a greenfield enterprise.",
    eligibilityHi: "SC/ST या महिला उद्यमी। 18+ वर्ष। नई इकाई स्थापित करनी हो।",
    whyGoodForYou: "Ideal for SC/ST or women wanting to start a bigger business — one of the highest loan amounts available without needing heavy collateral.",
    whyGoodForYouHi: "SC/ST या महिलाओं के लिए बड़ा व्यापार शुरू करने का सबसे अच्छा तरीका — भारी गारंटी के बिना बड़ा लोन।",
    estimatedBenefit: "Loan ₹10 lakh – ₹1 crore",
    estimatedBenefitHi: "ऋण ₹10 लाख – ₹1 करोड़",
    applySteps: [
      { step: "Visit standupmitra.in to find nearby nodal banks", stepHi: "standupmitra.in पर जाकर नजदीकी बैंक खोजें" },
      { step: "Prepare a project report showing business viability", stepHi: "व्यापार की व्यवहार्यता दिखाते हुए एक प्रोजेक्ट रिपोर्ट तैयार करें" },
      { step: "Submit SC/ST certificate or women declaration with Aadhaar, PAN", stepHi: "SC/ST प्रमाण पत्र या महिला घोषणा, आधार, PAN के साथ जमा करें" },
      { step: "Bank processes and sanctions within 30–45 days", stepHi: "बैंक 30–45 दिनों में मंजूरी देता है" },
    ],
    applyUrl: "https://www.standupmitra.in",
    tag: "Entrepreneurship", tagHi: "उद्यमिता",
    tagColor: "bg-yellow-100 text-yellow-700",
    purposeTags: ["business"],
    eligibilityRules: {
      minAge: 18,
      categories: ["sc", "st", "scheduled caste", "scheduled tribe"],
      genders: ["female", "woman", "women", "girl"],
    },
  },
  {
    id: "pmkvy",
    name: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)",
    nameHi: "PMKVY (प्रधानमंत्री कौशल विकास योजना)",
    ministry: "Ministry of Skill Development",
    ministryHi: "कौशल विकास मंत्रालय",
    description: "Free short-term skill training (3 months to 1 year) in 30+ sectors like IT, construction, beauty, healthcare, and hospitality with government certification.",
    descriptionHi: "IT, निर्माण, ब्यूटी, स्वास्थ्य, और हॉस्पिटैलिटी समेत 30+ क्षेत्रों में मुफ़्त कौशल प्रशिक्षण (3 महीने से 1 साल) और सरकारी सर्टिफिकेट।",
    benefits: "Free training + ₹500–₹1,500/month stipend + government-recognized certificate + job placement support.",
    benefitsHi: "मुफ़्त प्रशिक्षण + ₹500–₹1,500/माह वजीफा + सरकारी सर्टिफिकेट + नौकरी में मदद।",
    eligibility: "Indian citizens aged 15–45. Dropouts to graduates. No prior training in same sector.",
    eligibilityHi: "15–45 वर्ष के भारतीय। ड्रॉपआउट से लेकर ग्रेजुएट तक।",
    whyGoodForYou: "Great if you want a job-ready certificate in a growing field — completely free, you even get a monthly stipend while training.",
    whyGoodForYouHi: "बिना पैसे के एक अच्छा सर्टिफिकेट और नौकरी पाने का मौका — प्रशिक्षण के दौरान वजीफा भी मिलता है।",
    estimatedBenefit: "Free training + ₹500–1,500/month stipend",
    estimatedBenefitHi: "मुफ़्त प्रशिक्षण + ₹500–1,500/माह",
    applySteps: [
      { step: "Visit skillindiadigital.gov.in and search for courses near you", stepHi: "skillindiadigital.gov.in पर जाएं और अपने पास के कोर्स खोजें" },
      { step: "Register with Aadhaar, select a trade/course of your choice", stepHi: "आधार से रजिस्टर करें, अपना पसंदीदा कोर्स चुनें" },
      { step: "Visit nearest PMKVY training centre for enrollment", stepHi: "नजदीकी PMKVY प्रशिक्षण केंद्र जाकर दाखिला लें" },
      { step: "Complete training, pass assessment, receive government certificate", stepHi: "प्रशिक्षण पूरा करें, परीक्षा दें, सर्टिफिकेट प्राप्त करें" },
    ],
    applyUrl: "https://www.pmkvyofficial.org",
    tag: "Skill Training", tagHi: "कौशल प्रशिक्षण",
    tagColor: "bg-cyan-100 text-cyan-700",
    purposeTags: ["skill", "business"],
    eligibilityRules: { minAge: 15, maxAge: 45, maxIncomeLPA: 10 },
  },
  {
    id: "pmkisan",
    name: "PM-KISAN (Kisan Samman Nidhi)",
    nameHi: "PM-किसान (किसान सम्मान निधि)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    ministryHi: "कृषि और किसान कल्याण मंत्रालय",
    description: "Direct income support of ₹6,000 per year for farmer families, sent in three instalments to the Aadhaar-linked bank account.",
    descriptionHi: "किसान परिवारों को साल में ₹6,000 की सीधी मदद — तीन किस्तों में आधार-लिंक्ड बैंक खाते में।",
    benefits: "₹6,000/year in 3 instalments of ₹2,000 each via Direct Benefit Transfer (DBT).",
    benefitsHi: "₹2,000 की 3 किस्तों में साल में ₹6,000 सीधे खाते में।",
    eligibility: "All landholding farmer families. Excludes income taxpayers and government employees.",
    eligibilityHi: "सभी भूमिधारक किसान परिवार। आयकर दाता और सरकारी कर्मचारी शामिल नहीं।",
    whyGoodForYou: "If you own farmland, this gives you guaranteed ₹2,000 every 4 months — no applications needed after first registration.",
    whyGoodForYouHi: "अगर आपके पास खेत है तो हर 4 महीने पर ₹2,000 पक्के मिलेंगे — एक बार रजिस्ट्रेशन के बाद अपने आप आता है।",
    estimatedBenefit: "₹6,000 per year (guaranteed)",
    estimatedBenefitHi: "₹6,000 प्रति वर्ष (गारंटीड)",
    applySteps: [
      { step: "Visit pmkisan.gov.in and click 'Farmer Corner → New Farmer Registration'", stepHi: "pmkisan.gov.in पर जाएं, 'किसान कोना → नया किसान पंजीकरण' पर क्लिक करें" },
      { step: "Enter Aadhaar number and mobile number linked to bank account", stepHi: "बैंक से जुड़ा आधार नंबर और मोबाइल नंबर डालें" },
      { step: "Submit land ownership documents (Khasra/Khatauni)", stepHi: "जमीन के कागज (खसरा/खतौनी) जमा करें" },
      { step: "Verification by local Patwari/Revenue officer. First instalment within 60 days.", stepHi: "पटवारी/राजस्व अधिकारी से जांच। 60 दिन में पहली किस्त।" },
    ],
    applyUrl: "https://pmkisan.gov.in",
    tag: "Agriculture", tagHi: "कृषि",
    tagColor: "bg-green-100 text-green-700",
    purposeTags: ["farming"],
    eligibilityRules: { maxIncomeLPA: 5 },
  },
  {
    id: "fasal-bima",
    name: "PM Fasal Bima Yojana",
    nameHi: "PM फसल बीमा योजना",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    ministryHi: "कृषि और किसान कल्याण मंत्रालय",
    description: "Crop insurance protecting farmers against losses from drought, flood, pest, and other natural calamities at very low premium rates.",
    descriptionHi: "सूखा, बाढ़, कीट और प्राकृतिक आपदाओं से फसल बर्बादी पर बीमा — बहुत कम प्रीमियम पर।",
    benefits: "Premium just 2% for Kharif, 1.5% for Rabi, 5% for commercial crops. Full sum insured paid on crop loss.",
    benefitsHi: "प्रीमियम: खरीफ 2%, रबी 1.5%, व्यावसायिक फसल 5%। फसल नष्ट होने पर पूरी बीमित राशि।",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops.",
    eligibilityHi: "सभी किसान — बटाईदार और किराएदार किसान भी — जो अधिसूचित फसल उगाते हैं।",
    whyGoodForYou: "If your crop fails due to bad weather or pests, you get the full insured amount — protecting your whole year's income.",
    whyGoodForYouHi: "खराब मौसम या कीट से फसल बर्बाद हो तो पूरी बीमित राशि मिलेगी — पूरे साल की मेहनत सुरक्षित रहेगी।",
    estimatedBenefit: "Insured sum based on crop type & area",
    estimatedBenefitHi: "फसल प्रकार और क्षेत्र के अनुसार बीमित राशि",
    applySteps: [
      { step: "Visit pmfby.gov.in or go to your nearest bank branch before sowing season", stepHi: "बुवाई से पहले pmfby.gov.in या नजदीकी बैंक शाखा जाएं" },
      { step: "Fill the PMFBY application with crop details, land area, Aadhaar, bank details", stepHi: "PMFBY फॉर्म में फसल, जमीन, आधार, बैंक जानकारी भरें" },
      { step: "Pay your share of premium (just 1.5–5%)", stepHi: "अपना प्रीमियम (सिर्फ 1.5–5%) जमा करें" },
      { step: "In case of crop damage, report within 72 hours to bank/insurance company", stepHi: "फसल नुकसान पर 72 घंटे में बैंक/बीमा कंपनी को सूचित करें" },
    ],
    applyUrl: "https://pmfby.gov.in",
    tag: "Crop Insurance", tagHi: "फसल बीमा",
    tagColor: "bg-lime-100 text-lime-700",
    purposeTags: ["farming"],
    eligibilityRules: { maxIncomeLPA: 8 },
  },
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    nameHi: "प्रधानमंत्री आवास योजना (PMAY)",
    ministry: "Ministry of Housing & Urban Affairs",
    ministryHi: "आवास और शहरी मामले मंत्रालय",
    description: "Interest subsidy and cash assistance for housing to EWS, LIG, and MIG families under the Housing for All mission.",
    descriptionHi: "EWS, LIG और MIG परिवारों के लिए मकान बनाने पर ब्याज सब्सिडी और नकद सहायता।",
    benefits: "Interest subsidy 3–6.5% on home loans up to ₹12 lakh; ₹1.5 lakh direct cash for rural beneficiaries.",
    benefitsHi: "₹12 लाख तक के होम लोन पर 3–6.5% ब्याज सब्सिडी; ग्रामीण के लिए ₹1.5 लाख नकद सहायता।",
    eligibility: "Annual income up to ₹18 LPA. No pucca house owned by family in India.",
    eligibilityHi: "सालाना आमदनी ₹18 लाख तक। परिवार के किसी सदस्य के पास कोई पक्का मकान न हो।",
    whyGoodForYou: "If you don't own a pucca home, this cuts your home loan interest significantly — saving lakhs over the loan period.",
    whyGoodForYouHi: "अगर आपके पास पक्का मकान नहीं है, तो होम लोन का ब्याज काफी कम हो जाता है — लाखों की बचत होती है।",
    estimatedBenefit: "Interest saving ₹2–6 lakh over loan period",
    estimatedBenefitHi: "लोन अवधि में ₹2–6 लाख ब्याज की बचत",
    applySteps: [
      { step: "Visit pmaymis.gov.in and check if your area is listed under PMAY", stepHi: "pmaymis.gov.in पर जाएं और देखें कि आपका इलाका PMAY में है या नहीं" },
      { step: "Apply through any bank, HFC, or PMAY-registered lender", stepHi: "किसी भी बैंक, HFC या PMAY-पंजीकृत ऋणदाता के पास आवेदन करें" },
      { step: "Submit income proof, Aadhaar, address proof, no-house affidavit", stepHi: "आय प्रमाण, आधार, पता प्रमाण, और मकान न होने का शपथ पत्र दें" },
      { step: "Subsidy credited directly to loan account, reducing EMI", stepHi: "सब्सिडी सीधे लोन खाते में जमा होती है, EMI कम हो जाती है" },
    ],
    applyUrl: "https://pmaymis.gov.in",
    tag: "Housing", tagHi: "आवास",
    tagColor: "bg-blue-100 text-blue-700",
    purposeTags: ["housing"],
    eligibilityRules: { maxIncomeLPA: 18 },
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat – PM-JAY",
    nameHi: "आयुष्मान भारत – PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    ministryHi: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
    description: "World's largest government health insurance — ₹5 lakh per family per year for cashless hospital treatment at thousands of empanelled hospitals.",
    descriptionHi: "दुनिया का सबसे बड़ा सरकारी स्वास्थ्य बीमा — प्रति परिवार ₹5 लाख सालाना कैशलेस इलाज।",
    benefits: "₹5 lakh/year per family. No premium. No co-payment. No cap on family size. Covers pre-existing diseases.",
    benefitsHi: "प्रति परिवार ₹5 लाख/वर्ष। कोई प्रीमियम नहीं। कोई सह-भुगतान नहीं। पुरानी बीमारियां भी कवर।",
    eligibility: "BPL / EWS families. Listed in SECC 2011 data. Deprived rural and urban occupational families.",
    eligibilityHi: "BPL/EWS परिवार। SECC 2011 डेटा में शामिल। वंचित ग्रामीण और शहरी परिवार।",
    whyGoodForYou: "One serious illness can drain a family's savings. This gives your whole family ₹5 lakh hospital cover — completely free.",
    whyGoodForYouHi: "एक बड़ी बीमारी परिवार को बर्बाद कर सकती है। यह पूरे परिवार को ₹5 लाख का अस्पताल कवर देती है — बिल्कुल मुफ़्त।",
    estimatedBenefit: "₹5,00,000 health cover per year",
    estimatedBenefitHi: "₹5,00,000 स्वास्थ्य कवर प्रति वर्ष",
    applySteps: [
      { step: "Check eligibility at pmjay.gov.in using Aadhaar or ration card number", stepHi: "pmjay.gov.in पर आधार या राशन कार्ड से पात्रता जांचें" },
      { step: "Visit nearest Ayushman Bharat empanelled hospital or CSC centre", stepHi: "नजदीकी आयुष्मान भारत अस्पताल या CSC केंद्र जाएं" },
      { step: "Get your Ayushman Bharat card (Golden Card) issued free of cost", stepHi: "मुफ़्त में आयुष्मान भारत कार्ड (गोल्डन कार्ड) बनवाएं" },
      { step: "Show card at any empanelled hospital for cashless treatment", stepHi: "किसी भी सूचीबद्ध अस्पताल में कार्ड दिखाकर कैशलेस इलाज पाएं" },
    ],
    applyUrl: "https://pmjay.gov.in",
    tag: "Health", tagHi: "स्वास्थ्य",
    tagColor: "bg-red-100 text-red-700",
    purposeTags: ["health"],
    eligibilityRules: { maxIncomeLPA: 3 },
  },
  {
    id: "nsp-sc",
    name: "NSP SC Post-Matric Scholarship",
    nameHi: "NSP SC पोस्ट-मैट्रिक छात्रवृत्ति",
    ministry: "Ministry of Social Justice & Empowerment",
    ministryHi: "सामाजिक न्याय और अधिकारिता मंत्रालय",
    description: "Financial assistance to Scheduled Caste students for post-Class-10 education — covers fees and living expenses.",
    descriptionHi: "अनुसूचित जाति के छात्रों को 10वीं के बाद की पढ़ाई के लिए — फीस और रहन-सहन खर्च का भुगतान।",
    benefits: "Full tuition fee reimbursement + maintenance allowance ₹380–₹1,200/month by course level.",
    benefitsHi: "पूरी ट्यूशन फीस + ₹380–₹1,200/माह रखरखाव भत्ता (कोर्स स्तर के अनुसार)।",
    eligibility: "SC category. Family income ≤ ₹2.5 LPA. Studying in 11th grade or recognized higher education.",
    eligibilityHi: "SC वर्ग। परिवारिक आय ≤ ₹2.5 लाख। 11वीं कक्षा या मान्यता प्राप्त उच्च शिक्षा में पढ़ रहे हों।",
    whyGoodForYou: "SC students can pursue higher education without worrying about fees — the government pays everything and gives a monthly stipend too.",
    whyGoodForYouHi: "SC छात्र बिना फीस की चिंता किए उच्च शिक्षा ले सकते हैं — सरकार सब देती है और मासिक वजीफा भी।",
    estimatedBenefit: "Full fees + ₹380–1,200/month",
    estimatedBenefitHi: "पूरी फीस + ₹380–1,200/माह",
    applySteps: [
      { step: "Register on scholarships.gov.in National Scholarship Portal", stepHi: "scholarships.gov.in राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण करें" },
      { step: "Fill application with Aadhaar, income certificate, caste certificate, mark sheets", stepHi: "आधार, आय प्रमाण, जाति प्रमाण पत्र, अंकसूची के साथ आवेदन भरें" },
      { step: "Institution verifies and forwards to state nodal department", stepHi: "संस्थान जांच करके राज्य नोडल विभाग को भेजता है" },
      { step: "Scholarship credited to Aadhaar-linked bank account before semester", stepHi: "छात्रवृत्ति सेमेस्टर से पहले आधार-लिंक्ड बैंक खाते में आती है" },
    ],
    applyUrl: "https://scholarships.gov.in",
    tag: "Scholarship", tagHi: "छात्रवृत्ति",
    tagColor: "bg-purple-100 text-purple-700",
    purposeTags: ["education"],
    eligibilityRules: {
      categories: ["sc", "scheduled caste"],
      maxIncomeLPA: 2.5, minAge: 15, maxAge: 30, minEducation: "secondary",
    },
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana",
    nameHi: "सुकन्या समृद्धि योजना",
    ministry: "Ministry of Finance",
    ministryHi: "वित्त मंत्रालय",
    description: "High-interest savings scheme for girl children — helps build a tax-free corpus for education and marriage expenses.",
    descriptionHi: "बालिकाओं के लिए उच्च ब्याज बचत योजना — शिक्षा और विवाह के लिए कर-मुक्त राशि बनाएं।",
    benefits: "~8.2% annual interest (highest among small savings). Tax-free maturity. 80C deduction up to ₹1.5 lakh/year.",
    benefitsHi: "~8.2% सालाना ब्याज (सबसे ऊंचा)। कर-मुक्त परिपक्वता। 80C में ₹1.5 लाख तक कटौती।",
    eligibility: "Parent/guardian of a girl child below 10 years. Max 2 accounts per family.",
    eligibilityHi: "10 साल से कम की बालिका के माता-पिता/अभिभावक। प्रति परिवार अधिकतम 2 खाते।",
    whyGoodForYou: "Invest as little as ₹250/month and get the highest guaranteed return in India for your daughter's future.",
    whyGoodForYouHi: "सिर्फ ₹250/माह से शुरू करें और अपनी बेटी के भविष्य के लिए भारत में सबसे ऊंचा गारंटीड ब्याज पाएं।",
    estimatedBenefit: "~₹15–69 lakh at maturity (based on deposit)",
    estimatedBenefitHi: "परिपक्वता पर ~₹15–69 लाख (जमा राशि के अनुसार)",
    applySteps: [
      { step: "Visit any post office or authorized bank branch with girl's birth certificate", stepHi: "बालिका का जन्म प्रमाण पत्र लेकर किसी पोस्ट ऑफिस या बैंक जाएं" },
      { step: "Fill SSY account opening form with parent Aadhaar and address proof", stepHi: "SSY खाता खोलने का फॉर्म, माता-पिता का आधार और पता प्रमाण भरें" },
      { step: "Deposit minimum ₹250 to open. Maximum ₹1.5 lakh/year.", stepHi: "खाता खोलने के लिए न्यूनतम ₹250 जमा करें। अधिकतम ₹1.5 लाख/वर्ष।" },
      { step: "Deposit annually for 15 years. Account matures in 21 years.", stepHi: "15 साल तक सालाना जमा करें। खाता 21 साल में परिपक्व होता है।" },
    ],
    applyUrl: "https://www.nsiindia.gov.in",
    tag: "Girl Child", tagHi: "बालिका",
    tagColor: "bg-pink-100 text-pink-700",
    purposeTags: ["education", "all"],
    eligibilityRules: { genders: ["female", "girl", "woman"], maxAge: 10 },
  },
  {
    id: "svnidhi",
    name: "PM SVANidhi (Street Vendor Loan)",
    nameHi: "PM SVANidhi (स्ट्रीट वेंडर लोन)",
    ministry: "Ministry of Housing & Urban Affairs",
    ministryHi: "आवास और शहरी मामले मंत्रालय",
    description: "Collateral-free working capital loans for street vendors and small traders to restart/grow their livelihoods after COVID-19.",
    descriptionHi: "फेरीवालों और छोटे व्यापारियों के लिए बिना गारंटी कार्यशील पूंजी ऋण।",
    benefits: "₹10,000 (first), ₹20,000 (second), ₹50,000 (third loan). 7% interest subsidy. No collateral.",
    benefitsHi: "पहला लोन ₹10,000, दूसरा ₹20,000, तीसरा ₹50,000। 7% ब्याज सब्सिडी। कोई गारंटी नहीं।",
    eligibility: "Street vendors with Certificate of Vending or Letter of Recommendation from Urban Local Body.",
    eligibilityHi: "फेरी का प्रमाण पत्र या नगर पालिका का पत्र वाले विक्रेता।",
    whyGoodForYou: "If you're a street vendor — vegetable seller, chai stall, cobbler — this gets you quick cash to restart or grow, at subsidized interest.",
    whyGoodForYouHi: "अगर आप सब्जी, चाय, मोची, या कोई भी फेरीवाला हैं — तो यह जल्दी कैश देता है, कम ब्याज पर।",
    estimatedBenefit: "Loan ₹10,000 – ₹50,000",
    estimatedBenefitHi: "ऋण ₹10,000 – ₹50,000",
    applySteps: [
      { step: "Visit pmsvanidhi.mohua.gov.in and apply online with Aadhaar", stepHi: "pmsvanidhi.mohua.gov.in पर जाएं और आधार से ऑनलाइन आवेदन करें" },
      { step: "OR visit nearest Urban Local Body (municipality office) for certificate", stepHi: "या नजदीकी नगर पालिका कार्यालय जाकर प्रमाण पत्र लें" },
      { step: "Submit application to any bank/NBFC/MFI with ULB certificate", stepHi: "ULB प्रमाण पत्र के साथ बैंक/NBFC/MFI में आवेदन दें" },
      { step: "Loan approved within 30 days. Repay on time to get higher next loan.", stepHi: "30 दिन में लोन मिलता है। समय पर चुकाएं तो अगला लोन ज्यादा मिलेगा।" },
    ],
    applyUrl: "https://pmsvanidhi.mohua.gov.in",
    tag: "Vendor Loan", tagHi: "वेंडर लोन",
    tagColor: "bg-teal-100 text-teal-700",
    purposeTags: ["business"],
    eligibilityRules: { minAge: 18, maxIncomeLPA: 5 },
  },
  {
    id: "apy",
    name: "Atal Pension Yojana (APY)",
    nameHi: "अटल पेंशन योजना (APY)",
    ministry: "Ministry of Finance / PFRDA",
    ministryHi: "वित्त मंत्रालय / PFRDA",
    description: "Guaranteed pension of ₹1,000–₹5,000/month after age 60 for unorganised sector workers who contribute monthly now.",
    descriptionHi: "असंगठित क्षेत्र के श्रमिकों के लिए 60 साल के बाद ₹1,000–₹5,000/माह की गारंटीड पेंशन।",
    benefits: "Guaranteed monthly pension ₹1,000–₹5,000 from age 60. Government co-contributes 50% (up to ₹1,000/year) for first 5 years.",
    benefitsHi: "60 साल के बाद ₹1,000–₹5,000/माह गारंटीड पेंशन। शुरुआती 5 साल सरकार 50% (₹1,000/वर्ष तक) देती है।",
    eligibility: "Age 18–40. Savings bank account. Not an income tax payer.",
    eligibilityHi: "18–40 वर्ष। बचत बैंक खाता हो। आयकर दाता न हो।",
    whyGoodForYou: "If you work as a daily wage earner or in the informal sector, this is the simplest way to secure a pension for old age — government adds money too.",
    whyGoodForYouHi: "दिहाड़ी मजदूर या असंगठित क्षेत्र में काम करते हैं तो यह बुढ़ापे की पेंशन का सबसे आसान तरीका है — सरकार भी पैसा देती है।",
    estimatedBenefit: "₹1,000–5,000/month pension after 60",
    estimatedBenefitHi: "60 साल के बाद ₹1,000–5,000/माह पेंशन",
    applySteps: [
      { step: "Visit any bank branch where you have a savings account", stepHi: "जिस बैंक में आपका बचत खाता है वहां जाएं" },
      { step: "Fill APY subscription form — choose your desired pension amount", stepHi: "APY सदस्यता फॉर्म भरें — अपनी पसंदीदा पेंशन राशि चुनें" },
      { step: "Auto-debit set up for monthly contribution from your account", stepHi: "आपके खाते से मासिक योगदान के लिए ऑटो-डेबिट सेट होगा" },
      { step: "Receive pension at 60. Nominee gets corpus if you pass away.", stepHi: "60 साल में पेंशन मिलेगी। मृत्यु पर नॉमिनी को राशि मिलेगी।" },
    ],
    applyUrl: "https://www.npscra.nsdl.co.in/scheme-details.php",
    tag: "Pension", tagHi: "पेंशन",
    tagColor: "bg-indigo-100 text-indigo-700",
    purposeTags: ["all"],
    eligibilityRules: { minAge: 18, maxAge: 40 },
  },
  {
    id: "jan-dhan",
    name: "PM Jan Dhan Yojana",
    nameHi: "PM जन धन योजना",
    ministry: "Ministry of Finance",
    ministryHi: "वित्त मंत्रालय",
    description: "Zero-balance bank account for unbanked citizens with free RuPay debit card, ₹2 lakh accident insurance, and ₹30,000 life insurance.",
    descriptionHi: "बिना बैंक खाते वालों के लिए जीरो बैलेंस खाता — मुफ़्त RuPay कार्ड, ₹2 लाख दुर्घटना बीमा और ₹30,000 जीवन बीमा।",
    benefits: "Zero-balance account + free RuPay card + ₹2 lakh accident insurance + ₹30,000 life insurance + overdraft up to ₹10,000.",
    benefitsHi: "जीरो बैलेंस खाता + मुफ़्त RuPay कार्ड + ₹2 लाख दुर्घटना बीमा + ₹30,000 जीवन बीमा + ₹10,000 ओवरड्राफ्ट।",
    eligibility: "Any Indian citizen above 10 years without a bank account. No minimum balance required.",
    eligibilityHi: "बिना बैंक खाते वाला कोई भी 10+ वर्ष का भारतीय। न्यूनतम बैलेंस की जरूरत नहीं।",
    whyGoodForYou: "Opens the door to all other schemes — most government benefits come directly to your bank account. Plus free insurance.",
    whyGoodForYouHi: "बाकी सभी योजनाओं का दरवाजा खुलता है — ज्यादातर सरकारी लाभ सीधे बैंक खाते में आते हैं। साथ में मुफ़्त बीमा।",
    estimatedBenefit: "₹2 lakh accident + ₹30,000 life insurance free",
    estimatedBenefitHi: "₹2 लाख दुर्घटना + ₹30,000 जीवन बीमा मुफ़्त",
    applySteps: [
      { step: "Visit any bank branch or Business Correspondent (BC) agent nearby", stepHi: "नजदीकी बैंक शाखा या बिजनेस कॉरेस्पोंडेंट (BC) एजेंट के पास जाएं" },
      { step: "Bring Aadhaar card and one passport-size photo", stepHi: "आधार कार्ड और एक पासपोर्ट साइज फोटो लाएं" },
      { step: "Fill account opening form. Account opened instantly.", stepHi: "खाता खोलने का फॉर्म भरें। खाता तुरंत खुलता है।" },
      { step: "Get RuPay card in 15 days. Activate by using it once at ATM.", stepHi: "15 दिन में RuPay कार्ड मिलेगा। ATM पर एक बार उपयोग से सक्रिय करें।" },
    ],
    applyUrl: "https://pmjdy.gov.in",
    tag: "Banking", tagHi: "बैंकिंग",
    tagColor: "bg-sky-100 text-sky-700",
    purposeTags: ["all"],
    eligibilityRules: { minAge: 10, maxIncomeLPA: 5 },
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
}

export function matchSchemes(profile: UserProfile): Scheme[] {
  const userEduRank   = educationRank(profile.education || "none");
  const userCategory  = (profile.category || "").toLowerCase();
  const userGender    = (profile.gender || "").toLowerCase();
  const userPurpose   = (profile.purpose || "all").toLowerCase();

  function genderMatches(userGnd: string, allowed: string[]): boolean {
    const words = userGnd.split(/\s+/);
    return allowed.some(g => userGnd === g || words.includes(g));
  }

  const matched = schemes.filter(scheme => {
    const r = scheme.eligibilityRules;
    if (r.minAge !== undefined && profile.age < r.minAge) return false;
    if (r.maxAge !== undefined && profile.age > r.maxAge) return false;
    if (r.maxIncomeLPA !== undefined && profile.income_lpa > r.maxIncomeLPA) return false;
    if (r.minEducation !== undefined) {
      const required = EDUCATION_RANK[r.minEducation] ?? 0;
      if (userEduRank < required) return false;
    }
    if (scheme.id === "standup-india") {
      const catMatch = r.categories?.some(c => userCategory.includes(c));
      const genMatch = r.genders ? genderMatches(userGender, r.genders) : false;
      if (!catMatch && !genMatch) return false;
      return true;
    }
    if (r.categories && r.categories.length > 0) {
      if (!r.categories.some(c => userCategory.includes(c))) return false;
    }
    if (r.genders && r.genders.length > 0) {
      if (!genderMatches(userGender, r.genders)) return false;
    }
    return true;
  });

  // Sort: purpose-matched schemes first, then rest
  return matched.sort((a, b) => {
    const aMatch = a.purposeTags.includes(userPurpose) || a.purposeTags.includes("all") ? 1 : 0;
    const bMatch = b.purposeTags.includes(userPurpose) || b.purposeTags.includes("all") ? 1 : 0;
    return bMatch - aMatch;
  });
}

export function getMatchScore(scheme: Scheme, profile: UserProfile): number {
  let score = 60;
  const purpose = (profile.purpose || "all").toLowerCase();
  if (scheme.purposeTags.includes(purpose)) score += 30;
  if (scheme.purposeTags.includes("all")) score += 10;
  if (profile.income_lpa < 3 && scheme.eligibilityRules.maxIncomeLPA && scheme.eligibilityRules.maxIncomeLPA <= 5) score += 10;
  return Math.min(score, 99);
}
