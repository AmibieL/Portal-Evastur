import { useLayoutEffect } from "react";
import Navbar from "@/components/Navbar";
import DestinationsHero from "@/components/destinations/DestinationsHero";
import CategoriesSection from "@/components/destinations/CategoriesSection";
import DestinationsCarousel from "@/components/destinations/DestinationsCarousel";
import CruiseCarousel from "@/components/destinations/CruiseCarousel";
import FeaturesSection from "@/components/destinations/FeaturesSection";
import RegionalDestinationsSection from "@/components/destinations/RegionalDestinationsSection";
import ContactCTA from "@/components/destinations/ContactCTA";
import Footer from "@/components/Footer";

const Destinations = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Navbar />
      <DestinationsHero />
      <CategoriesSection />
      <DestinationsCarousel />
      <CruiseCarousel />
      <RegionalDestinationsSection />
      <FeaturesSection />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Destinations;
