import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import Timeline from "@/components/about/Timeline";
import WhatIsIncluded from "@/components/about/WhatIsIncluded";
import GoogleReviews from "@/components/about/GoogleReviews";
import InstagramSection from "@/components/about/InstagramSection";
import FAQ from "@/components/about/FAQ";
import CTABanner from "@/components/about/CTABanner";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AboutHero />
      <Timeline />
      <WhatIsIncluded />
      <GoogleReviews />
      <InstagramSection />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default AboutUs;
