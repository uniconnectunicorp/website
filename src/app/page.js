import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import { Testimonials } from "@/components/sections/Testimonials";
import CTASection from "@/components/home/CTASection";
import { Header } from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <Header />
      {/* <BrandsSection /> */}
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedCoursesSection />
      {/* <Testimonials /> */}
      <CTASection />
    </div>
  );
}
