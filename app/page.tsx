// app/page.tsx — Server Component shell (metadata + structured data live here)
import NewHomePage from "./_components/NewHomePage";

export const metadata = {
  title: "Yojana Matcher — Find Your Government Scheme | सरकारी योजना खोजें",
  description: "AI-powered tool to match you with Indian government schemes in seconds. Free, instant, no typing needed. PM-KISAN, MUDRA, PMAY, Ayushman Bharat and more.",
};

export default function HomePage() {
  return <NewHomePage />;
}
