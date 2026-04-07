import Navbar from "@/components/Navbar";
import DestinationsHero from "@/components/destinations/DestinationsHero";
import CategoriesSection from "@/components/destinations/CategoriesSection";
import DestinationsCarousel from "@/components/destinations/DestinationsCarousel";
import CruiseCarousel from "@/components/destinations/CruiseCarousel";
import FeaturesSection from "@/components/destinations/FeaturesSection";
import CruzeiroDoSulSection from "@/components/CruzeiroDoSulSection";
import ContactCTA from "@/components/destinations/ContactCTA";
import Footer from "@/components/Footer";

const Destinations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DestinationsHero />
      <CategoriesSection />
      <DestinationsCarousel />
      <CruiseCarousel />
      <CruzeiroDoSulSection />
      <FeaturesSection />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Destinations;
