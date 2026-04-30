import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorks from "@/components/home/HowItWorks";
import ReviewsSection from "@/components/home/ReviewsSection";
import { CtaSection, Footer } from "@/components/home/CtaFooter";
import Navbar from "@/components/home/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <hr className="border-none border-t border-gold-border" style={{ borderTopWidth: 1, borderColor: "rgba(201,168,76,0.2)" }} />
        <ServicesSection />
        <hr style={{ borderTopWidth: 1, borderColor: "rgba(201,168,76,0.2)" }} />
        <HowItWorks />
        <hr style={{ borderTopWidth: 1, borderColor: "rgba(201,168,76,0.2)" }} />
        <ReviewsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
