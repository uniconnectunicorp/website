import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import FeaturedCompetenciaSection from "@/components/home/FeaturedCompetenciaSection";
import { Testimonials } from "@/components/sections/Testimonials";
import CTASection from "@/components/home/CTASection";
export default function Home() {
 
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      {/* <BrandsSection /> */}
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedCoursesSection />
      <FeaturedCompetenciaSection />
      {/* <Testimonials /> */}
      <CTASection />
    </div>
  );
}
