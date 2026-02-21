// lib/schemes.ts
// Mock database of Indian government schemes with eligibility rules.
// All eligibility data sourced from official .gov.in portals.

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string;
  eligibility: string;
  applyUrl: string; // always .gov.in — no cloaking
  tag: string;
  tagColor: string;
  eligibilityRules: {
    maxAge?: number;
    minAge?: number;
    maxIncomeLPA?: number;
    genders?: string[]; // lowercase strings to match against
    categories?: string[]; // lowercase strings
    minEducation?: "none" | "primary" | "secondary" | "graduation" | "postgrad";
  };
}

// Maps education level labels to a comparable rank
const EDUCATION_RANK: Record<string, number> = {
  none: 0,
  primary: 1,
  secondary: 2,
  graduation: 3,
  postgrad: 4,
};

function educationRank(edu: string): number {
  const e = edu.toLowerCase();
  if (e.includes("post") || e.includes("master") || e.includes("phd") || e.includes("mba") || e.includes("m.tech") || e.includes("m.sc")) return 4;
  if (e.includes("graduat") || e.includes("bachelor") || e.includes("degree") || e.includes("b.tech") || e.includes("b.sc") || e.includes("b.a") || e.includes("be") || e.includes("llb")) return 3;
  if (e.includes("12") || e.includes("hsc") || e.includes("inter") || e.includes("senior") || e.includes("higher secondary") || e.includes("plus two") || e.includes("+2")) return 2;
  if (e.includes("10") || e.includes("ssc") || e.includes("matriculat") || e.includes("high school") || e.includes("secondary")) return 1;
  return 0;
}

export const schemes: Scheme[] = [
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    ministry: "Ministry of Housing & Urban Affairs",
    description:
      "Provides interest subsidies and direct cash assistance for housing to eligible EWS, LIG, and MIG families under the Housing for All mission.",
    benefits:
      "Interest subsidy of 3%–6.5% on home loans up to ₹12 lakh; direct benefit transfer of ₹1.5 lakh for rural beneficiaries.",
    eligibility:
      "Annual household income up to ₹18 LPA. Applicant or family must not own a pucca house in India. Covers EWS, LIG, and MIG-I/II categories.",
    applyUrl: "https://pmaymis.gov.in",
    tag: "Housing",
    tagColor: "bg-blue-100 text-blue-700",
    eligibilityRules: { maxIncomeLPA: 18 },
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN (Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Direct income support of ₹6,000 per year to small and marginal farmer families in three equal instalments directly to their Aadhaar-linked bank account.",
    benefits: "₹6,000/year in 3 instalments of ₹2,000 each via Direct Benefit Transfer (DBT).",
    eligibility:
      "All landholding farmer families. Excludes income taxpayers, institutional land-holders, and holders of constitutional posts.",
    applyUrl: "https://pmkisan.gov.in",
    tag: "Agriculture",
    tagColor: "bg-green-100 text-green-700",
    eligibilityRules: { maxIncomeLPA: 5 },
  },
  {
    id: "nsp-sc",
    name: "NSP SC Post-Matric Scholarship",
    ministry: "Ministry of Social Justice & Empowerment",
    description:
      "Financial assistance to Scheduled Caste students pursuing education beyond Class 10 to reduce dropout rates and improve higher education access.",
    benefits:
      "Full tuition fee reimbursement + maintenance allowance of ₹380–₹1,200/month depending on course level.",
    eligibility:
      "SC category students only. Annual family income ≤ ₹2.5 LPA. Must be enrolled in 11th grade or any recognised higher education.",
    applyUrl: "https://scholarships.gov.in",
    tag: "Scholarship",
    tagColor: "bg-purple-100 text-purple-700",
    eligibilityRules: {
      categories: ["sc", "scheduled caste"],
      maxIncomeLPA: 2.5,
      minAge: 15,
      maxAge: 30,
      minEducation: "secondary",
    },
  },
  {
    id: "pmmy",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    ministry: "Ministry of Finance / MUDRA",
    description:
      "Collateral-free micro-enterprise loans for non-corporate, non-farm income-generating activities under three tiers: Shishu, Kishore, and Tarun.",
    benefits:
      "Loan up to ₹10 lakh: Shishu (≤₹50K), Kishore (₹50K–₹5L), Tarun (₹5L–₹10L) at competitive rates with no collateral required.",
    eligibility:
      "Any adult Indian with a viable non-farm micro/small business plan. Must not be a defaulter with any bank or NBFC.",
    applyUrl: "https://www.mudra.org.in",
    tag: "Business Loan",
    tagColor: "bg-orange-100 text-orange-700",
    eligibilityRules: { minAge: 18, maxIncomeLPA: 15 },
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat – PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    description:
      "World's largest government-funded health insurance scheme providing cashless hospitalisation coverage at empanelled public and private hospitals.",
    benefits:
      "₹5 lakh/year per family for secondary and tertiary hospitalisation. No co-payment. No cap on family size.",
    eligibility:
      "Families listed in SECC 2011 database; BPL / EWS households; deprived rural and occupational urban families as defined by the government.",
    applyUrl: "https://pmjay.gov.in",
    tag: "Health",
    tagColor: "bg-red-100 text-red-700",
    eligibilityRules: { maxIncomeLPA: 3 },
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana (SSY)",
    ministry: "Ministry of Finance",
    description:
      "A small savings scheme exclusively for girl children to secure funds for higher education and marriage, backed by sovereign guarantee.",
    benefits:
      "High interest rate (~8.2% p.a., revised quarterly). Tax-free maturity corpus. 80C deduction up to ₹1.5 lakh/year.",
    eligibility:
      "Parent or guardian of a girl child below 10 years. Maximum 2 accounts per family (3 in case of twin girls).",
    applyUrl: "https://www.nsiindia.gov.in",
    tag: "Girl Child",
    tagColor: "bg-pink-100 text-pink-700",
    eligibilityRules: { genders: ["female", "girl", "woman"], maxAge: 10 },
  },
  {
    id: "standup-india",
    name: "Stand-Up India Scheme",
    ministry: "Department of Financial Services / SIDBI",
    description:
      "Facilitates bank loans between ₹10 lakh and ₹1 crore to SC/ST and Women entrepreneurs for setting up greenfield manufacturing, services, or trade enterprises.",
    benefits:
      "Composite term loan of ₹10 lakh–₹1 crore covering 75% of project cost. Repayment tenure up to 7 years.",
    eligibility:
      "SC/ST borrowers OR Women entrepreneurs. Age 18+. Setting up a greenfield enterprise. No prior default with any bank or financial institution.",
    applyUrl: "https://www.standupmitra.in",
    tag: "Entrepreneurship",
    tagColor: "bg-yellow-100 text-yellow-700",
    eligibilityRules: {
      minAge: 18,
      // Special: SC/ST OR female — handled below
      categories: ["sc", "st", "scheduled caste", "scheduled tribe"],
      genders: ["female", "woman", "women", "girl"],
    },
  },
];

export interface UserProfile {
  age: number;
  gender: string;
  state: string;
  income_lpa: number;
  category: string;
  education: string;
}

export function matchSchemes(profile: UserProfile): Scheme[] {
  const userEduRank = educationRank(profile.education || "none");
  const userCategory = (profile.category || "").toLowerCase();
  const userGender = (profile.gender || "").toLowerCase();

  // Exact-word gender matcher — prevents "male" substring-matching inside "female"
  function genderMatches(userGnd: string, allowed: string[]): boolean {
    const words = userGnd.split(/\s+/);
    return allowed.some((g) => userGnd === g || words.includes(g));
  }

  return schemes.filter((scheme) => {
    const r = scheme.eligibilityRules;

    // Age
    if (r.minAge !== undefined && profile.age < r.minAge) return false;
    if (r.maxAge !== undefined && profile.age > r.maxAge) return false;

    // Income
    if (r.maxIncomeLPA !== undefined && profile.income_lpa > r.maxIncomeLPA) return false;

    // Education floor
    if (r.minEducation !== undefined) {
      const required = EDUCATION_RANK[r.minEducation] ?? 0;
      if (userEduRank < required) return false;
    }

    // Stand-Up India: SC/ST *or* Female (OR logic)
    if (scheme.id === "standup-india") {
      const categoryMatch = r.categories?.some((c) => userCategory.includes(c));
      const genderMatch = r.genders ? genderMatches(userGender, r.genders) : false;
      if (!categoryMatch && !genderMatch) return false;
      return true;
    }

    // Category (AND logic for all other schemes)
    if (r.categories && r.categories.length > 0) {
      if (!r.categories.some((c) => userCategory.includes(c))) return false;
    }

    // Gender — exact word match prevents "male" ⊂ "female" false positive
    if (r.genders && r.genders.length > 0) {
      if (!genderMatches(userGender, r.genders)) return false;
    }

    return true;
  });
}
