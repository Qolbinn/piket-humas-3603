import { LandingNavbar } from "@/components/layout/landing-navbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FaqSection } from "@/components/landing/faq-section";
import { WhatsAppFab } from "@/components/landing/whatsapp-fab";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FaqSection />
      </main>
      <LandingFooter />
      <ScrollToTop />
      <WhatsAppFab />
    </div>
  );
}
