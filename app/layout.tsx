// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap", // Prevents FOIT; eliminates font-related CLS
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yojana-matcher.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Yojana Matcher | Sarkari Yojana Eligibility Check – AI Tool 2026",
    template: "%s | Yojana Matcher",
  },
  description:
    "Check your eligibility for Indian government schemes, scholarships, and MSME loans instantly using AI. Sarkari yojana 2026 eligibility check karo seconds mein – PM-KISAN, PMAY, Ayushman Bharat aur more.",
  keywords: [
    "sarkari yojana",
    "government schemes India",
    "sarkari yojana 2026 eligibility",
    "scholarship eligibility AI",
    "msme loans India",
    "PM-KISAN eligibility",
    "PMAY apply online",
    "Ayushman Bharat eligibility",
    "MUDRA loan apply",
    "yojana checker",
    "government scheme eligibility check",
    "India welfare scheme AI",
    "Sukanya Samriddhi eligibility",
  ],
  authors: [{ name: "Yojana Matcher" }],
  creator: "Yojana Matcher",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Yojana Matcher",
    title: "Yojana Matcher | Find Eligible Government Schemes Instantly",
    description:
      "AI-powered tool to check your eligibility for Indian government schemes, scholarships, and MSME loans in seconds.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Yojana Matcher – AI-powered Government Scheme Eligibility Checker for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yojana Matcher | Find Eligible Government Schemes Instantly",
    description:
      "Check your eligibility for sarkari yojana, scholarships & MSME loans in seconds using AI.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// JSON-LD structured data (WebApplication + GovernmentService)
// Improves appearance in AI Search Overviews and rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Yojana Matcher",
      url: SITE_URL,
      description:
        "AI-powered tool to instantly check eligibility for Indian government schemes, scholarships, and loans.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      inLanguage: ["en", "hi"],
      audience: {
        "@type": "Audience",
        geographicArea: {
          "@type": "Country",
          name: "India",
        },
      },
    },
    {
      "@type": "GovernmentService",
      name: "Indian Government Scheme Eligibility Checker",
      url: SITE_URL,
      description:
        "Aggregates publicly available data on Indian Central Government welfare schemes and helps citizens check eligibility using AI.",
      serviceType: "Government Scheme Eligibility Information",
      provider: {
        "@type": "Organization",
        name: "Yojana Matcher",
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      disclaimer:
        "This tool provides informational eligibility estimates only. It is not an official government portal. Always verify eligibility on the official .gov.in website before applying.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={jakartaSans.variable} suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data injected server-side */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to Gemini API origin to reduce TTFB on first search */}
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4977432364397519"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
